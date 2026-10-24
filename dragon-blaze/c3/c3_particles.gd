extends Node2D
## C3 "Particles" plugin equivalent.
##
## Reproduces the behaviour of scripts/plugins/Particles in the original
## runtime: an emitter sprays particles inside a cone; every particle has a
## position, speed, angle, size, opacity and age. The engine state comes from
## the instance state array:
##   [0]=rate [1]=spray cone (deg) [2]=spray type (1=one-shot) [3]=particle
##   object class (SID / type id / -1) [4]=visible [5]=init speed [6]=init
##   size [7]=init opacity (%) [8]=grow rate [9]=init X random [10]=init Y
##   random [11]=init speed random [12]=init size random [13]=grow random
##   [14]=acceleration [15]=gravity [16]=life angle random [17]=life speed
##   random [18]=life opacity random [19]=destroy mode [20]=timeout

const DESTROY_FADE := 0

var rate: float = 0.0
var spray_cone: float = 0.0          # radians
var one_shot: bool = false
var particle_type: String = ""       # "" = draw the emitter texture
var init_speed: float = 0.0
var init_size: float = 0.0
var init_opacity: float = 1.0
var grow_rate: float = 0.0
var init_x_random: float = 0.0
var init_y_random: float = 0.0
var init_speed_random: float = 0.0
var init_size_random: float = 0.0
var grow_random: float = 0.0
var acceleration: float = 0.0
var gravity: float = 0.0
var life_angle_random: float = 0.0
var life_speed_random: float = 0.0
var life_opacity_random: float = 0.0
var destroy_mode: int = 0
var timeout: float = 1.0

var spawn_x: float = 0.0
var spawn_y: float = 0.0
var spawn_angle: float = 0.0
var master_opacity: float = 1.0

var _texture: Texture2D = null
var _particles: Array = []
var _spawn_accum: float = 0.0
var _spawned: int = 0
var _rng := RandomNumberGenerator.new()
var _layer: Node = null
var _data: Node = null
var _type_data: Dictionary = {}

## randomOffset() of the C3 particle engine: a random value in [-t/2, t/2).
static func _random_offset(rng: RandomNumberGenerator, t: float) -> float:
	if t == 0.0:
		return 0.0
	return rng.randf() * t - t * 0.5

func setup(state: Array, type_data: Dictionary, data_node: Node, layer: Node) -> void:
	_type_data = type_data
	_data = data_node
	_layer = layer
	_rng.seed = 0x5eed
	var st: Array = state
	if st.size() >= 21:
		rate = float(st[0])
		spray_cone = deg_to_rad(float(st[1]))
		one_shot = int(st[2]) == 1
		init_speed = float(st[5])
		init_size = float(st[6])
		init_opacity = float(st[7]) / 100.0
		grow_rate = float(st[8])
		init_x_random = float(st[9])
		init_y_random = float(st[10])
		init_speed_random = float(st[11])
		init_size_random = float(st[12])
		grow_random = float(st[13])
		acceleration = float(st[14])
		gravity = float(st[15])
		life_angle_random = float(st[16])
		life_speed_random = float(st[17])
		life_opacity_random = float(st[18])
		destroy_mode = int(st[19])
		timeout = float(st[20])
		particle_type = _resolve_particle_type(st[3])
	# The emitter texture is the type's own image.
	var img = type_data.get("image", null)
	if img is Dictionary and img.has("path"):
		var sheet = str(img["path"])
		var r = Rect2i(int(img.get("x", 0)), int(img.get("y", 0)), int(img.get("w", 0)), int(img.get("h", 0)))
		if r.size.x > 0 and r.size.y > 0:
			_texture = data_node.get_atlas(sheet, r, bool(img.get("rotated", false)))
	if one_shot:
		_spawned = 0
	# The particle coordinates are absolute layout coordinates; the node is
	# offset by the emitter position so that they map onto the layout.
	position = Vector2(-spawn_x, -spawn_y)

## Resolves the particle object class of the emitter state: either the id of
## an object type, a runtime SID, or -1 (the emitter draws its own texture).
func _resolve_particle_type(ref) -> String:
	if ref == null:
		return ""
	var n := int(ref)
	if n < 0:
		return ""
	# Large values are the object type ids of the project data.
	for t in _data.object_types:
		if int(t.get("id", -1)) == n:
			return str(t.get("name", ""))
	# Small values are runtime SIDs; the game object types are numbered after
	# the plugin types.
	return ""

