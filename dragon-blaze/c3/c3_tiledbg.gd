extends Node2D
## C3 "TiledBg" plugin equivalent: tiles an image across the instance
## rectangle, honouring the image offset, scale and angle.

var texture: Texture2D = null
var rect_size: Vector2 = Vector2.ZERO
var image_offset: Vector2 = Vector2.ZERO
var image_scale: Vector2 = Vector2.ONE
var image_angle: float = 0.0

func setup(tex: Texture2D, size: Vector2, offset: Vector2, scale: Vector2) -> void:
	texture = tex
	rect_size = size
	image_offset = offset
	image_scale = scale
	queue_redraw()

func set_rect_size(s: Vector2) -> void:
	rect_size = s
	queue_redraw()

func _draw() -> void:
	if texture == null or rect_size.x <= 0.0 or rect_size.y <= 0.0:
		return
	var tw := float(texture.get_width()) * image_scale.x
	var th := float(texture.get_height()) * image_scale.y
	if tw <= 0.0 or th <= 0.0:
		return
	var cols := int(ceil(rect_size.x / tw)) + 1
	var rows := int(ceil(rect_size.y / th)) + 1
	for r in rows:
		for c in cols:
			# The image is tiled over the instance rectangle; tiles that stick
			# out are clipped to it (C3 draws nothing at all for an empty
			# rectangle, e.g. the progress bar before it is filled).
			var tx0 := image_offset.x + c * tw
			var ty0 := image_offset.y + r * th
			var x0 := maxf(tx0, 0.0)
			var y0 := maxf(ty0, 0.0)
			var x1 := minf(tx0 + tw, rect_size.x)
			var y1 := minf(ty0 + th, rect_size.y)
			if x1 <= x0 or y1 <= y0:
				continue
			var dst := Rect2(x0, y0, x1 - x0, y1 - y0)
			var src := Rect2(0, 0, dst.size.x / image_scale.x, dst.size.y / image_scale.y)
			draw_texture_rect_region(texture, dst, src)
