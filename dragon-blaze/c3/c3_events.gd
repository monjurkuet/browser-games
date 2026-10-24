extends Node
## C3 event engine: interprets the decoded event sheets from game_data.json.
##
## Execution model mirrors Construct 3:
##  - Trigger conditions (e.g. OnTouchObject) are polled each tick and fire
##    once when they become true.
##  - Action conditions (e.g. Compare) are evaluated immediately.
##  - "Wait" actions suspend the current event branch for a duration.
##  - "Every" conditions fire on a timer.
##  - "TriggerOnce" conditions fire only the first time.

var runtime: Node = null
var data: Node = null
var expr: RefCounted = null

var _sheet_stack: Array = []       # active sheet names
var _every_timers: Array = []      # {sheet, ev, t, dur}
var _triggered: Dictionary = {}     # event sid -> bool (TriggerOnce)
var _last_trigger_state: Dictionary = {}  # event sid -> bool (edge detect)
var _timers: Dictionary = {}       # instance sid -> {running, t, dur, tag, obj}
var _pending: Array = []           # pending coroutine-style event steps
var _js_handlers: Dictionary = {}   # JavaScript-in-events function names

signal event_fired(sheet_name, event_line)

func setup(rt: Node, d: Node) -> void:
	runtime = rt
	data = d
	expr = load("res://c3/c3_expr.gd").new(rt, d)

func activate_sheet(sheet_name: String) -> void:
	if not _sheet_stack.has(sheet_name):
		_sheet_stack.append(sheet_name)

## Fires the OnLayoutStart trigger for the given sheet.
func run_layout_start(sheet_name: String) -> void:
	if sheet_name == "":
		return
	activate_sheet(sheet_name)
	var sheet: Dictionary = data.get_sheet(sheet_name)
	if sheet.is_empty():
		return
	for grp in sheet.get("groups", []):
		for ev in grp.get("events", []):
			if _has_cond(ev, "System.Cnds.OnLayoutStart"):
				_last_trigger_state[str(ev.get("sid", 0))] = true
				_run_event(sheet_name, ev, {})
	for ev in sheet.get("events", []):
		if _has_cond(ev, "System.Cnds.OnLayoutStart"):
			_last_trigger_state[str(ev.get("sid", 0))] = true
			_run_event(sheet_name, ev, {})

func deactivate_sheet(sheet_name: String) -> void:
	_sheet_stack.erase(sheet_name)

# ------------------------------------------------------------------ ticking
func _process(delta: float) -> void:
	# Every-timers
	for t in _every_timers:
		t["t"] = float(t["t"]) + delta
		while float(t["t"]) >= float(t["dur"]):
			t["t"] = float(t["t"]) - float(t["dur"])
			_run_event(t["sheet"], t["ev"], {})
	# Trigger conditions
	for sheet_name in _sheet_stack:
		var sheet: Dictionary = data.get_sheet(sheet_name)
		if sheet.is_empty():
			continue
		for grp in sheet.get("groups", []):
			for ev in grp.get("events", []):
				_check_event(sheet_name, ev)
		for ev in sheet.get("events", []):
			_check_event(sheet_name, ev)
	# Instance timers (Timer behavior)
	for key in _timers.keys():
		var tm = _timers[key]
		if not tm.get("running", false):
			continue
		tm["t"] = float(tm["t"]) + delta
		if float(tm["t"]) >= float(tm["dur"]):
			tm["running"] = false
			_on_timer_fired(tm)
	# The click flag is only valid for the frame it happened in.
	runtime.pointer_clicked = false
	# Tweens that ended during this frame have been reported.
	runtime.clear_tween_finished()

func _on_timer_fired(tm: Dictionary) -> void:
	var obj = tm.get("obj", null)
	if obj == null:
		return
	# Fire "On timer" events for the sheet that owns the timer instance.
	for sheet_name in _sheet_stack:
		var sheet: Dictionary = data.get_sheet(sheet_name)
		for grp in sheet.get("groups", []):
			for ev in grp.get("events", []):
				if _has_cond(ev, "B.Timer.Cnds.OnTimer"):
					_run_event(sheet_name, ev, {"target": obj})

func _has_cond(ev: Dictionary, ace_name: String) -> bool:
	for c in ev.get("conds", []):
		if c.get("aceName", "") == ace_name:
			return true
	return false

