extends Node
## C3-like runtime: manages layouts, global variables, the event engine,
## and the game loop.

signal layout_changed(layout_name)

const C3Layout = preload("res://c3/c3_layout.gd")

var data: Node = null
var current_layout: Node = null
var current_layout_name: String = ""
var globals: Dictionary = {}          # var name -> value
var var_sid_to_name: Dictionary = {}  # sid -> name
var screen: Vector2 = Vector2(1280, 720)
var canvas_size: Vector2i = Vector2i(1280, 720)
var logical_size: Vector2 = Vector2(1800, 1011)  # C3 canvas size (set by SetCanvasSize)
var display_scale: float = 1.0        # CSS scale from logical canvas to window
var scroll: Vector2 = Vector2.ZERO    # layout scroll origin
var pointer_screen: Vector2 = Vector2(-1, -1)   # last pointer position (screen space)
var pointer_seen: bool = false         # the pointer is inside the window
var pointer_down: bool = false         # a touch is active (mouse held down)
var pointer_clicked: bool = false      # a click/touch happened this frame
var camera_offset: Vector2 = Vector2.ZERO
var camera_zoom: float = 1.0
var tick_count: int = 0
var last_frame_delta: float = 0.0
var _window_size: Vector2i = Vector2i(1280, 720)

var _engine: Node = null
var _layouts_root: Node = null
var _pending_waits: Array = []
var _every_timers: Array = []
var _triggered_once: Dictionary = {}
var _on_layout_start: Array = []
var _layout_name_stack: Array = []

func setup(data_node: Node) -> void:
	data = data_node
	screen = Vector2(data.viewport_size)
	canvas_size = Vector2i(data.viewport_size)
	_ensure_globals()
	_ensure_vars_by_sid()

## Creates the event engine and links it to this runtime.
func create_events() -> Node:
	_engine = load("res://c3/c3_events.gd").new()
	_engine.name = "C3Events"
	add_child(_engine)
	_engine.setup(self, data)
	return _engine

func _ensure_globals() -> void:
	for s in data.event_sheets:
		for v in s.get("vars", []):
			if not globals.has(v["name"]):
				globals[v["name"]] = v["default"]
			var_sid_to_name[v["sid"]] = v["name"]
		# Group-local variables are also addressable by their SID.
		for g in s.get("groups", []):
			for v in g.get("vars", []):
				if not globals.has(v["name"]):
					globals[v["name"]] = v["default"]
				var_sid_to_name[v["sid"]] = v["name"]

## SIDs are exported as strings (Godot's JSON parser turns large integers
## into floats), so they are used as string keys.
func _sid_key(sid) -> String:
	return str(sid)

func _ensure_vars_by_sid() -> void:
	pass

# --------------------------------------------------------------- global vars
func get_global(name: String, fallback: Variant = null) -> Variant:
	return globals.get(name, fallback)

func set_global(name: String, value: Variant) -> void:
	globals[name] = value

func get_global_number(name: String, fallback: float = 0.0) -> float:
	var v = globals.get(name, null)
	if v is float or v is int:
		return float(v)
	return fallback

func get_global_string(name: String, fallback: String = "") -> String:
	var v = globals.get(name, null)
	if v is String:
		return v
	return fallback

func global_by_sid(sid) -> String:
	return var_sid_to_name.get(_sid_key(sid), "")

# --------------------------------------------------------------- layouts
func go_to_layout(lname: String) -> void:
	var sheet_name := ""
	var ldata: Dictionary = data.get_layout(lname)
	if not ldata.is_empty():
		var es = ldata.get("eventSheet", null)
		if es != null:
			sheet_name = str(es)
	# tear down current layout
	if current_layout != null:
		current_layout.queue_free()
		current_layout = null
	var holder := Node2D.new()
	holder.name = "Layout_" + lname
	add_child(holder)
	var lay = C3Layout.new()
	lay.name = "Lay"
	holder.add_child(lay)
	lay.build(lname, data, self)
	current_layout = lay
	current_layout_name = lname
	# Every layout starts at its top-left; the scroll is clamped to the
	# layout bounds in _apply_view.
	scroll = Vector2.ZERO
	layout_changed.emit(lname)
	# fire on-layout-start events for the sheet
	if _engine != null:
		_engine.run_layout_start(sheet_name)