func _process(delta: float) -> void:
	# The particle coordinates are absolute layout coordinates; the node is
	# offset by the emitter position so that they map onto the layout.
	position = Vector2(-spawn_x, -spawn_y)
	if rate <= 0.0:
		return
	var count := 0
	if one_shot:
		if _spawned < int(rate):
			count = int(rate) - _spawned
			_spawned += count
	else:
		_spawn_accum += rate * delta
		count = int(_spawn_accum)
		_spawn_accum -= float(count)
	for i in count:
		_spawn()
	var alive: Array = []
	for p in _particles:
		if _tick(p, delta):
			alive.append(p)
	_particles = alive
	queue_redraw()

func _spawn() -> void:
	var p := {
		"x": spawn_x + _random_offset(_rng, init_x_random),
		"y": spawn_y + _random_offset(_rng, init_y_random),
		"speed": init_speed + _random_offset(_rng, init_speed_random),
		"angle": spawn_angle + _random_offset(_rng, spray_cone),
		"opacity": init_opacity,
		"size": init_size + _random_offset(_rng, init_size_random),
		"grow": grow_rate + _random_offset(_rng, grow_random),
		"gs": 0.0,
		"age": 0.0,
		"inst": null,
	}
	# When the emitter references an object type, every particle is an
	# instance of that type (like the C3 Particles plugin does).
	if particle_type != "" and _layer != null and _layer.has_method("spawn_on_layer"):
		var t: Dictionary = _data.get_type(particle_type)
		if not t.is_empty():
			var inst = _layer.spawn_on_layer(_layer, t)
			p["inst"] = inst
	_particles.append(p)

func _tick(p: Dictionary, delta: float) -> bool:
	var dist: float = float(p["speed"]) * delta
	var ang: float = float(p["angle"])
	p["x"] = float(p["x"]) + cos(ang) * dist
	p["y"] = float(p["y"]) + sin(ang) * dist + float(p["gs"]) * delta
	p["size"] = float(p["size"]) + float(p["grow"]) * delta
	p["speed"] = float(p["speed"]) + acceleration * delta
	p["gs"] = float(p["gs"]) + gravity * delta
	p["age"] = float(p["age"]) + delta
	if life_angle_random != 0.0:
		p["angle"] = ang + _random_offset(_rng, life_angle_random * delta)
	if life_speed_random != 0.0:
		p["speed"] = float(p["speed"]) + _random_offset(_rng, life_speed_random * delta)
	if life_opacity_random != 0.0:
		p["opacity"] = clampf(float(p["opacity"]) + _random_offset(_rng, life_opacity_random * delta), 0.0, 1.0)
	var alive := float(p["size"]) >= 1.0 and (float(p["age"]) < timeout if destroy_mode != 2 else float(p["speed"]) > 0.0)
	var alpha := master_opacity * float(p["opacity"])
	if destroy_mode == DESTROY_FADE:
		alpha *= 1.0 - float(p["age"]) / max(timeout, 0.0001)
	if not alive:
		return false
	var inst = p.get("inst", null)
	if inst != null and is_instance_valid(inst):
		inst.set("world_x", float(p["x"]))
		inst.set("world_y", float(p["y"]))
		inst.set("world_w", float(p["size"]))
		inst.set("world_h", float(p["size"]))
		inst.set("opacity", clampf(alpha, 0.0, 1.0))
		if inst.has_method("_update_transform"):
			inst.call("_update_transform")
		if inst.has_method("_apply_frame"):
			inst.call("_apply_frame")
	return true

func _draw() -> void:
	if _texture == null:
		return
	for p in _particles:
		if p.get("inst", null) != null:
			continue
		var alpha := master_opacity * float(p["opacity"])
		if destroy_mode == DESTROY_FADE:
			alpha *= 1.0 - float(p["age"]) / max(timeout, 0.0001)
		if alpha <= 0.0:
			continue
		var s: float = float(p["size"])
		if s < 1.0:
			continue
		draw_texture_rect(_texture, Rect2(float(p["x"]) - s * 0.5, float(p["y"]) - s * 0.5, s, s), false, Color(1, 1, 1, alpha))