func _check_event(sheet_name: String, ev: Dictionary) -> void:
	if ev.get("disabled", false):
		return
	var conds: Array = ev.get("conds", [])
	if conds.is_empty():
		return
	var triggers: Array = []
	var others: Array = []
	for c in conds:
		if c.get("trigger", false):
			triggers.append(c)
		else:
			others.append(c)
	if triggers.is_empty():
		# A "standard" event: C3 evaluates its conditions every tick and
		# runs the actions while they are true.
		_run_event(sheet_name, ev, {})
		return
	var key := str(ev.get("sid", 0))
	var all_true := true
	# The non-trigger conditions of a trigger event still have to hold.
	for o in others:
		if not _eval_condition(o, sheet_name):
			all_true = false
	# A trigger event fires on the rising edge of its trigger conditions.
	for t in triggers:
		if not _eval_condition(t, sheet_name):
			all_true = false
	var was := bool(_last_trigger_state.get(key, false))
	_last_trigger_state[key] = all_true
	if not all_true or was:
		return
	_run_event(sheet_name, ev, {})

## Returns the loop type of a condition, or "" when it is not a loop.
func _loop_kind(c: Dictionary) -> String:
	match c.get("aceName", ""):
		"System.Cnds.ForEach": return "foreach"
		"System.Cnds.For": return "for"
		"System.Cnds.Repeat": return "repeat"
	return ""

## Runs an event: evaluates its conditions, then runs its actions and
## sub-events. Loop conditions iterate over the sub-events.
func _run_event(sheet_name: String, ev: Dictionary, context: Dictionary) -> void:
	event_fired.emit(sheet_name, ev.get("line", 0))
	var ctx := context.duplicate()
	if not ctx.has("target"):
		ctx["target"] = _resolve_target(ev)
	var loop_cond: Dictionary = {}
	for c in ev.get("conds", []):
		if c.get("trigger", false):
			continue
		var k := _loop_kind(c)
		if k != "":
			loop_cond = c
			continue
		if not _eval_condition(c, sheet_name):
			_run_else_branch(sheet_name, ev)
			return
	if not loop_cond.is_empty():
		_run_loop(sheet_name, loop_cond, ev, _loop_kind(loop_cond), ctx)
		return
	_exec_actions(sheet_name, ev.get("acts", []), ev.get("subs", []), ctx)

## Runs the sub-events of a looping event once per iteration.
func _run_loop(sheet_name: String, cond: Dictionary, ev: Dictionary, kind: String, context: Dictionary) -> void:
	match kind:
		"foreach":
			var type_name := ""
			var params: Array = cond.get("params", [])
			if params.size() >= 1:
				type_name = _type_name_from_param(params[0])
			var insts: Array = runtime.instances_of(type_name) if type_name != "" else []
			var loop_i := 0
			for inst in insts:
				if not is_instance_valid(inst):
					continue
				var ctx := context.duplicate()
				ctx["picked"] = inst
				ctx["target"] = inst
				ctx["loop_index"] = loop_i
				loop_i += 1
				_exec_actions(sheet_name, ev.get("acts", []), ev.get("subs", []), ctx)
		"for":
			var params2: Array = cond.get("params", [])
			var var_name := ""
			var start := 0
			var end := 0
			if params2.size() >= 1:
				var_name = _type_name_from_param(params2[0])
			if params2.size() >= 2:
				start = _to_int(expr.eval_param(params2[1], context))
			if params2.size() >= 3:
				end = _to_int(expr.eval_param(params2[2], context))
			for i in range(start, end + 1):
				if var_name != "":
					runtime.set_global(var_name, i)
				var ctx := context.duplicate()
				ctx["loop_index"] = i
				_exec_actions(sheet_name, ev.get("acts", []), ev.get("subs", []), ctx)
		"repeat":
			var params3: Array = cond.get("params", [])
			var count := 0
			if params3.size() >= 1:
				count = _to_int(expr.eval_param(params3[0], context))
			for i in count:
				var ctx := context.duplicate()
				ctx["loop_index"] = i
				_exec_actions(sheet_name, ev.get("acts", []), ev.get("subs", []), ctx)

## The name of a variable referenced by a parameter.
func _type_name_from_param(p: Dictionary) -> String:
	if p.get("t") == "obj":
		var idx: int = p.get("v", -1)
		if idx >= 0 and idx < data.object_types.size():
			return data.object_types[idx]["name"]
		return ""
	if p.get("t") == "const":
		return str(p.get("v", ""))
	return ""

## Runs the "Else" sub-event of an if-event, when one exists.
func _run_else_branch(sheet_name: String, ev: Dictionary) -> void:
	for s in ev.get("subs", []):
		for c in s.get("conds", []):
			if c.get("aceName", "") == "System.Cnds.Else":
				_run_event(sheet_name, s, {})
				return

# ------------------------------------------------------------------ execution
func _exec_actions(sheet_name: String, acts: Array, subs: Array, context: Dictionary) -> void:
	var i := 0
	while i < acts.size():
		var a: Dictionary = acts[i]
		var wait_time := _exec_action(sheet_name, a, context)
		if wait_time > 0.0:
			var rest_acts := acts.slice(i + 1)
			runtime.wait_seconds(wait_time, func():
				_exec_actions(sheet_name, rest_acts, subs, context))
			return
		i += 1
	for s in subs:
		_run_event(sheet_name, s, context)