func get_layout() -> Node:
	return current_layout

func instances_of(type_name: String) -> Array:
	return current_layout.get_instances(type_name) if current_layout else []

func first_instance(type_name: String) -> Node:
	return current_layout.get_first(type_name) if current_layout else null

# --------------------------------------------------------------- waits / timers
## Registers a coroutine-style wait: resumes after `seconds`.
func wait_seconds(seconds: float, on_done: Callable) -> void:
	_pending_waits.append({"t": 0.0, "dur": max(seconds, 0.0), "cb": on_done})

## Registers an "every N seconds" timer.
func every_timer(seconds: float, on_tick: Callable) -> void:
	_every_timers.append({"t": 0.0, "dur": max(seconds, 0.0001), "cb": on_tick})

func _input(event: InputEvent) -> void:
	# Pointer tracking for the C3 Touch plugin conditions ("is in touch",
	# "on touch of object").
	if event is InputEventMouseMotion:
		pointer_screen = event.position
		pointer_seen = true
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		pointer_screen = event.position
		pointer_seen = true
		if event.pressed:
			pointer_down = true
			pointer_clicked = true
		else:
			pointer_down = false
	elif event is InputEventScreenTouch:
		pointer_screen = event.position
		pointer_seen = true
		pointer_down = event.pressed
		if event.pressed:
			pointer_clicked = true
	elif event is InputEventScreenDrag:
		pointer_screen = event.position
		pointer_seen = true

func _process(delta: float) -> void:
	tick_count += 1
	last_frame_delta = delta
	_apply_view()
	# waits
	var i := _pending_waits.size() - 1
	while i >= 0:
		var w = _pending_waits[i]
		w["t"] = float(w["t"]) + delta
		if float(w["t"]) >= float(w["dur"]):
			_pending_waits.remove_at(i)
			if w["cb"].is_valid():
				w["cb"].call()
		i -= 1
	# every timers
	for tm in _every_timers:
		tm["t"] = float(tm["t"]) + delta
		while float(tm["t"]) >= float(tm["dur"]):
			tm["t"] = float(tm["t"]) - float(tm["dur"])
			if tm["cb"].is_valid():
				tm["cb"].call()
	_update_tweens(delta)

# --------------------------------------------------------------- tweens
# Tween property indices follow C3's SINGLE_PROPERTIES list.
const TWEEN_PROPS := [
	"offsetX", "offsetY", "offsetZElevation", "offsetWidth", "offsetHeight",
	"offsetDepth", "offsetAngle", "offsetOpacity", "offsetColor",
	"offsetScaleX", "offsetScaleY", "offsetScaleZ",
]

var _tweens: Array = []   # {inst, tag, props:[{idx,from,to}], t, dur, ease}
var _tween_finished: Array = []   # {inst, tag} of tweens that ended this frame

func start_tween(inst: Node, tag: String, props: Array, dur: float, ease_idx: int = 0) -> void:
	if inst == null:
		return
	# Replace an existing tween with the same tag on the same instance
	for i in range(_tweens.size() - 1, -1, -1):
		var tw = _tweens[i]
		if tw["inst"] == inst and tw["tag"] == tag:
			_tweens.remove_at(i)
	var entries: Array = []
	for p in props:
		var idx: int = p[0]
		var to: Variant = p[1]
		var from: float = _get_prop(inst, idx)
		entries.append({"idx": idx, "from": from, "to": to})
	_tweens.append({
		"inst": inst, "tag": tag, "props": entries,
		"t": 0.0, "dur": max(dur, 0.0001), "ease": ease_idx, "done": false,
	})

func _get_prop(inst: Node, idx: int) -> float:
	match idx:
		0: return inst.world_x
		1: return inst.world_y
		2: return inst.world_z
		3: return inst.world_w
		4: return inst.world_h
		6: return inst.world_angle
		7: return inst.opacity * 100.0
		9: return inst.scale_factor
		10: return inst.scale_factor
	return 0.0

