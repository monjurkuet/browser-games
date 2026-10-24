extends RefCounted
## Evaluates C3 expressions.
##
## Constant expressions are inlined in the exported data. Dynamic ones are
## implemented by the generated library c3/c3_expr_funcs.gd, which is
## transpiled from the original C3 JavaScript.

var runtime: Node = null
var data: Node = null
var _lib: RefCounted = null
var _ctx: Dictionary = {}

func _init(rt: Node, d: Node) -> void:
	runtime = rt
	data = d
	_lib = load("res://c3/c3_expr_funcs.gd").new()
	_lib.runtime = rt
	_lib.data = d

## Evaluates a parameter descriptor (from game_data.json).
func eval_param(p: Dictionary, context: Dictionary) -> Variant:
	match p.get("t", ""):
		"const": return p.get("v")
		"combo": return p.get("v")
		"bool": return p.get("v")
		"ease": return p.get("v")
		"obj": return p.get("v")
		"layout": return p.get("v")
		"file": return p.get("v")
		"varparam": return _global_by_sid(p.get("sid", 0))
		"instvarparam": return p.get("v")
		"raw": return p.get("v")
		"expr": return eval_expr(p, context)
	return null

## Evaluates a dynamic expression descriptor.
func eval_expr(p: Dictionary, context: Dictionary) -> Variant:
	var num: int = int(p.get("num", 0))
	var fname: String = _lib.get_func_name(num)
	if fname == "":
		_lib.ctx = context
		var special = _eval_special(num, p.get("nodes", []), context)
		if special != null:
			return special
		return p.get("v", null)
	_lib.ctx = context
	var nodes: Array = p.get("nodes", [])
	var val = _lib.call(fname, nodes)
	return val

## Expressions that have no transpiled implementation because they read data
## of the C3 "Array" plugin (which has no static representation).
## 262: Array_Bonus.At(LoopIndex) - the bonus ladder label of the current
## array element.
func _eval_special(num: int, nodes: Array, context: Dictionary) -> Variant:
	if num == 262:
		return _eval_array_at(nodes)
	if num == 314:
		# len(variable): the number of characters of the stored text.
		if nodes.size() < 2:
			return null
		var v = _lib.VarVal(nodes, 1)
		return _lib._call_system_exp(int(nodes[0].get("ace", 0)), [v])
	if num == 315:
		# The "Touch to START!" typewriter effect: one character of the
		# stored text per tick, wrapped in a bouncing [offsetY] tag.
		if nodes.size() < 5:
			return null
		var t = _lib._call_system_exp(int(nodes[0].get("ace", 0)), [])
		var li = _lib._call_system_exp(int(nodes[1].get("ace", 0)), [])
		var li2 = _lib._call_system_exp(int(nodes[4].get("ace", 0)), [])
		var text_v = _lib.VarVal(nodes, 3)
		var ch = _lib._call_system_exp(int(nodes[2].get("ace", 0)), [text_v, li2, 1])
		var off: float = sin(deg_to_rad(float(t) * 200.0 + float(li) * 40.0)) * 2.0
		return "[offsetY=" + str(off) + "]" + str(ch) + "[/offsetY]"
	return null

## Array_Bonus.At(LoopIndex) - the bonus ladder label of the current array
## element.
func _eval_array_at(nodes: Array) -> Variant:
	if nodes.size() < 2 or data == null:
		return null
	var nd: Dictionary = nodes[0]
	if nd.get("t") != "obj":
		return null
	var oidx: int = int(nd.get("obj", -1))
	if oidx < 0 or oidx >= data.object_types.size():
		return null
	var type_name: String = data.object_types[oidx].get("name", "")
	var arrs: Dictionary = data.arrays
	if not arrs.has(type_name):
		return null
	var idx: int = int(_lib._call_system_exp(int(nodes[1].get("ace", 0)), []))
	var vals: Array = arrs[type_name]
	if idx < 0 or idx >= vals.size():
		return null
	return vals[idx]

func _global_by_sid(sid) -> Variant:
	var name: String = runtime.global_by_sid(sid)
	if name == "":
		return 0
	return runtime.get_global(name, 0)