## Executes one action; returns the wait duration in seconds (0 = none).
func _exec_action(sheet_name: String, a: Dictionary, context: Dictionary) -> float:
	var ace_name: String = a.get("aceName", "")
	var params: Array = a.get("params", [])
	var ctx := context.duplicate()
	ctx["target"] = _resolve_target(a, ctx)
	match ace_name:
		"System.Acts.SetVar":
			var name: String = _var_name(params[0]) if params.size() > 0 else ""
			if name != "":
				runtime.set_global(name, expr.eval_param(params[1], ctx) if params.size() > 1 else null)
			return 0.0
		"System.Acts.AddVar":
			var name2: String = _var_name(params[0]) if params.size() > 0 else ""
			if name2 != "":
				var cur = runtime.get_global(name2, 0)
				var add = expr.eval_param(params[1], ctx) if params.size() > 1 else 0
				runtime.set_global(name2, _to_f(cur) + _to_f(add))
			return 0.0
		"System.Acts.SubVar":
			var name3: String = _var_name(params[0]) if params.size() > 0 else ""
			if name3 != "":
				var cur = runtime.get_global(name3, 0)
				var sub = expr.eval_param(params[1], ctx) if params.size() > 1 else 0
				runtime.set_global(name3, _to_f(cur) - _to_f(sub))
			return 0.0
		"System.Acts.Wait":
			var secs = expr.eval_param(params[0], ctx) if params.size() > 0 else 0.0
			return _to_f(secs)
		"System.Acts.GoToLayout":
			var lname = expr.eval_param(params[0], ctx) if params.size() > 0 else ""
			if lname is String and lname != "":
				runtime.call_deferred("go_to_layout", lname)
			return 0.0
		"System.Acts.SetCanvasSize":
			if params.size() >= 2:
				runtime.set_canvas_size(_to_int(expr.eval_param(params[0], ctx)), _to_int(expr.eval_param(params[1], ctx)))
			return 0.0
		"Browser.Acts.LockOrientation":
			return 0.0
		"System.Acts.SetLayerScale":
			var lay_name = str(expr.eval_param(params[0], ctx)) if params.size() > 0 else ""
			if params.size() >= 2:
				var lnode = runtime.current_layout.get_layer(lay_name) if runtime.current_layout else null
				if lnode:
					lnode.scale = Vector2.ONE * _to_f(expr.eval_param(params[1], ctx))
			return 0.0
		"System.Acts.SetLayerEffectEnabled":
			return 0.0
		"System.Acts.SetLayoutAngle":
			return 0.0
		"Sprite.Acts.SetInstanceVar":
			var t = _resolve_target(a, ctx)
			if t != null and params.size() >= 2:
				t.set_inst_var(_to_int(params[0].get("v", 0)), expr.eval_param(params[1], ctx))
			return 0.0
		"Sprite.Acts.SetX":
			var t2 = _resolve_target(a, ctx)
			if t2 != null and params.size() >= 1:
				t2.set_position_xy(_to_f(expr.eval_param(params[0], ctx)), t2.world_y)
			return 0.0
		"Sprite.Acts.SetY":
			var t3 = _resolve_target(a, ctx)
			if t3 != null and params.size() >= 1:
				t3.set_position_xy(t3.world_x, _to_f(expr.eval_param(params[0], ctx)))
			return 0.0
		"Sprite.Acts.SetPos":
			var t4 = _resolve_target(a, ctx)
			if t4 != null and params.size() >= 2:
				t4.set_position_xy(_to_f(expr.eval_param(params[0], ctx)), _to_f(expr.eval_param(params[1], ctx)))
			return 0.0
		"Sprite.Acts.SetPosToObject":
			var t5 = _resolve_target(a, ctx)
			if t5 != null and params.size() >= 1:
				var other = _instance_from_param(params[0], ctx)
				if other != null:
					t5.set_position_xy(other.world_x, other.world_y)
			return 0.0
		"Sprite.Acts.SetScale":
			var t6 = _resolve_target(a, ctx)
			if t6 != null and params.size() >= 1:
				t6.set_scale_factor(_to_f(expr.eval_param(params[0], ctx)))
			return 0.0
		"Sprite.Acts.SetSize":
			var t7 = _resolve_target(a, ctx)
			if t7 != null and params.size() >= 2:
				t7.set_size(_to_f(expr.eval_param(params[0], ctx)), _to_f(expr.eval_param(params[1], ctx)))
			return 0.0
		"Sprite.Acts.SetOpacity":
			var t8 = _resolve_target(a, ctx)
			if t8 != null and params.size() >= 1:
				t8.set_opacity(_to_f(expr.eval_param(params[0], ctx)))
			return 0.0
		"Sprite.Acts.SetVisible":
			var t9 = _resolve_target(a, ctx)
			if t9 != null and params.size() >= 1:
				t9.set_visible_flag(_truthy(expr.eval_param(params[0], ctx)))
			return 0.0
		"Sprite.Acts.SetDefaultColor":
			var t10 = _resolve_target(a, ctx)
			if t10 != null and params.size() >= 1:
				var c = expr.eval_param(params[0], ctx)
				if c is Color:
					t10.set_color(c)
			return 0.0
		"Sprite.Acts.SetAnimFrame":
			var t11 = _resolve_target(a, ctx)
			if t11 != null and params.size() >= 1:
				t11.set_frame(_to_int(expr.eval_param(params[0], ctx)))
			return 0.0
		"Sprite.Acts.StartAnim":
			var t12 = _resolve_target(a, ctx)
			if t12 != null and params.size() >= 1:
				t12.set_animation(str(expr.eval_param(params[0], ctx)))
			return 0.0
		"Sprite.Acts.StopAnim":
			var t13 = _resolve_target(a, ctx)
			if t13 != null:
				t13.anim_playing = false
			return 0.0
		"Sprite.Acts.Destroy":
			var t14 = _resolve_target(a, ctx)
			if t14 != null and runtime.current_layout:
				runtime.current_layout.remove_instance(t14)
			return 0.0
		"Sprite.Acts.MoveToTop":
			var t15 = _resolve_target(a, ctx)
			if t15 != null and t15.get_parent():
				t15.get_parent().move_child(t15, -1)
			return 0.0
		"Sprite.Acts.MoveToBottom":
			var t16 = _resolve_target(a, ctx)
			if t16 != null and t16.get_parent():
				t16.get_parent().move_child(t16, 0)
			return 0.0
		"Sprite.Acts.Spawn":
			_spawn(a, params, ctx)
			return 0.0
		"Sprite.Acts.AddChild":
			_add_child(a, params, ctx)
			return 0.0
		"Sprite.Acts.RemoveChild":
			return 0.0
		"Text.Acts.SetText":
			var tt = _resolve_target(a, ctx)
			if tt != null and params.size() >= 1:
				tt.set_text(str(expr.eval_param(params[0], ctx)))
			return 0.0
		"Text.Acts.AppendText":
			var ta = _resolve_target(a, ctx)
			if ta != null and params.size() >= 1:
				var cur = ta.extra_state[0] if ta.extra_state.size() > 0 else ""
				ta.set_text(str(cur) + str(expr.eval_param(params[0], ctx)))
			return 0.0
		"Text.Acts.SetVisible":
			var tv = _resolve_target(a, ctx)
			if tv != null and params.size() >= 1:
				tv.set_visible_flag(_truthy(expr.eval_param(params[0], ctx)))
			return 0.0
		"Spritefont2.Acts.SetText":
			var st = _resolve_target(a, ctx)
			if st != null and params.size() >= 1:
				var _v = expr.eval_param(params[0], ctx)
				# A null value means the expression could not be resolved
				# (e.g. data of the C3 Array plugin); keep the text that the
				# instance was created with instead of destroying it.
				if _v == null:
					return 0.0
				st.set_text(str(_v))
			return 0.0
		"Spritefont2.Acts.SetVisible":
			var sv = _resolve_target(a, ctx)
			if sv != null and params.size() >= 1:
				sv.set_visible_flag(_truthy(expr.eval_param(params[0], ctx)))
			return 0.0
		"Spritefont2.Acts.SetPosToObject":
			var sp = _resolve_target(a, ctx)
			if sp != null and params.size() >= 1:
				var other = _instance_from_param(params[0], ctx)
				if other != null:
					sp.set_position_xy(other.world_x, other.world_y)
			return 0.0
		"Spritefont2.Acts.MoveToTop":
			var smt = _resolve_target(a, ctx)
			if smt != null and smt.get_parent():
				smt.get_parent().move_child(smt, -1)
			return 0.0
		"Spritefont2.Acts.MoveToLayer":
			return 0.0
		"Spritefont2.Acts.Destroy":
			var sd = _resolve_target(a, ctx)
			if sd != null and runtime.current_layout:
				runtime.current_layout.remove_instance(sd)
			return 0.0
		"Spritefont2.Acts.SetDefaultColor":
			var sdc = _resolve_target(a, ctx)
			if sdc != null and params.size() >= 1:
				var c2 = expr.eval_param(params[0], ctx)
				if c2 is Color:
					sdc.set_color(c2)
			return 0.0
		"Audio.Acts.Play":
			_play_audio(params, ctx)
			return 0.0
		"Audio.Acts.PlayByName":
			_play_audio(params, ctx)
			return 0.0
		"Audio.Acts.FadeVolume":
			_fade_audio(params, ctx)
			return 0.0
		"Audio.Acts.SetSilent":
			var silent = _truthy(expr.eval_param(params[0], ctx)) if params.size() >= 1 else false
			var tag_s = ""
			for p in params:
				if p.get("t") == "const" and p.get("v") is String:
					tag_s = str(p.get("v"))
			if tag_s != "":
				runtime.set_sound_silent(tag_s, silent)
			return 0.0
		"Audio.Acts.Preload":
			return 0.0
		"B.Tween.Acts.TweenOneProperty":
			return _tween_one(a, params, ctx)
		"B.Tween.Acts.TweenTwoProperties":
			return _tween_two(a, params, ctx)
		"B.Tween.Acts.TweenValue":
			return 0.0
		"B.Timer.Acts.StartTimer":
			_start_timer(a, params, ctx)
			return 0.0
		"AJAX.Acts.Request":
			_ajax_request(params, ctx)
			return 0.0
		"video.Acts.SetVisible":
			var vv = _resolve_target(a, ctx)
			if vv != null and params.size() >= 1:
				vv.set_visible_flag(_truthy(expr.eval_param(params[0], ctx)))
			return 0.0
		"video.Acts.Play":
			return 0.0
		"video.Acts.Pause":
			return 0.0
		"video.Acts.SetVolume":
			return 0.0
		"video.Acts.SetMuted":
			return 0.0
		"video.Acts.SetLooping":
			return 0.0
		"video.Acts.SetX":
			var vx = _resolve_target(a, ctx)
			if vx != null and params.size() >= 1:
				vx.set_position_xy(_to_f(expr.eval_param(params[0], ctx)), vx.world_y)
			return 0.0
		"video.Acts.SetPlaybackTime":
			return 0.0
		"video.Acts.MoveToTop":
			return 0.0
		"video.Acts.SetInstanceVar":
			var viv = _resolve_target(a, ctx)
			if viv != null and params.size() >= 2:
				viv.set_inst_var(_to_int(params[0].get("v", 0)), expr.eval_param(params[1], ctx))
			return 0.0
		"Particles.Acts.SetRate":
			return 0.0
		"Particles.Acts.SetDefaultColor":
			return 0.0
		"Particles.Acts.SetAngle":
			return 0.0
		"B.Rotate.Acts.SetSpeed":
			return 0.0
		"B.Physics.Acts.SetEnabled":
			return 0.0
		"B.Physics.Acts.SetImmovable":
			return 0.0
		"B.Physics.Acts.ApplyImpulse":
			return 0.0
		"B.Pin.Acts.PinByProperties":
			return 0.0
		"B.Pin.Acts.Unpin":
			return 0.0
		"NinePatch.Acts.SetSize":
			var np = _resolve_target(a, ctx)
			if np != null and params.size() >= 2:
				np.set_size(_to_f(expr.eval_param(params[0], ctx)), _to_f(expr.eval_param(params[1], ctx)))
			return 0.0
		"HTMLElement.Acts.SetPos":
			return 0.0
		"Arr.Acts.SetInstanceVar":
			var ai = _resolve_target(a, ctx)
			if ai != null and params.size() >= 2:
				ai.set_inst_var(_to_int(params[0].get("v", 0)), expr.eval_param(params[1], ctx))
			return 0.0
		"Arr.Acts.SetX":
			return 0.0
		"Arr.Acts.SetBoolInstanceVar":
			return 0.0
		"Arr.Acts.SetSize":
			return 0.0
		"Arr.Acts.Push":
			return 0.0
		"Arr.Acts.Delete":
			return 0.0
		"Arr.Acts.Shuffle":
			return 0.0
		_:
			# Unknown ACEs (e.g. JavaScript-in-events functions) are handled by
			# the game logic module.
			return 0.0