func _set_prop(inst: Node, idx: int, v: float) -> void:
	match idx:
		0: inst.set_position_xy(v, inst.world_y)
		1: inst.set_position_xy(inst.world_x, v)
		3:
			inst.set_size(v, inst.world_h)
			if inst.get("_tiled") != null:
				inst.get("_tiled").set_rect_size(Vector2(v, inst.world_h))
		4:
			inst.set_size(inst.world_w, v)
			if inst.get("_tiled") != null:
				inst.get("_tiled").set_rect_size(Vector2(inst.world_w, v))
		6: inst.world_angle = v; inst.rotation = v
		7: inst.set_opacity(v / 100.0)
		9, 10: inst.set_scale_factor(v)
	_update_transform(inst)

func _update_transform(inst: Node) -> void:
	if inst != null and inst.has_method("_update_transform"):
		inst.call("_update_transform")

func _update_tweens(delta: float) -> void:
	for i in range(_tweens.size() - 1, -1, -1):
		var tw = _tweens[i]
		if not is_instance_valid(tw["inst"]):
			_tweens.remove_at(i)
			continue
		tw["t"] = float(tw["t"]) + delta
		var f: float = min(float(tw["t"]) / float(tw["dur"]), 1.0)
		var e := _ease(f, int(tw["ease"]))
		for p in tw["props"]:
			var to: float = p["to"]
			var from: float = p["from"]
			_set_prop(tw["inst"], int(p["idx"]), from + (to - from) * e)
		if f >= 1.0:
			_tweens.remove_at(i)
			_tween_finished.append({"inst": tw["inst"], "tag": tw["tag"]})

## True when a tween with the given tag on the instance ended this frame.
func tween_finished(inst: Node, tag: String) -> bool:
	if inst == null:
		return false
	for e in _tween_finished:
		if e["inst"] == inst and str(e["tag"]) == tag:
			return true
	return false

## True while any tween is running on the instance.
func is_any_tween_playing(inst: Node) -> bool:
	if inst == null:
		return false
	for tw in _tweens:
		if tw["inst"] == inst:
			return true
	return false

func clear_tween_finished() -> void:
	_tween_finished = []

## C3 ease names are index-based; index 0 = "default" (linear-ish).
func _ease(t: float, idx: int) -> float:
	match idx:
		0: return t
		1: return 1.0 - pow(1.0 - t, 2.0)   # in-out quad
		2: return 1.0 - pow(1.0 - t, 3.0)   # in-out cubic
		3: return 1.0 - pow(1.0 - t, 4.0)
		4: return t * t
		5: return t * t * t
		6: return 1.0 - pow(1.0 - t, 5.0)
		7: return t
		8: return 1.0 - pow(1.0 - t, 2.0)
		9: return 1.0 - pow(1.0 - t, 3.0)
		10: return 1.0 - pow(1.0 - t, 4.0)
		11: return 1.0 - pow(1.0 - t, 5.0)
		12: return 1.0 - pow(1.0 - t, 6.0)
	return t

func is_tween_playing(inst: Node, tag: String) -> bool:
	for tw in _tweens:
		if tw["inst"] == inst and tw["tag"] == tag:
			return true
	return false

## Returns true/false when a tween with the given tag exists on the
## instance, or null when the instance has no tween behaviour at all.
func get_tween_state(inst: Node, tag: String) -> Variant:
	var found := false
	for tw in _tweens:
		if tw["inst"] == inst:
			found = true
			if tw["tag"] == tag:
				return true
	return false if found else null

func stop_tweens(inst: Node, tag: String) -> void:
	for i in range(_tweens.size() - 1, -1, -1):
		var tw = _tweens[i]
		if tw["inst"] == inst and tw["tag"] == tag:
			_tweens.remove_at(i)

# --------------------------------------------------------------- audio
var _audio_players: Dictionary = {}   # tag -> AudioStreamPlayer
var _sound_files: Dictionary = {}     # name -> path
var _looped: Dictionary = {}          # tag -> bool

func register_sound(name: String, path: String) -> void:
	_sound_files[name] = path

