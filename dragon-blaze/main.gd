extends Node2D
## Entry point: boots the C3-like runtime and jumps to the first layout.

var data: Node = null
var runtime: Node = null
var events: Node = null
var slot: Node = null
var flow: Node = null
var input_handler: Node = null

func _ready() -> void:
	data = load("res://c3/c3_data.gd").new()
	data.name = "C3Data"
	add_child(data)
	data.load_data()

	runtime = load("res://c3/c3_runtime.gd").new()
	runtime.name = "C3Runtime"
	add_child(runtime)
	runtime.setup(data)
	# The viewport follows the window, like the Construct 3 canvas.
	var win := get_window()
	var win_size := Vector2(win.size)
	var size_env := OS.get_environment("DB_WINDOW_SIZE")
	if size_env.contains("x"):
		var parts := size_env.split("x")
		win_size = Vector2(float(parts[0]), float(parts[1]))
	runtime.set_window_size(int(win_size.x), int(win_size.y))
	# The LOAD • ORIENTATION event sizes the canvas for the current
	# orientation before the game starts.
	runtime.apply_orientation()

	events = runtime.create_events()

	slot = load("res://game/cascade_slot.gd").new()
	slot.name = "CascadeSlot"
	add_child(slot)
	slot.setup(runtime, data)

	flow = load("res://game/cascade_flow.gd").new()
	flow.name = "CascadeFlow"
	add_child(flow)
	flow.setup(runtime, slot)

	input_handler = load("res://game/game_input.gd").new()
	input_handler.name = "GameInput"
	add_child(input_handler)
	input_handler.setup(runtime, slot, flow)

	_register_sounds()
	GameState.runtime = runtime
	GameState.data = data
	GameState.events = events
	GameState.slot = slot
	GameState.flow = flow

	var start := OS.get_environment("DB_START_LAYOUT")
	if start == "":
		start = data.first_layout if not data.first_layout.is_empty() else "Load Land"
	# The "Loading" layout is the Construct 3 preloader; it cannot be
	# activated at runtime, so the game runs on the load screen.
	if start == "Loading":
		start = "Load Port" if runtime._window_size.x <= runtime._window_size.y else "Load Land"
	if start == "" or data.get_layout(start).is_empty():
		start = "Game Land"
	runtime.go_to_layout(start)
	var sheet := ""
	var es = runtime.current_layout.layout_data.get("eventSheet", null)
	if es != null:
		sheet = str(es)
	if sheet != "":
		events.activate_sheet(sheet)
	# Initialise the grid and the money display, like OnBeforeProjectStart.
	slot.initialise_grid()
	slot.ensure_game_money_variables()
	slot.set_global_number("PrizeChartOpen", 0)
	slot.set_global_number("WinningCardsAnimation", 0)
	slot.set_global_number("RoundWinAnimation", 0)
	slot.set_global_number("AnimateMultiplier", 0)
	slot.set_global_number("MultiplierValue", 1)
	slot.set_global_number("DragonBlaze", 0)
	slot.set_global_number("BlitzPremiation", 0)
	slot.set_global_number("BonusGame", 0)
	slot.update_money_texts()
	# The C3 "GAME INITIALIZATION" event sets the same animation frame on all
	# cards; the game logic then deals the board. Re-deal once the event
	# sheet of the new layout has run, so the cards show a random mix of
	# symbols.
	runtime.layout_changed.connect(_on_layout_changed)

## Re-deals the board after a layout change, once the layout start events
## have run.
func _on_layout_changed(_lname: String) -> void:
	call_deferred("_redeal_initial_board")

func _redeal_initial_board() -> void:
	await get_tree().process_frame
	await get_tree().process_frame
	slot.initialise_grid()

func _register_sounds() -> void:
	for s in data.sounds:
		var sname: String = s.get("name", "")
		# The source files are Opus-in-WebM; converted OGG copies live in
		# media/ogg for Godot's audio importer.
		var p := "res://media/ogg/%s.ogg" % sname
		if ResourceLoader.exists(p):
			runtime.register_sound(sname, p)
			continue
		for f in s.get("formats", []):
			var ext: String = f.get("ext", "")
			var alt := "res://media/%s.%s" % [sname, ext]
			if ResourceLoader.exists(alt):
				runtime.register_sound(sname, alt)
				break