# ------------------------------------------------------------------ conditions
## True if the pointer is inside the instance's rectangle (screen space).
## The instance's global position is already in screen space, because the
## layout root carries the display scale.
func _pointer_over(inst: Node) -> bool:
	if inst == null or not runtime.pointer_seen:
		return false
	var pos: Vector2 = runtime.pointer_screen
	if pos.x < 0.0:
		return false
	var layer_scale := 1.0
	var layout = runtime.current_layout
	if layout != null:
		var li = layout.layers.get(inst.layer_name, null)
		if li != null:
			layer_scale = float(li.get("scale", 1.0))
	var s: float = layer_scale * runtime.display_scale
	var half_w: float = inst.world_w * 0.5 * s
	var half_h: float = inst.world_h * 0.5 * s
	# The instance position is its origin point; move it to the centre.
	var centre: Vector2 = inst.global_position + Vector2(
		(0.5 - float(inst.origin_x)) * inst.world_w,
		(0.5 - float(inst.origin_y)) * inst.world_h) * s
	return absf(pos.x - centre.x) <= half_w and absf(pos.y - centre.y) <= half_h

func _eval_condition(c: Dictionary, sheet_name: String) -> bool:
	var ace_name: String = c.get("aceName", "")
	var params: Array = c.get("params", [])
	var ctx: Dictionary = {}
	ctx["target"] = _resolve_target(c, ctx)
	match ace_name:
		"System.Cnds.OnLayoutStart":
			return true
		"System.Cnds.EveryTick":
			return true
		"System.Cnds.Compare":
			if params.size() >= 3:
				return _compare(expr.eval_param(params[0], ctx), params[1].get("v", 0), expr.eval_param(params[2], ctx))
			return false
		"System.Cnds.CompareVar":
			if params.size() >= 3:
				var name: String = _var_name(params[0])
				var v = runtime.get_global(name, 0) if name != "" else 0
				return _compare(v, params[1].get("v", 0), expr.eval_param(params[2], ctx))
			return false
		"System.Cnds.IsGroupActive":
			return true
		"System.Cnds.Else":
			return true
		"System.Cnds.TriggerOnce":
			var sid = str(c.get("sid", 0))
			var already := bool(_triggered.get(sid, false))
			if not already:
				_triggered[sid] = true
			return not already
		"System.Cnds.Every":
			return true
		"System.Cnds.ForEach":
			return true
		"System.Cnds.For":
			return true
		"System.Cnds.Repeat":
			return true
		"Touch.Cnds.OnTouchObject":
			# Trigger: a click/touch happened on the object this frame.
			var to = _resolve_target(c, ctx)
			return to != null and runtime.pointer_clicked and _pointer_over(to)
		"Touch.Cnds.IsInTouch":
			# C3: true while a touch is active (the mouse button is held
			# down, or a finger is on the screen).
			return runtime.pointer_down or runtime.pointer_clicked
		"Browser.Cnds.IsPortraitLandscape":
			# C3: portrait when the canvas width <= its height.
			var logical: Vector2 = runtime.logical_size
			var portrait := logical.x <= logical.y
			var want_portrait := true
			if params.size() >= 1:
				want_portrait = int(params[0].get("v", 0)) == 0
			return portrait == want_portrait
		"Text.Cnds.IsVisible":
			var t = _resolve_target(c, ctx)
			return t != null and t.visible_flag
		"Text.Cnds.CompareOpacity":
			var t2 = _resolve_target(c, ctx)
			if t2 == null or params.size() < 2:
				return false
			return _compare(t2.opacity * 100.0, params[0].get("v", 0), expr.eval_param(params[1], ctx))
		"Spritefont2.Cnds.IsVisible":
			var t3 = _resolve_target(c, ctx)
			return t3 != null and t3.visible_flag
		"Sprite.Cnds.CompareFrame":
			var t4 = _resolve_target(c, ctx)
			if t4 == null or params.size() < 2:
				return false
			return _compare(t4.current_frame, params[0].get("v", 0), expr.eval_param(params[1], ctx))
		"Sprite.Cnds.CompareInstanceVar":
			var t5 = _resolve_target(c, ctx)
			if t5 == null or params.size() < 3:
				return false
			var v = t5.get_inst_var(_to_int(params[0].get("v", 0)), 0)
			return _compare(v, params[1].get("v", 0), expr.eval_param(params[2], ctx))
		"Sprite.Cnds.CompareY":
			var t6 = _resolve_target(c, ctx)
			if t6 == null or params.size() < 2:
				return false
			return _compare(t6.world_y, params[0].get("v", 0), expr.eval_param(params[1], ctx))
		"Sprite.Cnds.CompareOpacity":
			var t7 = _resolve_target(c, ctx)
			if t7 == null or params.size() < 2:
				return false
			return _compare(t7.opacity, params[0].get("v", 0), expr.eval_param(params[1], ctx))
		"Sprite.Cnds.IsOnScreen":
			return true
		"Sprite.Cnds.OnCreated":
			return false
		"Arr.Cnds.CompareInstanceVar":
			var t8 = _resolve_target(c, ctx)
			if t8 == null or params.size() < 3:
				return false
			return _compare(t8.get_inst_var(_to_int(params[0].get("v", 0)), 0), params[1].get("v", 0), expr.eval_param(params[2], ctx))
		"video.Cnds.CompareInstanceVar":
			var t9 = _resolve_target(c, ctx)
			if t9 == null or params.size() < 3:
				return false
			return _compare(t9.get_inst_var(_to_int(params[0].get("v", 0)), 0), params[1].get("v", 0), expr.eval_param(params[2], ctx))
		"Audio.Cnds.IsTagPlaying":
			return false
		"AJAX.Cnds.OnComplete":
			return false
		"B.Tween.Cnds.OnTweensFinished":
			# Trigger: the tween with the given tag on the target instance
			# ended (an empty tag matches the untagged tween).
			var tt = _resolve_target(c, ctx)
			if tt == null:
				return false
			var ttag := "" if params.size() < 1 else str(expr.eval_param(params[0], ctx))
			return runtime.tween_finished(tt, ttag)
		"B.Tween.Cnds.IsPlaying":
			var tp = _resolve_target(c, ctx)
			if tp == null:
				return false
			var ptag := "" if params.size() < 1 else str(expr.eval_param(params[0], ctx))
			return runtime.is_tween_playing(tp, ptag)
		"B.Tween.Cnds.IsAnyPlaying":
			var ta = _resolve_target(c, ctx)
			return ta != null and runtime.is_any_tween_playing(ta)
		"B.Timer.Cnds.OnTimer":
			return false
		"B.Timer.Cnds.IsTimerRunning":
			return false
		"NinePatch.Cnds.CompareX":
			return false
		"Particles.Cnds.CompareInstanceVar":
			return false
		"Particles.Cnds.OnCreated":
			return false
		"video.Cnds.OnPlaybackEvent":
			return false
		_:
			return false

