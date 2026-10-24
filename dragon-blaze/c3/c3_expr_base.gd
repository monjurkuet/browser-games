extends RefCounted
## Base class for the generated C3 expression library.
##
## Provides the runtime accessors used by the transpiled expression
## functions: object expressions, instance variables, global variables,
## system expression calls and behavior expressions.

var runtime: Node = null
var data: Node = null
var ctx: Dictionary = {}     # evaluation context (target instance, loop index, ...)

func _init(rt: Node = null, d: Node = null) -> void:
	runtime = rt
	data = d

# ------------------------------------------------------------ node accessors
## Object expression: e.g. Sprite.Exps.X of a given instance.
func ObjExp(nodes: Array, i: int) -> Variant:
	if i >= nodes.size():
		return null
	var nd: Dictionary = nodes[i]
	var inst = _resolve_instance(nd.get("obj", -1))
	if inst == null:
		return 0
	return _eval_object_exp(inst, nd.get("ace", -1))

## Instance variable of a given object.
func InstVar(nodes: Array, i: int) -> Variant:
	if i >= nodes.size():
		return null
	var nd: Dictionary = nodes[i]
	var inst = _resolve_instance(nd.get("obj", -1))
	if inst == null:
		return 0
	return inst.get_inst_var(nd.get("varIdx", -1), 0)

## Global / sheet variable value.
func VarVal(nodes: Array, i: int) -> Variant:
	if i >= nodes.size():
		return null
	var nd: Dictionary = nodes[i]
	return _global_by_sid(nd.get("sid", 0))

## System expression call (e.g. random(), int(), layoutname()).
func FnCall(nodes: Array, i: int, ...args: Array) -> Variant:
	if i >= nodes.size():
		return null
	var nd: Dictionary = nodes[i]
	return _call_system_exp(int(nd.get("ace", 0)), args)

## Behavior expression (e.g. a scrollto behavior's current value).
func BehExp(nodes: Array, i: int, _name: String) -> Variant:
	return 0

# ---------------------------------------------------------------- internals
func _global_by_sid(sid) -> Variant:
	if runtime == null:
		return 0
	var name: String = runtime.global_by_sid(sid)
	if name == "":
		return 0
	return runtime.get_global(name, 0)

func _resolve_instance(obj_idx: int) -> Node:
	if obj_idx < 0 or runtime == null or runtime.data == null:
		return null
	var types = runtime.data.object_types
	if obj_idx >= types.size():
		return null
	var target = ctx.get("target", null)
	if target != null and target.type_idx == obj_idx:
		return target
	var picked = ctx.get("picked", null)
	if picked != null and picked.type_idx == obj_idx:
		return picked
	var list = runtime.instances_of(types[obj_idx]["name"])
	if list.size() > 0:
		return list[0]
	return null

func _eval_object_exp(inst: Node, ace: int) -> Variant:
	match _ace_name(ace):
		"Sprite.Exps.X": return inst.world_x
		"Sprite.Exps.Y": return inst.world_y
		"Sprite.Exps.Width": return inst.world_w
		"Sprite.Exps.Height": return inst.world_h
		"Sprite.Exps.AnimationFrame": return inst.current_frame
		"Sprite.Exps.Opacity": return inst.opacity
		"Sprite.Exps.Count": return runtime.instances_of(inst.type_name).size()
		"Sprite.Exps.Angle": return inst.world_angle
		"Text.Exps.Text": return inst.extra_state[0] if inst.extra_state.size() > 0 else ""
		"Spritefont2.Exps.Text": return inst.extra_state[0] if inst.extra_state.size() > 0 else ""
		"Arr.Exps.At": return inst.get_inst_var(0, 0)
		"Arr.Exps.Width": return inst.get_inst_var(1, 0)
		"video.Exps.X": return inst.world_x
	return 0

