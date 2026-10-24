extends Node2D
## C3 Spritefont2 equivalent.
## Renders text using a character grid in a sprite sheet, replicating C3's
## layout: chars are laid out in a grid of charWidth x charHeight cells,
## indexed by position in the charset. Custom per-character display widths
## come from the "spacing data" (kerning overrides).

var text: String = ""
var visible_text: bool = true
var charset: String = ""
var char_width: int = 16
var char_height: int = 16
var char_scale: float = 1.0
var char_spacing: float = 0.0
var line_height: float = 0.0
var horizontal_align: int = 0   # 0 left, 1 center, 2 right
var vertical_align: int = 0     # 0 top, 1 center, 2 bottom
var bbcode_enabled: bool = true
var wrap_mode: int = 0          # 0 word, 1 cjk, 2 character

var _sheet_path: String = ""
var _display_widths: Dictionary = {}   # char -> custom width
var _space_width: int = -1
var _cell_of: Dictionary = {}         # char -> Vector2i cell
var _chars: Array = []                # grapheme list

## Set by the runtime: reference to C3Data node (for texture lookup).
var data: Node = null
var box_size: Vector2 = Vector2.ZERO

func configure(sf_name: String, settings: Dictionary, sheet_path: String) -> void:
	_sheet_path = sheet_path
	char_width = int(settings.get("charWidth", 16))
	char_height = int(settings.get("charHeight", 16))
	charset = settings.get("charset", "")
	_parse_spacing(settings.get("spacingData", ""))
	_build_char_map()

func _parse_spacing(spacing_data: String) -> void:
	_display_widths.clear()
	_space_width = -1
	if spacing_data == "":
		return
	var parsed = JSON.parse_string(spacing_data)
	if not (parsed is Array):
		return
	for entry in parsed:
		if not (entry is Array) or entry.size() != 2:
			continue
		var code = entry[0]
		var affected = entry[1]
		if not (code is int) and not (code is float):
			continue
		if not (affected is String):
			continue
		if int(code) == char_width:
			continue
		for i in affected.length():
			var c: String = affected[i]
			if c == " ":
				_space_width = int(code)
			else:
				_display_widths[c] = int(code)

func _build_char_map() -> void:
	_cell_of.clear()
	_chars.clear()
	for i in charset.length():
		_chars.append(charset[i])
	if data == null:
		return
	var tex = _get_tex()
	if tex == null:
		return
	var cols = int(tex.get_width() / char_width)
	if cols <= 0:
		return
	for i in _chars.size():
		var c = _chars[i]
		if _cell_of.has(c):
			continue
		if i >= cols * int(tex.get_height() / char_height):
			break
		_cell_of[c] = Vector2i(i % cols, i / cols)

func _get_tex() -> Texture2D:
	if data == null:
		return null
	return data.get_texture("res://" + _sheet_path) if not _sheet_path.begins_with("res://") else data.get_texture(_sheet_path)

func get_char_width_for(c: String) -> float:
	if c == " " and _space_width >= 0:
		return float(_space_width) * char_scale
	if _display_widths.has(c):
		return float(_display_widths[c]) * char_scale
	return float(char_width) * char_scale

## Total advance width of a string (no wrapping).
func measure(text_str: String) -> Vector2:
	var w := 0.0
	var count := 0
	for c in text_str:
		w += get_char_width_for(c)
		count += 1
	w += float(count) * char_spacing
	var h := float(char_height) * char_scale + line_height
	return Vector2(w, h)

func set_text(t: String) -> void:
	text = t
	queue_redraw()

func _draw() -> void:
	if not visible_text or text == "":
		return
	var tex = _get_tex()
	if tex == null:
		return
	var chunks := _parse_bbcode(text)
	var lines: Array = []
	for chunk in chunks:
		for l in _wrap_chunk(chunk):
			lines.append(l)
	# total height
	var total_h := 0.0
	for l in lines:
		total_h += l["height"]
	# vertical align
	var y := 0.0
	match vertical_align:
		1: y = max(floor((box_size.y - total_h) / 2.0), 0.0)
		2: y = max(box_size.y - total_h, 0.0)
	for l in lines:
		var line_w: float = l["width"]
		var x := 0.0
		match horizontal_align:
			1: x = floor((box_size.x - line_w) / 2.0)
			2: x = max(box_size.x - line_w, 0.0)
		_draw_line(l, x, y)
		y += l["height"]

func _draw_line(line: Dictionary, ox: float, oy: float) -> void:
	var tex = _get_tex()
	var cur_x := ox
	for frag in line["frags"]:
		var col := Color(frag["color"]) if frag.has("color") else Color(1, 1, 1, 1)
		var off_y: float = float(frag.get("offsetY", 0.0)) if frag.has("offsetY") else 0.0
		for c in frag["chars"]:
			if c == "\n":
				continue
			if _cell_of.has(c):
				var cell: Vector2i = _cell_of[c]
				var src := Rect2(cell.x * char_width, cell.y * char_height, char_width, char_height)
				var dst := Rect2(cur_x, oy + off_y, float(char_width) * char_scale, float(char_height) * char_scale)
				draw_texture_rect_region(tex, dst, src, col)
			cur_x += get_char_width_for(c) + char_spacing