## C3.compare(value, op, target) operator table:
##   0: ==   1: !=   2: <   3: <=   4: >   5: >=
func _compare(v: Variant, op: int, target: Variant) -> bool:
	match op:
		0: return _eq(v, target)
		1: return not _eq(v, target)
		2: return _to_f(v) < _to_f(target)
		3: return _to_f(v) <= _to_f(target)
		4: return _to_f(v) > _to_f(target)
		5: return _to_f(v) >= _to_f(target)
	return false

func _eq(a: Variant, b: Variant) -> bool:
	if (a is float or a is int) and (b is float or b is int):
		return abs(_to_f(a) - _to_f(b)) < 0.000001
	return str(a) == str(b)

# ------------------------------------------------------------------ helpers
func _var_name(p: Dictionary) -> String:
	if p.get("t") != "varparam":
		return ""
	return str(runtime.global_by_sid(p.get("sid", 0)))

func _resolve_target(a: Dictionary, context: Dictionary = {}) -> Node:
	var obj_idx: int = a.get("obj", -1)
	if obj_idx < 0 or obj_idx >= data.object_types.size():
		return null
	var picked = context.get("picked", null)
	if picked != null and is_instance_valid(picked) and picked.type_idx == obj_idx:
		return picked
	var list = runtime.instances_of(data.object_types[obj_idx]["name"])
	return list[0] if list.size() > 0 else null

