extends Node2D
## Builds and manages a C3 layout.
##
## C3 draw order (validated against the browser):
##   - Root layers draw in layout order (first = bottom).
##   - A layer draws its sub-layers (hierarchy groups) FIRST, then its own
##     instances.
##   - Within a layer, instances draw in z-index (creation) order.
##
## View model (validated against the browser):
##   screen = (layout_pos - origin) * display_scale
##   origin = scroll * parallax - logical_size / (2 * layer_scale)
##
## Every instance is a direct child of the layout root with an absolute
## z_index equal to its position in the flattened C3 draw order, so the
## ordering is exact and independent of the node tree.

signal layout_ready(layout_name)

var layout_name: String = ""
var layout_data: Dictionary = {}
var data: Node = null          # C3Data
var runtime: Node = null       # C3Runtime

var layers: Dictionary = {}       # name -> layer data
var layer_nodes: Dictionary = {}  # name -> Node2D (root layers and groups)
var layer_order: Array = []       # root layer names, bottom-to-top
var instances: Array = []         # all C3Instance in creation order
var instances_by_name: Dictionary = {}  # type name -> Array[C3Instance]
var instances_by_uid: Dictionary = {}   # sid -> C3Instance
var _view_scroll: Vector2 = Vector2.ZERO
var _view_logical: Vector2 = Vector2(1280, 720)
var _view_scale: float = 1.0
var _next_order: int = 0
var _background: Node2D = null

func build(lname: String, data_node: Node, runtime_node: Node) -> void:
	data = data_node
	runtime = runtime_node
	layout_name = lname
	layout_data = data.get_layout(lname)
	if layout_data.is_empty():
		push_error("Unknown layout: " + lname)
		return
	# Node holding the layer background colours, below every instance.
	_background = Node2D.new()
	_background.name = "Background"
	add_child(_background)
	_background.z_as_relative = false
	_background.z_index = -4096
	for l in layout_data.get("layers", []):
		_create_layer(l)
	var order := 0
	for l in layout_data.get("layers", []):
		order = _create_instances(l, order)
	_next_order = order
	layout_ready.emit(lname)

## Creates the node for a layer (or hierarchy group) and its sub-layers.
func _create_layer(l: Dictionary) -> Node2D:
	var lname: String = l["name"]
	var node := Node2D.new()
	node.name = lname
	add_child(node)
	layer_nodes[lname] = node
	layers[lname] = l
	if not layer_order.has(lname):
		layer_order.append(lname)
	# Background colour for non-transparent layers. It is placed in a
	# dedicated node below every instance, so the layer background never
	# covers the layer's content.
	if not l.get("transparent", false) and l.get("bgColor", null) is Array:
		var bc: Array = l["bgColor"]
		if bc.size() >= 3:
			var cr := ColorRect.new()
			cr.color = Color(bc[0] / 255.0, bc[1] / 255.0, bc[2] / 255.0, 1.0)
			cr.size = Vector2(layout_data.get("width", 2000), layout_data.get("height", 2500))
			cr.z_as_relative = false
			cr.z_index = -4096
			cr.mouse_filter = Control.MOUSE_FILTER_IGNORE
			_background.add_child(cr)
	# Sub-layers (hierarchy groups) are registered too.
	for g in l.get("groups", []):
		_create_layer(g)
	return node

## Creates the instances of a layer and its hierarchy groups in C3 draw
## order. Returns the next free z-index.
func _create_instances(l: Dictionary, order: int) -> int:
	for g in l.get("groups", []):
		order = _create_instances(g, order)
	for inst in l.get("instances", []):
		_create_instance(inst, l, order)
		order += 1
	return order

func _create_instance(inst: Dictionary, layer: Dictionary, order: int) -> void:
	var tidx: int = inst.get("typeIdx", -1)
	if tidx < 0 or tidx >= data.object_types.size():
		return
	var t: Dictionary = data.object_types[tidx]
	var C3Inst = load("res://c3/c3_instance.gd")
	var node = C3Inst.new()
	node.type_name = t.get("name", "")
	node.layer_name = layer.get("name", "")
	# setup() must run before the node enters the tree, because _ready() builds
	# the visual from the type data.
	node.setup(t, inst, data)
	add_child(node)
	node.set_draw_order(order)
	instances.append(node)
	instances_by_uid[node.sid] = node
	if not instances_by_name.has(node.type_name):
		instances_by_name[node.type_name] = []
	instances_by_name[node.type_name].append(node)