func _call_system_exp(ace: int, args: Array) -> Variant:
	match _ace_name(ace):
		"System.Exps.int":
			return int(args[0]) if args.size() > 0 else 0
		"System.Exps.random":
			var lo: int = int(args[0]) if args.size() > 0 else 0
			var hi: int = int(args[1]) if args.size() > 1 else 0
			return randi_range(lo, hi)
		"System.Exps.choose":
			var arr = args[0] if args.size() > 0 else []
			return arr[randi() % arr.size()] if arr is Array and arr.size() > 0 else null
		"System.Exps.len":
			var s = args[0] if args.size() > 0 else ""
			return s.length() if s is String else 0
		"System.Exps.mid":
			var s2 = args[0] if args.size() > 0 else ""
			var idx: int = int(args[1]) if args.size() > 1 else 0
			var cnt: int = int(args[2]) if args.size() > 2 else 1
			if s2 is String:
				if cnt < 0:
					return s2.substr(max(idx + cnt, 0), -cnt)
				return s2.substr(idx, cnt)
			return ""
		"System.Exps.replace":
			var s3 = args[0] if args.size() > 0 else ""
			var find_s = args[1] if args.size() > 1 else ""
			var repl = args[2] if args.size() > 2 else ""
			return s3.replace(find_s, repl) if s3 is String and find_s is String else s3
		"System.Exps.rgb":
			return Color(float(args[0]) / 255.0, float(args[1]) / 255.0, float(args[2]) / 255.0, 1.0)
		"System.Exps.time":
			return Time.get_ticks_msec() / 1000.0
		"System.Exps.layoutname":
			return runtime.current_layout_name if runtime else ""
		"System.Exps.loopindex":
			return ctx.get("loop_index", 0)
		"System.Exps.tokenat":
			var s4 = args[0] if args.size() > 0 else ""
			var tidx: int = int(floor(to_f(args[1]))) if args.size() > 1 else 0
			if s4 is String:
				var parts = s4.split(args[2] if args.size() > 2 and args[2] is String else ",")
				return parts[tidx] if tidx >= 0 and tidx < parts.size() else ""
			return ""
		"System.Exps.projectversion":
			return data.version if data else ""
		"System.Exps.projectname":
			return data.project_name if data else ""
		"System.Exps.urlencode":
			return String(args[0]).uri_encode() if args.size() > 0 else ""
		"System.Exps.viewportwidth":
			return runtime.logical_size.x if runtime else 0.0
		"System.Exps.viewportheight":
			return runtime.logical_size.y if runtime else 0.0
		"System.Exps.left":
			var ls = args[0] if args.size() > 0 else ""
			var ln := _to_int(args[1]) if args.size() > 1 else 0
			return ls.substr(0, ln) if ls is String else ""
		"System.Exps.right":
			var rs = args[0] if args.size() > 0 else ""
			var rn := _to_int(args[1]) if args.size() > 1 else 0
			return rs.substr(max(rs.length() - rn, 0)) if rs is String else ""
		"Browser.Exps.Domain":
			return "drakorya.com.br"
		"AJAX.Exps.LastData":
			return runtime.get_global("AjaxLastData", "") if runtime else ""
	return 0

var _ace_name_cache: Dictionary = {}
func _ace_name(ace) -> String:
	if _ace_name_cache.is_empty():
		var f := FileAccess.open("res://ace_names.json", FileAccess.READ)
		if f:
			_ace_name_cache = JSON.parse_string(f.get_as_text())
			f.close()
	return _ace_name_cache.get(str(int(ace)), "")

# ------------------------------------------------------------------ operators
## JavaScript's `+`: numeric addition, or string concatenation when either
## operand is a string.
static func Add(a: Variant, b: Variant) -> Variant:
	if a is String or b is String:
		return str(a) + str(b)
	if a is bool:
		a = 1 if a else 0
	if b is bool:
		b = 1 if b else 0
	if a is int and b is int:
		return a + b
	return to_f(a) + to_f(b)

static func Tern(c: Variant, a: Variant, b: Variant) -> Variant:
	return a if truthy(c) else b

static func And(l: Variant, r: Variant) -> Variant:
	if l is String or r is String:
		return str(l) + str(r)
	return 1 if (truthy(l) and truthy(r)) else 0

static func Or(l: Variant, r: Variant) -> Variant:
	if (l is float or l is int) and (r is float or r is int):
		return 1 if (truthy(l) or truthy(r)) else 0
	return l

static func Clamp(v: Variant, lo: Variant, hi: Variant) -> Variant:
	var fv := to_f(v)
	return max(to_f(lo), min(to_f(hi), fv))

static func truthy(v: Variant) -> bool:
	if v is bool: return v
	if v is int or v is float: return v != 0
	if v is String: return v != ""
	if v == null: return false
	return true

static func to_f(v: Variant) -> float:
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
