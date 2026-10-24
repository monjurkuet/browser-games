extends Node2D
## A C3 world instance (sprite, spritefont, text, etc.) inside a layout layer.
## Holds the C3 world transform, animation state, instance variables and
## runtime effects, and mirrors them onto a Sprite2D/child node.

enum PluginKind { SPRITE, SPRITEFONT, TEXT, PARTICLES, VIDEO, NINEPATCH, ARRAY, TILEDBG, OTHER }

var type_name: String = ""
var type_idx: int = -1
var type_data: Dictionary = {}
var plugin_kind: int = PluginKind.SPRITE

# C3 world transform
var world_x: float = 0.0
var world_y: float = 0.0
var world_z: float = 0.0
var world_w: float = 0.0
var world_h: float = 0.0
var world_angle: float = 0.0
var tint: Color = Color(1, 1, 1, 1)
var origin_x: float = 0.5
var origin_y: float = 0.5

# runtime state
var visible_flag: bool = true
var opacity: float = 1.0
var scale_factor: float = 1.0
var _debug_hidden: bool = false   # set from DB_HIDE_TYPES for A/B debugging
var color: Color = Color(1, 1, 1, 1)
var current_anim: String = ""
var current_frame: int = 0
var anim_playing: bool = true
var anim_time: float = 0.0
var inst_vars: Array = []
var sid: String = ""
var layer_name: String = ""
var effects: Array = []          # list of {name, type, params, enabled}
var effects_override: Array = []
var extra_state: Array = []      # raw plugin state from data.json

var _sprite: Sprite2D = null
var _font: Node2D = null
var _tiled: Node2D = null
var _particles: Node2D = null
var _data: Node = null
var _anim_frames: Array = []
var _anim_speed: float = 1.0
var _anim_repeat: int = 1
var _anim_loop_count: int = 0
var _on_anim_end: Callable = Callable()
var _dirty_transform: bool = true

func setup(t: Dictionary, instance: Dictionary, data_node: Node) -> void:
	_data = data_node
	type_data = t
	type_name = t.get("name", "")
	type_idx = t.get("idx", -1)
	inst_vars = instance.get("instVars", []).duplicate()
	sid = str(instance.get("sid", ""))
	# Debug aid: DB_HIDE_TYPES="Fade,Particles" hides the listed object types
	# so that A/B screenshots can isolate which instance causes a difference.
	var hide_types := OS.get_environment("DB_HIDE_TYPES")
	if hide_types != "" and type_name in hide_types.split(",", false):
		_debug_hidden = true
	effects_override = instance.get("effectsOverride", [])
	extra_state = instance.get("state", []) if instance.get("state", null) != null else []
	var w = instance.get("world", {})
	world_x = w.get("x", 0.0)
	world_y = w.get("y", 0.0)
	world_z = w.get("z", 0.0)
	world_w = w.get("w", 0.0)
	world_h = w.get("h", 0.0)
	world_angle = w.get("angle", 0.0)
	origin_x = w.get("originX", 0.5)
	origin_y = w.get("originY", 0.5)
	var t_arr = w.get("tint", [1, 1, 1, 1])
	if t_arr is Array and t_arr.size() >= 3:
		tint = Color(t_arr[0], t_arr[1], t_arr[2], t_arr[3] if t_arr.size() > 3 else 1.0)
	elif t_arr is Array and t_arr.size() == 1:
		tint = Color(1, 1, 1, 1)
	var pr = t.get("pluginRef", 0)
	if pr == 14: plugin_kind = PluginKind.SPRITEFONT
	elif pr == 15: plugin_kind = PluginKind.TEXT
	elif pr == 13: plugin_kind = PluginKind.PARTICLES
	elif pr == 11: plugin_kind = PluginKind.VIDEO
	elif pr == 21: plugin_kind = PluginKind.NINEPATCH
	elif pr == 12: plugin_kind = PluginKind.ARRAY
	elif pr == 17: plugin_kind = PluginKind.TILEDBG
	# animation from state
	var st = extra_state
	if st is Array and st.size() >= 3 and st[1] is String:
		current_anim = st[1]
		current_frame = st[2]
		anim_playing = st[3] if st.size() > 3 else true
	visible_flag = st[0] if st is Array and st.size() >= 1 and st[0] is bool else true

func _ready() -> void:
	_build_visual()