func _instance_from_param(p: Dictionary, ctx: Dictionary) -> Node:
	if p.get("t") != "obj":
		return null
	var obj_idx: int = p.get("v", -1)
	if obj_idx < 0 or obj_idx >= data.object_types.size():
		return null
	var list = runtime.instances_of(data.object_types[obj_idx]["name"])
	return list[0] if list.size() > 0 else null

static func _to_f(v: Variant) -> float:
	if v is float or v is int:
		return float(v)
	if v is String:
		return float(v) if v.is_valid_float() else 0.0
	return 0.0

static func _to_int(v: Variant) -> int:
	if v is int:
		return v
	if v is float:
		return int(v)
	if v is bool:
		return 1 if v else 0
	if v is String:
		return int(v) if v.is_valid_int() else 0
	return 0

static func _truthy(v: Variant) -> bool:
	if v is bool: return v
	if v is int or v is float: return v != 0
	if v is String: return v != ""
	return v != null

# ------------------------------------------------------------------ audio
## Audio.Play(file, loop, volume, pitch, tag)
func _play_audio(params: Array, ctx: Dictionary) -> void:
	var file_name := ""
	var loop := false
	var volume_db := 0.0
	var tag := ""
	for p in params:
		match p.get("t", ""):
			"file":
				var fv = p.get("v", [])
				if fv is Array and fv.size() > 0:
					file_name = str(fv[0])
					if fv.size() > 1:
						loop = bool(fv[1])
			"combo":
				# The loop flag is a combo (0 = no, 1 = yes).
				loop = int(p.get("v", 0)) == 1
			"const":
				if p.get("v") is String:
					tag = str(p.get("v"))
			_:
				pass
	# The second parameter of Audio.Play is the loop combo; the third is the
	# volume in dB.
	if params.size() >= 2 and params[1].get("t", "") == "combo":
		loop = int(params[1].get("v", 0)) == 1
	if params.size() >= 3:
		volume_db = _to_f(expr.eval_param(params[2], ctx))
	if tag == "":
		tag = file_name
	runtime.play_sound(file_name, tag, loop, volume_db)