## Returns the node of a layer or group by name.
func get_layer_node(name: String) -> Node2D:
	return layer_nodes.get(name, null)

func get_layer(name: String) -> Node2D:
	return layer_nodes.get(name, null)

## Creates a new instance on the given layer, at the end of the draw order.
func spawn_on_layer(lnode: Node2D, type_data: Dictionary) -> Node:
	var C3Inst = load("res://c3/c3_instance.gd")
	var node = C3Inst.new()
	node.type_name = type_data.get("name", "")
	# The instance belongs to the layer it is spawned on: it needs the layer
	# name to get the layer's viewport origin and scale.
	node.layer_name = lnode.name
	node.setup(type_data, {"world": {"x": 0, "y": 0, "z": 0, "w": 0, "h": 0, "angle": 0,
		"tint": [1, 1, 1, 1], "originX": 0.5, "originY": 0.5}, "instVars": [],
		"effectsOverride": [], "state": null, "sid": ""}, data)
	lnode.add_child(node)
	node.set_draw_order(_draw_order_for_layer(lnode.name))
	_next_order += 1
	instances.append(node)
	if not instances_by_name.has(node.type_name):
		instances_by_name[node.type_name] = []
	instances_by_name[node.type_name].append(node)
	return node

## The draw order for a new instance of a layer: it has to stay inside the
## layer's z range, so that it is drawn above the layer's other instances
## but still below the layers above it (e.g. the HUD).
func _draw_order_for_layer(layer_name: String) -> int:
	var idx := layer_order.find(layer_name)
	for i in range(idx + 1, layer_order.size()):
		for inst in instances:
			if inst.layer_name == layer_order[i]:
				return int(inst.z_index) - 1
	var hi := -1
	for inst in instances:
		if inst.layer_name == layer_name:
			hi = maxi(hi, int(inst.z_index))
	return hi + 1

func get_instances(type_name: String) -> Array:
	return instances_by_name.get(type_name, [])

func get_first(type_name: String) -> Node:
	var arr = get_instances(type_name)
	return arr[0] if arr.size() > 0 else null

func find_by_uid(sid) -> Node:
	return instances_by_uid.get(sid, null)

func remove_instance(inst: Node) -> void:
	instances.erase(inst)
	if instances_by_uid.has(inst.sid):
		instances_by_uid.erase(inst.sid)
	var arr = instances_by_name.get(inst.type_name, [])
	arr.erase(inst)
	if inst.is_inside_tree():
		inst.get_parent().remove_child(inst)
	inst.queue_free()

# --------------------------------------------------------------------- view
func apply_view(scroll_pos: Vector2, logical: Vector2, scale: float) -> void:
	_view_scroll = scroll_pos
	_view_logical = logical
	_view_scale = scale
	_refresh_layer_transforms()

func _refresh_layer_transforms() -> void:
	# The layout root carries the display scale; each instance is offset by
	# its layer's viewport origin.
	self.scale = Vector2(_view_scale, _view_scale)
	for inst in instances:
		var l: Dictionary = layers.get(inst.layer_name, {})
		if l.is_empty():
			continue
		inst.set_layer_origin(_layer_origin(l))
		inst.set_layer_scale(float(l.get("scale", 1.0)))

func _layer_origin(l: Dictionary) -> Vector2:
	var parallax_x: float = float(l.get("parallaxX", 1.0))
	var parallax_y: float = float(l.get("parallaxY", 1.0))
	var layer_scale: float = float(l.get("scale", 1.0))
	var sx := _view_scroll.x * parallax_x
	var sy := _view_scroll.y * parallax_y
	var vw := _view_logical.x / layer_scale
	var vh := _view_logical.y / layer_scale
	return Vector2(sx - vw * 0.5, sy - vh * 0.5)