## Plays a sound. `loop` restarts it endlessly, `volume_db` is in decibels.
func play_sound(sound_name: String, tag: String = "", loop: bool = false, volume_db: float = 0.0) -> void:
	if sound_name == "":
		return
	var key := tag if tag != "" else sound_name
	var path: String = _sound_files.get(sound_name, "")
	if path == "":
		return
	var stream = load(path)
	if stream == null:
		return
	var pl: AudioStreamPlayer = _audio_players.get(key, null)
	if pl == null:
		pl = AudioStreamPlayer.new()
		add_child(pl)
		_audio_players[key] = pl
	# Looping requires a stream that supports it.
	if loop and stream is AudioStreamOggVorbis:
		stream = (stream as AudioStreamOggVorbis).duplicate()
		(stream as AudioStreamOggVorbis).loop = true
	pl.stream = stream
	pl.volume_db = volume_db
	pl.play()

func fade_sound(tag: String, target_db: float, dur: float) -> void:
	var pl: AudioStreamPlayer = _audio_players.get(tag, null)
	if pl == null:
		return
	var tween := create_tween()
	tween.tween_property(pl, "volume_db", target_db, max(dur, 0.01))

func set_sound_silent(tag: String, silent: bool) -> void:
	var pl: AudioStreamPlayer = _audio_players.get(tag, null)
	if pl != null:
		pl.stream_paused = silent

func stop_sound(tag: String) -> void:
	var pl: AudioStreamPlayer = _audio_players.get(tag, null)
	if pl != null:
		pl.stop()

# --------------------------------------------------------------- canvas
func set_canvas_size(w: int, h: int) -> void:
	canvas_size = Vector2i(w, h)
	logical_size = Vector2(w, h)
	_update_display_scale()
	_apply_view()

## C3 "scale-inner": the logical canvas is fitted inside the window.
func _update_display_scale() -> void:
	var win := _window_size
	if win.x <= 0 or win.y <= 0:
		return
	display_scale = min(float(win.x) / logical_size.x, float(win.y) / logical_size.y)

func set_window_size(w: int, h: int) -> void:
	_window_size = Vector2i(w, h)
	_update_display_scale()
	_apply_view()

## Mirrors the "LOAD • ORIENTATION" event: the canvas is sized for the
## current orientation (720x1280 portrait, 1800x1011 landscape).
func apply_orientation() -> void:
	var portrait := _window_size.x <= _window_size.y
	if portrait:
		set_canvas_size(720, 1280)
	else:
		set_canvas_size(1800, 1011)

## Recomputes the scroll from the camera object and updates the view node.
func _apply_view() -> void:
	if current_layout == null:
		return
	var layout_size := Vector2(
		float(current_layout.layout_data.get("width", 2000)),
		float(current_layout.layout_data.get("height", 2500)))
	# The logical canvas size follows the orientation, as set by the
	# "LOAD • ORIENTATION" event.
	var logical := logical_size
	if _window_size.x <= _window_size.y:
		logical = Vector2(720, 1280)
	else:
		logical = Vector2(1800, 1011)
	_update_display_scale()
	var cam = _find_camera()
	var target := scroll
	if cam != null:
		target = Vector2(cam.world_x, cam.world_y)
	# C3 scroll bounds: margin = 0.5 * viewport / min layer scale.
	# When the layout is smaller than the canvas the range is inverted; C3
	# then keeps the lower bound, so the layout's top-left stays at the
	# canvas' top-left.
	var min_scale := 1.0
	var lo := Vector2(0.5 * logical.x / min_scale, 0.5 * logical.y / min_scale)
	var hi := Vector2(layout_size.x - lo.x, layout_size.y - lo.y)
	var sx := clampf(target.x, lo.x, hi.x) if lo.x <= hi.x else lo.x
	var sy := clampf(target.y, lo.y, hi.y) if lo.y <= hi.y else lo.y
	scroll = Vector2(sx, sy)
	current_layout.apply_view(scroll, logical, display_scale)

func _find_camera() -> Node:
	if current_layout == null:
		return null
	var list = current_layout.get_instances("OBJ_Cam")
	return list[0] if list.size() > 0 else null

# --------------------------------------------------------------- spawning
func spawn_instance(type_data: Dictionary, layer_name: String) -> Node:
	if current_layout == null:
		return null
	var lnode: Node2D = current_layout.get_layer_node(layer_name)
	if lnode == null:
		push_error("Unknown layer: " + layer_name)
		return null
	return current_layout.spawn_on_layer(lnode, type_data)
