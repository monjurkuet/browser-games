extends Node2D
## C3 "Text" plugin equivalent: renders system-font text with BBCode support.

var text: String = ""
var face_name: String = "Arial"
var pt_size: int = 12
var color: Color = Color(1, 1, 1, 1)
var horizontal_align: int = 0
var vertical_align: int = 0
var wrap_mode: int = 0
var bold: bool = false
var italic: bool = false
var line_height_offset: int = 0
var data: Node = null
var box_size: Vector2 = Vector2.ZERO
var visible_text: bool = true

var _font: Font = null

func _ready() -> void:
	refresh()

func refresh() -> void:
	if _font == null:
		_font = SystemFont.new()
		_font.font_names = PackedStringArray([face_name])
		_font.font_weight = 700 if bold else 400
		_font.antialiasing = TextServer.FONT_ANTIALIASING_GRAY
	queue_redraw()

func set_text(t: String) -> void:
	text = t
	queue_redraw()

func _draw() -> void:
	if text == "" or _font == null:
		return
	var font := _font
	var fs := _px_size()
	var lines := _wrap(_strip_bbcode(text))
	var lh := font.get_height(fs) + line_height_offset
	var total_h := lh * lines.size()
	var y := 0.0
	match vertical_align:
		1: y = max(floor((box_size.y - total_h) / 2.0), 0.0)
		2: y = max(box_size.y - total_h, 0.0)
	for l in lines:
		var w := font.get_string_size(l, HORIZONTAL_ALIGNMENT_LEFT, -1, fs).x
		var x := 0.0
		match horizontal_align:
			1: x = floor((box_size.x - w) / 2.0)
			2: x = max(box_size.x - w, 0.0)
		draw_string(font, Vector2(x, y + font.get_ascent(fs)), l, HORIZONTAL_ALIGNMENT_LEFT, -1, fs, color)
		y += lh

## C3 stores the font size in points; the browser renders 1 pt = 4/3 px.
func _px_size() -> int:
	return int(round(float(pt_size) * 4.0 / 3.0))

## Wraps the text at the instance width, like the C3 Text object.
## wrap_mode: 0 = word wrap, 1 = word + character, 2 = character only.
func _wrap(s: String) -> Array:
	var out: Array = []
	for para in s.split("\n"):
		if box_size.x <= 0.0:
			out.append(para)
			continue
		var line := ""
		for word in para.split(" ", false):
			var cand := word if line == "" else line + " " + word
			if _font.get_string_size(cand, HORIZONTAL_ALIGNMENT_LEFT, -1, _px_size()).x <= box_size.x:
				line = cand
				continue
			if line != "":
				out.append(line)
				line = ""
			# The word alone is still too long: break it by characters.
			var rest := word
			while _font.get_string_size(rest, HORIZONTAL_ALIGNMENT_LEFT, -1, _px_size()).x > box_size.x and rest.length() > 1:
				var cut := rest.length()
				while cut > 1 and _font.get_string_size(rest.substr(0, cut), HORIZONTAL_ALIGNMENT_LEFT, -1, _px_size()).x > box_size.x:
					cut -= 1
				out.append(rest.substr(0, cut))
				rest = rest.substr(cut)
			line = rest
		out.append(line)
	return out

func _strip_bbcode(s: String) -> String:
	var out := ""
	var i := 0
	while i < s.length():
		if s[i] == "[":
			var close := s.find("]", i)
			if close > i:
				var tag := s.substr(i + 1, close - i - 1)
				if tag.begins_with("/") or tag.begins_with("color=") or tag == "hide" or tag == "b" or tag == "i":
					i = close + 1
					continue
		out += s[i]
		i += 1
	return out
