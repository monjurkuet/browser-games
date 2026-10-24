extends Node
## C3 data loader: parses game_data.json and exposes object types, layouts,
## event sheets, globals and spritefont settings.

const DATA_PATH := "res://game_data.json"

var object_types: Array = []
var object_type_by_name: Dictionary = {}
var layouts: Array = []
var layout_by_name: Dictionary = {}
var event_sheets: Array = []
var sheet_by_name: Dictionary = {}
var sounds: Array = []
var sf_settings: Dictionary = {}
var exprs_gd: Dictionary = {}
var arrays: Dictionary = {}    # array object name -> element values (C3 Array plugin)
var project_name := ""
var first_layout := ""
var viewport_size := Vector2i(1280, 720)
var framerate := 30

var _textures: Dictionary = {}   # path -> Texture2D
var _atlas_cache: Dictionary = {} # "path|rect" -> AtlasTexture
var _rot_cache: Dictionary = {}   # "path|rect" -> ImageTexture (90-deg rotated)

func _ready() -> void:
	load_data()

func load_data() -> void:
	var f := FileAccess.open(DATA_PATH, FileAccess.READ)
	if f == null:
		push_error("Cannot open " + DATA_PATH)
		return
	var parsed = JSON.parse_string(f.get_as_text())
	f.close()
	project_name = parsed.get("projectName", "")
	first_layout = parsed.get("firstLayout", "")
	var vp = parsed.get("viewport", {})
	viewport_size = Vector2i(vp.get("w", 1280), vp.get("h", 720))
	framerate = parsed.get("framerate", [null, 30])[1] if parsed.get("framerate", []).size() > 1 else 30
	object_types = parsed.get("objectTypes", [])
	for t in object_types:
		object_type_by_name[t["name"]] = t
	layouts = parsed.get("layouts", [])
	for l in layouts:
		layout_by_name[l["name"]] = l
	event_sheets = parsed.get("eventSheets", [])
	for s in event_sheets:
		sheet_by_name[s["name"]] = s
	sounds = parsed.get("sounds", [])
	sf_settings = parsed.get("sfSettings", {})
	exprs_gd = parsed.get("exprsGd", {})
	arrays = parsed.get("arrays", {})

func get_type(name: String) -> Dictionary:
	return object_type_by_name.get(name, {})

func get_type_idx(name: String) -> int:
	var t = object_type_by_name.get(name, {})
	return t.get("idx", -1)

func get_layout(name: String) -> Dictionary:
	return layout_by_name.get(name, {})

func get_sheet(name: String) -> Dictionary:
	return sheet_by_name.get(name, {})

## Loads a texture from res://images/... and caches it.
func get_texture(path: String) -> Texture2D:
	if _textures.has(path):
		return _textures[path]
	var tex: Texture2D = null
	if ResourceLoader.exists(path):
		tex = load(path)
	_textures[path] = tex
	return tex

## Creates (or reuses) an AtlasTexture for a frame rectangle inside a sheet.
## C3 may store a frame rotated 90 degrees to pack the atlas better; in that
## case the stored rectangle has swapped width/height and the image must be
## rotated 90 degrees counter-clockwise to be displayed upright.
func get_atlas(sheet_path: String, r: Rect2i, rotated: bool = false) -> Texture2D:
	var key := "%s|%d,%d,%d,%d|%s" % [sheet_path, r.position.x, r.position.y, r.size.x, r.size.y, str(rotated)]
	if _atlas_cache.has(key):
		return _atlas_cache[key]
	var tex = get_texture(sheet_path)
	if tex == null:
		return null
	var result: Texture2D = null
	if rotated:
		# The caller passes the atlas rect, which for rotated frames has
		# swapped width/height compared to the logical image.
		var src := Rect2i(r.position.x, r.position.y, r.size.x, r.size.y)
		var img := tex.get_image()
		if img == null:
			return null
		img = img.duplicate()
		var region := img.get_region(src)
		# C3 rotates the texture quad anticlockwise for rotated frames
		# (Quad2D.rotatePointsAnticlockwise); direction 1 is CCW.
		region.rotate_90(1)
		result = ImageTexture.create_from_image(region)
	else:
		var at := AtlasTexture.new()
		at.atlas = tex
		at.region = Rect2(r.position, r.size)
		at.filter_clip = true
		result = at
	_atlas_cache[key] = result
	return result
