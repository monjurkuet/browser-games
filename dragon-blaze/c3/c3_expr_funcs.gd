# GENERATED FILE - do not edit. Source: expr_lib.js
extends "res://c3/c3_expr_base.gd"

## Transpiled C3 expression functions. Each takes the node list of the
## expression it belongs to.

func E1(nodes: Array) -> Variant:
	return ObjExp(nodes, 0)

func E24(nodes: Array) -> Variant:
	return FnCall(nodes, 0)

func E26(nodes: Array) -> Variant:
	return InstVar(nodes, 0)

func E61(nodes: Array) -> Variant:
	return Add(ObjExp(nodes, 0), (ObjExp(nodes, 1) / 10))

func E65(nodes: Array) -> Variant:
	return Tern(Tern((VarVal(nodes, 0) == 0), 1, 0), FnCall(nodes, 1, 255, 255, 255), FnCall(nodes, 2, 125, 125, 125))

func E69(nodes: Array) -> Variant:
	return Add(ObjExp(nodes, 0), (ObjExp(nodes, 1) / 5))

func E81(nodes: Array) -> Variant:
	return Add(ObjExp(nodes, 0), (ObjExp(nodes, 1) / 2))

func E82(nodes: Array) -> Variant:
	return FnCall(nodes, 0, FnCall(nodes, 1, 0, 7))

func E83(nodes: Array) -> Variant:
	return FnCall(nodes, 0, (-180), 180, (-90), 90, (-45), 45)

func E84(nodes: Array) -> Variant:
	return FnCall(nodes, 0, FnCall(nodes, 1, 0, 4))

func E86(nodes: Array) -> Variant:
	return FnCall(nodes, 0, (-180), 180)

func E121(nodes: Array) -> Variant:
	return And("X", VarVal(nodes, 0))

func E135(nodes: Array) -> Variant:
	return (VarVal(nodes, 0) * VarVal(nodes, 1))

func E136(nodes: Array) -> Variant:
	return VarVal(nodes, 0)

func E139(nodes: Array) -> Variant:
	return (ObjExp(nodes, 0) - (ObjExp(nodes, 1) / 5))

func E174(nodes: Array) -> Variant:
	return Tern(Tern((VarVal(nodes, 0) == InstVar(nodes, 1)), 1, 0), 1, 0)

func E176(nodes: Array) -> Variant:
	return BehExp(nodes, 0, "zoom out especial")

func E178(nodes: Array) -> Variant:
	return BehExp(nodes, 0, "zoom in especial")

func E192(nodes: Array) -> Variant:
	return FnCall(nodes, 0, Add(ObjExp(nodes, 1), (ObjExp(nodes, 2) / 10)))

func E212(nodes: Array) -> Variant:
	return Add("$", FnCall(nodes, 0, VarVal(nodes, 1), VarVal(nodes, 2), ","))

func E227(nodes: Array) -> Variant:
	return Add(FnCall(nodes, 0, 0), 100)

func E228(nodes: Array) -> Variant:
	return FnCall(nodes, 0, 1, 2, 3)

func E266(nodes: Array) -> Variant:
	return FnCall(nodes, 0, 4, 7)

func E269(nodes: Array) -> Variant:
	return BehExp(nodes, 0, "C")

func E271(nodes: Array) -> Variant:
	return BehExp(nodes, 0, "")

## Maps an expression index to its generated function name.
func get_func_name(idx: int) -> String:
	match idx:
		1: return "E1"
		24: return "E24"
		26: return "E26"
		61: return "E61"
		65: return "E65"
		69: return "E69"
		81: return "E81"
		82: return "E82"
		83: return "E83"
		84: return "E84"
		86: return "E86"
		121: return "E121"
		135: return "E135"
		136: return "E136"
		139: return "E139"
		174: return "E174"
		176: return "E176"
		178: return "E178"
		192: return "E192"
		212: return "E212"
		227: return "E227"
		228: return "E228"
		266: return "E266"
		269: return "E269"
		271: return "E271"
	return ""