func _build_visual() -> void:
	# Load the animation frames for the instance's current animation so the
	# correct frame (and therefore the correct size) is used.
	if current_anim != "":
		var a = get_animation(current_anim)
		if not a.is_empty():
			_anim_frames = a.get("frames", [])
			_anim_speed = a.get("speed", 1.0)
			_anim_repeat = a.get("repeatCount", 1)
	match plugin_kind:
		PluginKind.SPRITE:
			_sprite = Sprite2D.new()
			_sprite.centered = false
			add_child(_sprite)
			_apply_frame()
		PluginKind.SPRITEFONT:
			_font = load("res://c3/c3_spritefont.gd").new()
			add_child(_font)
			_font.data = _data
			var sf_name = type_name
			_font.configure(sf_name, _data.sf_settings.get(sf_name, {}), _sheet_path())
			_apply_font_state()
		PluginKind.TEXT:
			_font = load("res://c3/c3_text.gd").new()
			add_child(_font)
			_font.data = _data
			_apply_font_state()
		PluginKind.TILEDBG:
			_tiled = load("res://c3/c3_tiledbg.gd").new()
			add_child(_tiled)
			_apply_tiledbg_state()
		PluginKind.PARTICLES:
			_particles = load("res://c3/c3_particles.gd").new()
			add_child(_particles)
			_particles.setup(extra_state, type_data, _data, get_parent())
			_particles.spawn_x = world_x
			_particles.spawn_y = world_y
			_particles.spawn_angle = deg_to_rad(world_angle)
			_particles.master_opacity = opacity
			_particles.visible = visible_flag
		_:
			pass
	# Apply the instance's world size (frames may be a different size than
	# the instance's w/h, so the sprite is scaled to match).
	if world_w > 0.0 and world_h > 0.0:
		set_size(world_w, world_h)
	_update_transform()

func _sheet_path() -> String:
	var img = type_data.get("image", null)
	return img.get("path", "") if img else ""

func _apply_font_state() -> void:
	var st = extra_state
	if _font == null or not (st is Array):
		return
	if plugin_kind == PluginKind.SPRITEFONT:
		_apply_spritefont_state(st)
	else:
		_apply_text_state(st)

## Spritefont2 instance state:
## [text, visible, charWidth, charHeight, charset, spacingData, charScale,
##  charSpacing, lineHeight, hAlign, vAlign, wrapMode, visible, readAloud]
func _apply_spritefont_state(st: Array) -> void:
	_font.visible_text = st[1] if st.size() > 1 and st[1] is bool else true
	if st.size() > 6 and _is_num(st[6]):
		_font.char_scale = float(st[6])
	if st.size() > 7 and _is_num(st[7]):
		_font.char_spacing = float(st[7])
	if st.size() > 8 and _is_num(st[8]):
		_font.line_height = float(st[8])
	if st.size() > 9 and _is_num(st[9]):
		_font.horizontal_align = int(st[9])
	if st.size() > 10 and _is_num(st[10]):
		_font.vertical_align = int(st[10])
	if st.size() > 11 and _is_num(st[11]):
		_font.wrap_mode = int(st[11])
	if st.size() >= 1 and st[0] is String:
		_font.set_text(st[0])
	_font.box_size = Vector2(world_w, world_h)

## Godot's JSON parser returns every number as a float, so numeric plugin
## state fields have to accept both int and float.
static func _is_num(v) -> bool:
	return v is int or v is float

## TiledBg plugin state:
## [visible, ?, ?, ?, offsetX, offsetY, scaleX, scaleY, angle, tileRandom, ...]
func _apply_tiledbg_state() -> void:
	if _tiled == null:
		return
	var img = type_data.get("image", null)
	var tex: Texture2D = null
	if img is Dictionary and img.has("path"):
		tex = _data.get_texture("res://" + str(img["path"]))
	var st = extra_state
	var off := Vector2.ZERO
	var scl := Vector2.ONE
	if st is Array and st.size() >= 9:
		off = Vector2(float(st[4]), float(st[5]))
		scl = Vector2(float(st[6]), float(st[7]))
	_tiled.setup(tex, Vector2(world_w, world_h), off, scl)
	_tiled.modulate = Color(tint.r, tint.g, tint.b, tint.a * opacity) * color
	_tiled.visible = visible_flag