## Audio.FadeVolume(tag, targetDb, duration, stop?)
func _fade_audio(params: Array, ctx: Dictionary) -> void:
	var tag := ""
	var target_db := 0.0
	var dur := 1.0
	if params.size() > 0 and params[0].get("v") is String:
		tag = str(params[0].get("v"))
	if params.size() > 1:
		target_db = _to_f(expr.eval_param(params[1], ctx))
	if params.size() > 2:
		dur = _to_f(expr.eval_param(params[2], ctx))
	runtime.fade_sound(tag, target_db, dur)

# ------------------------------------------------------------------ tweens
## C3 Tween property indices (SINGLE_PROPERTIES).
const TWEEN_PROPS := [
	"offsetX", "offsetY", "offsetZElevation", "offsetWidth", "offsetHeight",
	"offsetDepth", "offsetAngle", "offsetOpacity", "offsetColor",
	"offsetScaleX", "offsetScaleY", "offsetScaleZ",
]

func _tween_one(a: Dictionary, params: Array, ctx: Dictionary) -> float:
	var t = _resolve_target(a, ctx)
	if t == null or params.size() < 5:
		return 0.0
	var tag := str(expr.eval_param(params[0], ctx)) if params[0].get("t") != "const" else str(params[0].get("v", ""))
	var prop_idx: int = _to_int(params[1].get("v", 0))
	var end_value = expr.eval_param(params[2], ctx)
	var dur := _to_f(expr.eval_param(params[3], ctx))
	var ease_idx: int = _to_int(params[4].get("v", 0)) if params.size() > 4 else 0
	runtime.start_tween(t, tag, [[prop_idx, end_value]], dur, ease_idx)
	return 0.0