## Minimal BBCode handling: [b][/b] [i][/i] [color=#xxxxxx][/color] [hide][/hide]
func _parse_bbcode(s: String) -> Array:
	var out: Array = []
	if not bbcode_enabled:
		out.append({"chars": _split_chars(s), "color": Color(1, 1, 1, 1), "hide": false})
		return out
	var stack: Array = [{"color": Color(1, 1, 1, 1), "hide": false, "offsetY": 0.0}]
	var buf := ""
	var i := 0
	while i < s.length():
		if s[i] == "[":
			var close := s.find("]", i)
			if close > i:
				var tag := s.substr(i + 1, close - i - 1)
				if tag.begins_with("/"):
					var name := tag.substr(1)
					if stack.size() > 1:
						stack.pop_back()
					i = close + 1
					continue
				elif tag.begins_with("color="):
					var hex := tag.substr(6).trim_prefix("#")
					var col := Color.html("#" + hex) if hex.is_valid_html_color() else Color(1, 1, 1, 1)
					if buf != "":
						out.append({"chars": _split_chars(buf), "color": stack[stack.size() - 1]["color"], "hide": stack[stack.size() - 1]["hide"], "offsetY": stack[stack.size() - 1].get("offsetY", 0.0)})
						buf = ""
					var st = stack[stack.size() - 1].duplicate()
					st["color"] = col
					stack.append(st)
					i = close + 1
					continue
				elif tag == "hide":
					if buf != "":
						out.append({"chars": _split_chars(buf), "color": stack[stack.size() - 1]["color"], "hide": stack[stack.size() - 1]["hide"], "offsetY": stack[stack.size() - 1].get("offsetY", 0.0)})
						buf = ""
					var st2 = stack[stack.size() - 1].duplicate()
					st2["hide"] = true
					stack.append(st2)
					i = close + 1
					continue
				elif tag.begins_with("offsetY="):
					# Vertical offset of the following characters (in pixels).
					if buf != "":
						out.append({"chars": _split_chars(buf), "color": stack[stack.size() - 1]["color"], "hide": stack[stack.size() - 1]["hide"], "offsetY": stack[stack.size() - 1].get("offsetY", 0.0)})
						buf = ""
					var so = stack[stack.size() - 1].duplicate()
					so["offsetY"] = float(tag.substr(8).to_float())
					stack.append(so)
					i = close + 1
					continue
				elif tag == "b" or tag == "i" or tag == "u" or tag == "s":
					i = close + 1
					continue
			buf += s[i]
			i += 1
		else:
			buf += s[i]
			i += 1
	if buf != "":
		out.append({"chars": _split_chars(buf), "color": stack[stack.size() - 1]["color"], "hide": stack[stack.size() - 1]["hide"], "offsetY": stack[stack.size() - 1].get("offsetY", 0.0)})
	return out

func _split_chars(s: String) -> Array:
	var arr: Array = []
	for i in s.length():
		arr.append(s[i])
	return arr

## Split a styled chunk into wrapped lines.
func _wrap_chunk(chunk: Dictionary) -> Array:
	var chars: Array = chunk["chars"]
	var lines: Array = []
	var cur: Array = []
	var cur_w := 0.0
	var space_w := get_char_width_for(" ") + char_spacing
	var limit := box_size.x if box_size.x > 0 else INF
	var i := 0
	while i < chars.size():
		var c = chars[i]
		if c == "\n":
			lines.append({"frags": [{"chars": cur.duplicate(), "color": chunk["color"]}], "width": cur_w,
				"height": float(char_height) * char_scale + line_height})
			cur.clear(); cur_w = 0.0; i += 1; continue
		var w := get_char_width_for(c) + char_spacing
		if cur_w + w > limit and cur.size() > 0:
			# wrap: break at last space if word mode
			if wrap_mode == 0:
				var br := -1
				for k in range(cur.size() - 1, -1, -1):
					if cur[k] == " ":
						br = k
						break
				if br >= 0:
					var head := cur.slice(0, br)
					var tail := cur.slice(br + 1)
					lines.append({"frags": [{"chars": head, "color": chunk["color"]}], "width": cur_w,
						"height": float(char_height) * char_scale + line_height})
					cur = tail
					cur_w = 0.0
					for t in tail:
						cur_w += get_char_width_for(t) + char_spacing
					i += 1
					continue
			lines.append({"frags": [{"chars": cur.duplicate(), "color": chunk["color"]}], "width": cur_w,
				"height": float(char_height) * char_scale + line_height})
			cur.clear(); cur_w = 0.0
		cur.append(c)
		cur_w += w
		i += 1
	if cur.size() > 0 or lines.is_empty():
		lines.append({"frags": [{"chars": cur.duplicate(), "color": chunk["color"]}], "width": cur_w,
			"height": float(char_height) * char_scale + line_height})
	return lines