## Text plugin instance state:
## [text, bbcode, face, ptSize, lineHeightOffset, bold, italic, color,
##  hAlign, vAlign, wrapMode, textDirection, resolutionMode, ..., visible]
func _apply_text_state(st: Array) -> void:
	if st.size() >= 1 and st[0] is String:
		_font.set_text(st[0])
	_font.box_size = Vector2(world_w, world_h)
	if st.size() >= 7 and st[6] is Array:
		_font.color = Color(st[6][0], st[6][1], st[6][2])
	if st.size() >= 3 and st[2] is String:
		_font.face_name = st[2]
	if st.size() >= 4 and _is_num(st[3]):
		_font.pt_size = int(st[3])
	if st.size() >= 5 and _is_num(st[4]):
		_font.line_height_offset = int(st[4])
	if st.size() >= 6 and st[5] is bool:
		_font.bold = st[5]
	if st.size() >= 7 and st[6] is bool:
		_font.italic = st[6]
	if st.size() >= 8 and st[7] is Array:
		_font.color = Color(st[7][0], st[7][1], st[7][2])
	if st.size() >= 9 and _is_num(st[8]):
		_font.horizontal_align = int(st[8])
	if st.size() >= 10 and _is_num(st[9]):
		_font.vertical_align = int(st[9])
	if st.size() >= 11 and _is_num(st[10]):
		_font.wrap_mode = int(st[10])
	if st.size() >= 13 and st[12] is bool:
		_font.visible_text = st[12]
	_font.refresh()

# ---------------------------------------------------------------- animations
func get_animation(name: String) -> Dictionary:
	for a in type_data.get("animations", []):
		if a.get("name", "") == name:
			return a
	return {}

func set_animation(name: String, play: bool = true) -> void:
	var a = get_animation(name)
	if a.is_empty():
		return
	current_anim = name
	_anim_frames = a.get("frames", [])
	_anim_speed = a.get("speed", 1.0)
	_anim_repeat = a.get("repeatCount", 1)
	_anim_loop_count = 0
	anim_time = 0.0
	current_frame = 0
	anim_playing = play
	_apply_frame()

func set_frame(idx: int) -> void:
	current_frame = idx
	anim_playing = false
	_apply_frame()

func _apply_frame() -> void:
	if _sprite == null:
		return
	var frames = _anim_frames
	if frames.is_empty():
		var anims = type_data.get("animations", [])
		if anims.is_empty():
			return
		frames = anims[0].get("frames", [])
		_anim_frames = frames
	if current_frame < 0 or current_frame >= frames.size():
		return
	var fr: Dictionary = frames[current_frame]
	var sheet = "res://" + fr["sheet"]
	var rotated: bool = fr.get("rotated", false)
	# For rotated frames the atlas region is stored with swapped w/h.
	var rw: int = fr["h"] if rotated else fr["w"]
	var rh: int = fr["w"] if rotated else fr["h"]
	var r = Rect2i(fr["x"], fr["y"], rw, rh)
	var at = _data.get_atlas(sheet, r, rotated)
	if at == null:
		return
	_sprite.texture = at
	# C3 draws the frame scaled to the instance's world size, with the
	# frame's origin point at the instance position.
	var fw := float(fr["w"])
	var fh := float(fr["h"])
	var sx := 1.0
	var sy := 1.0
	if world_w > 0.0 and fw > 0.0:
		sx = world_w / fw
	if world_h > 0.0 and fh > 0.0:
		sy = world_h / fh
	# The sprite is drawn at the frame's top-left, shifted so the origin
	# point lands on the instance position. Offset is in texture pixels and
	# is scaled along with the sprite.
	_sprite.offset = Vector2(-fr.get("originX", 0.5) * fw, -fr.get("originY", 0.5) * fh)
	_sprite.scale = Vector2(sx, sy) * scale_factor
	_sprite.modulate = Color(tint.r, tint.g, tint.b, tint.a * opacity) * color
	_sprite.visible = visible_flag

func _process(delta: float) -> void:
	if not anim_playing or _anim_frames.is_empty():
		return
	anim_time += delta
	var speed := _anim_speed
	if speed <= 0.0:
		return
	var idx := int(anim_time * speed)
	if idx >= _anim_frames.size():
		if _anim_repeat <= 0:
			idx = _anim_frames.size() - 1
			anim_playing = false
			if _on_anim_end.is_valid():
				_on_anim_end.call()
		else:
			var loops := int(_anim_repeat)
			if loops > 0:
				_anim_loop_count += 1
				if _anim_loop_count >= loops:
					anim_playing = false
					idx = _anim_frames.size() - 1
					if _on_anim_end.is_valid():
						_on_anim_end.call()
				else:
					idx = idx % _anim_frames.size()
			else:
				idx = idx % _anim_frames.size()
	if idx != current_frame:
		current_frame = idx
		_apply_frame()