func _tween_two(a: Dictionary, params: Array, ctx: Dictionary) -> float:
	var t = _resolve_target(a, ctx)
	if t == null or params.size() < 5:
		return 0.0
	var tag := str(expr.eval_param(params[0], ctx)) if params[0].get("t") != "const" else str(params[0].get("v", ""))
	var p1: int = _to_int(params[1].get("v", 0))
	var v1 = expr.eval_param(params[2], ctx)
	var p2: int = _to_int(params[3].get("v", 0))
	var v2 = expr.eval_param(params[4], ctx)
	var dur := _to_f(expr.eval_param(params[5], ctx)) if params.size() > 5 else 0.0
	var ease_idx: int = _to_int(params[6].get("v", 0)) if params.size() > 6 else 0
	runtime.start_tween(t, tag, [[p1, v1], [p2, v2]], dur, ease_idx)
	return 0.0

# ------------------------------------------------------------------ timers
func _start_timer(a: Dictionary, params: Array, ctx: Dictionary) -> void:
	var t = _resolve_target(a, ctx)
	if t == null or params.is_empty():
		return
	var dur := _to_f(expr.eval_param(params[0], ctx))
	var tag := ""
	if params.size() > 2:
		tag = str(expr.eval_param(params[2], ctx))
	_timers[t.sid] = {"running": true, "t": 0.0, "dur": dur, "tag": tag, "obj": t}

# ------------------------------------------------------------------ ajax
func _ajax_request(params: Array, ctx: Dictionary) -> void:
	# The original game calls a remote license server and compares the reply
	# with "BLOCKED". Offline the request is answered immediately with a
	# non-blocking value so the game stays playable.
	var tag := ""
	for p in params:
		if p.get("t") == "const" and p.get("v") is String:
			tag = str(p.get("v"))
	runtime.set_global("AjaxLastData", "OK")
	if tag == "lic":
		runtime.set_global("AjaxLicResult", "OK")

# ------------------------------------------------------------------ spawn
func _spawn(a: Dictionary, params: Array, ctx: Dictionary) -> void:
	var t = _resolve_target(a, ctx)
	if t == null:
		return
	var layer_name: String = t.layer_name
	if params.size() > 0:
		var lv = expr.eval_param(params[0], ctx)
		if lv is String:
			layer_name = str(lv)
	var inst = runtime.spawn_instance(t.type_data, layer_name)
	if inst != null:
		inst.set_position_xy(t.world_x, t.world_y)
		inst.set_size(t.world_w, t.world_h)
		inst.set_opacity(t.opacity)
		inst.set_scale_factor(t.scale_factor)
		inst.set_visible_flag(t.visible_flag)
		inst.set_color(t.color)
		if params.size() > 1:
			var lx = expr.eval_param(params[1], ctx)
			var ly = expr.eval_param(params[2], ctx) if params.size() > 2 else 0
			if lx is float or lx is int:
				inst.set_position_xy(_to_f(lx), _to_f(ly))

func _add_child(a: Dictionary, params: Array, ctx: Dictionary) -> void:
	return