# ---------------------------------------------------------------- transform
func _update_transform() -> void:
	position = Vector2(world_x, world_y) - _layer_origin
	rotation = world_angle
	z_index = draw_order
	var vis := visible_flag and not _debug_hidden
	if _sprite != null:
		_sprite.modulate = Color(tint.r, tint.g, tint.b, tint.a * opacity) * color
		_sprite.visible = vis
	if _font != null:
		_font.modulate = Color(tint.r, tint.g, tint.b, tint.a * opacity) * color
		_font.visible = vis
		# The text box is anchored at the instance's origin point.
		_font.position = Vector2(-origin_x * world_w, -origin_y * world_h)
		if _font.has_method("refresh"):
			_font.refresh()
	if _tiled != null:
		_tiled.modulate = Color(tint.r, tint.g, tint.b, tint.a * opacity) * color
		_tiled.visible = vis
		# The tiled rectangle is anchored at the instance's origin point.
		_tiled.position = Vector2(-origin_x * world_w, -origin_y * world_h)
	_dirty_transform = false

## The viewport origin of the instance's layer, subtracted from its position
## so that layout coordinates map to the correct screen position.
var _layer_origin: Vector2 = Vector2.ZERO
var _layer_scale: float = 1.0

## Position of the instance in the layout's flattened draw order; used as the
## z_index so the C3 draw order is preserved exactly.
var draw_order: int = 0

func set_draw_order(o: int) -> void:
	draw_order = o
	z_index = o
	z_as_relative = false

func set_layer_origin(o: Vector2) -> void:
	if o.is_equal_approx(_layer_origin):
		return
	_layer_origin = o
	_update_transform()

func set_layer_scale(s: float) -> void:
	if is_equal_approx(_layer_scale, s):
		return
	_layer_scale = s
	_update_transform()

func set_position_xy(x: float, y: float) -> void:
	world_x = x
	world_y = y
	_update_transform()

func set_size(w: float, h: float) -> void:
	world_w = w
	world_h = h
	if _sprite != null:
		var frames = _anim_frames
		if not frames.is_empty() and current_frame < frames.size():
			var fr = frames[current_frame]
			var sx: float = w / max(float(fr["w"]), 0.001)
			var sy: float = h / max(float(fr["h"]), 0.001)
			_sprite.scale = Vector2(sx, sy) * scale_factor
	if _font != null:
		_font.box_size = Vector2(w, h)
		_update_transform()

func set_scale_factor(s: float) -> void:
	scale_factor = s
	_apply_frame()

## Sets the text of a text-bearing instance (Text / Spritefont2).
func set_text(t: String) -> void:
	if _font != null and _font.has_method("set_text"):
		_font.set_text(t)
	if extra_state.is_empty():
		extra_state = ["", true]
	else:
		extra_state[0] = t
	if _font != null and "box_size" in _font:
		_font.box_size = Vector2(world_w, world_h)

## Moves the instance to the top of its parent's draw order.
func move_to_top() -> void:
	if get_parent():
		get_parent().move_child(self, -1)

func set_opacity(o: float) -> void:
	opacity = o
	_update_transform()

func set_visible_flag(v: bool) -> void:
	visible_flag = v
	_update_transform()

func set_color(c: Color) -> void:
	color = c
	_update_transform()

func set_tint(c: Color) -> void:
	tint = c
	_update_transform()

# ---------------------------------------------------------------- instance vars
func get_inst_var(idx: int, fallback: Variant = null) -> Variant:
	if idx >= 0 and idx < inst_vars.size():
		return inst_vars[idx]
	return fallback

func set_inst_var(idx: int, v: Variant) -> void:
	while inst_vars.size() <= idx:
		inst_vars.append(null)
	inst_vars[idx] = v

## Maps an instance-var index to its definition name for the type.
func inst_var_name(idx: int) -> String:
	for v in type_data.get("instVarDefs", []):
		if v.get("index", -1) == idx:
			return v.get("name", "")
	return ""
