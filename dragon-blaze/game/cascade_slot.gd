extends Node
## Cascade slot game logic - GDScript port of scripts/project/main.js.
##
## The port keeps the same structure, constants and timings as the original
## JavaScript so the game behaves identically.

var runtime: Node = null
var data: Node = null
var _rng := RandomNumberGenerator.new()

# --------------------------------------------------------------- constants
const FRAME_COUNT := 11
const PRIZE_FRAME_MAX := 6
const MULTIPLIER_FRAME := 7
const DRAGON_FRAME := 8
const BLITZ_FRAME := 9
const BONUS_FRAME := 10

const EXIT_TIME := 0.40
const EXIT_DELAY := 0.055
const ENTER_TIME := 0.46
const CASCADE_TIME := 0.34
const WIN_SCALE_TIME := 0.22
const SPAWN_DELAY := 0.055
const CASCADE_DELAY := 0.045
const WINNER_UI_ANIMATION_TIME := 1.60
const WINNER_CARDS_LOW_ANIMATION_TIME := 0.70
const WINNER_CARDS_HIGH_ANIMATION_TIME := 1.55
const MULTIPLIER_INITIAL_ANIMATION_TIME := 1.10
const MULTIPLIER_INCREMENT_ANIMATION_TIME := 1.00
const MULTIPLIER_APPLY_ANIMATION_TIME := 3.40
const DRAGON_ANIMATION_TIME := 0.55
const MAX_DRAGON_EXTRA_ROUNDS := 5
const MAX_RESOLVE_LOOPS := 30
const BUTTON_OBJECT_NAME := "BTN_Iniciar"
const BUTTON_CLICK_TWEEN_TAG := "Click"
const BUTTON_CLICK_ANIMATION_TIME := 0.42
const BUTTON_CLICK_TWEEN_FINISH_TIMEOUT := 2.0

const SPECIAL_CASCADE_TRIGGER_COUNT := 2
const SPECIAL_CASCADE_EXTRA_FRAME_COUNT := 50
const SPECIAL_CASCADE_EXTRA_FRAME_MIN := 1
const SPECIAL_CASCADE_EXTRA_FRAME_MAX := 6
const BONUS_SPECIAL_LOCK_COUNT := 3

const MULTIPLIER_SPAWN_CHANCE := 0.02
const DRAGON_SPAWN_CHANCE := 0.02
const BLITZ_SPAWN_CHANCE := 0.04
const BONUS_SPAWN_CHANCE := 0.04
const DEFAULT_RANDOM_DIFFICULTY := 1

## Paytable: row = item frame, column = connected quantity.
const PAY_TABLE := {
	0: {3: 0.1, 4: 0.4, 5: 1.0, 6: 1.5, 7: 2.2, 8: 3.5, 9: 4.0, 10: 5.0, 11: 6.0, 12: 10},
	1: {3: 0.2, 4: 0.8, 5: 1.5, 6: 2.0, 7: 3.2, 8: 4.5, 9: 5.0, 10: 6.0, 11: 7.0, 12: 20},
	2: {3: 0.3, 4: 1.0, 5: 2.0, 6: 3.0, 7: 4.2, 8: 5.5, 9: 6.0, 10: 7.0, 11: 8.0, 12: 30},
	3: {3: 0.5, 4: 1.5, 5: 2.5, 6: 4.0, 7: 5.2, 8: 6.5, 9: 7.0, 10: 8.0, 11: 10, 12: 40},
	4: {3: 1.0, 4: 2.0, 5: 3.0, 6: 5.0, 7: 10, 8: 15, 9: 20, 10: 30, 11: 40, 12: 50},
	5: {3: 1.5, 4: 3.0, 5: 5.0, 6: 10, 7: 15, 8: 20, 9: 30, 10: 40, 11: 50, 12: 100},
	6: {3: 2.0, 4: 5.0, 5: 10, 6: 15, 7: 20, 8: 30, 9: 40, 10: 50, 11: 100, 12: 200},
}

## Instance variable slots of OBJ_Cards.
## The exported instance-variable array is 0-based, while the variable
## definitions use indices 8..18; the definitions' index minus 8 gives the
## position in the instance array.
const CARD_VARS := ["type", "gridX", "gridY", "animate", "animateMultiplicador", "frameDragon", "FrameBlitz", "FrameBonus", "Soundeffect", "ativado", "Creted_egg"]
const CARD_VAR_BASE := 8

# ------------------------------------------------------------- game state
var start_x := 0.0
var start_y := 0.0
var cell_w := 0.0
var cell_h := 0.0
var rows := 0
var columns := 0
var column_x: Array = []   # exact layout x of every column
var row_y: Array = []      # exact layout y of every row
var processing := false
var layer_name := "BG_Base"
var animation_name := "Animation 1"
var processing_locked := false
var button_click_waiting := false
var last_money_text := ""
var last_winnings_text := ""
var result_queue: Array = []
var using_server_result := false
var multiplier_initial_played_this_round := false
var dragon_free_round_active := false
var pending_bonus_special_frame = null
var waiting_for_special_layout_return := false
var special_layout_was_visited := false

func setup(rt: Node, d: Node) -> void:
	runtime = rt
	data = d
	_rng.randomize()

# ---------------------------------------------------------------- utilities
func get_global_number(name: String, fallback: float = 0.0) -> float:
	return runtime.get_global_number(name, fallback)

func set_global_number(name: String, value: float) -> void:
	runtime.set_global(name, value)

func get_global_string(name: String, fallback: String = "") -> String:
	return runtime.get_global_string(name, fallback)

func set_global_string(name: String, value: String) -> void:
	runtime.set_global(name, value)

static func round2(v: float) -> float:
	return round(v * 100.0) / 100.0

static func clamp_int(v: int, lo: int, hi: int) -> int:
	return max(lo, min(hi, v))

func wait_seconds(seconds: float) -> void:
	if seconds <= 0.0:
		return
	await get_tree().create_timer(seconds).timeout

func grid_to_x(grid_x: int) -> float:
	# Use the exact layout positions of the columns; the spacing is not
	# always uniform (the last column can be 1 px off).
	if grid_x >= 0 and grid_x < column_x.size():
		return column_x[grid_x]
	return start_x + grid_x * cell_w

func grid_to_y(grid_y: int) -> float:
	if grid_y >= 0 and grid_y < row_y.size():
		return row_y[grid_y]
	return start_y + grid_y * cell_h

# ------------------------------------------------------------------- cards
func get_cards() -> Array:
	return runtime.instances_of("OBJ_Cards")

func card_var(card: Node, name: String, fallback: Variant = 0) -> Variant:
	var idx := CARD_VARS.find(name)
	if idx < 0:
		return fallback
	# The instance variable array is 0-based.
	return card.get_inst_var(idx, fallback)

func set_card_var(card: Node, name: String, value: Variant) -> void:
	var idx := CARD_VARS.find(name)
	if idx >= 0:
		card.set_inst_var(idx, value)

func card_type(card: Node) -> int:
	return int(card_var(card, "type", card.current_frame))

# ------------------------------------------------------------- grid set-up
func initialise_grid() -> void:
	var cards := get_cards()
	if cards.is_empty():
		return
	var xs: Array = []
	var ys: Array = []
	for c in cards:
		if not xs.has(c.world_x):
			xs.append(c.world_x)
		if not ys.has(c.world_y):
			ys.append(c.world_y)
	xs.sort()
	ys.sort()
	start_x = xs[0]
	start_y = ys[0]
	cell_w = (xs[1] - xs[0]) if xs.size() > 1 else cards[0].world_w
	cell_h = (ys[1] - ys[0]) if ys.size() > 1 else cards[0].world_h
	columns = xs.size()
	rows = ys.size()
	column_x = xs.duplicate()
	row_y = ys.duplicate()
	layer_name = cards[0].layer_name
	for card in cards:
		var gx := _closest_index(xs, card.world_x)
		var gy := _closest_index(ys, card.world_y)
		set_card_var(card, "gridX", gx)
		set_card_var(card, "gridY", gy)
		# The C3 game fills the board with the prize frames of the "Array"
		# plugin when the layout starts, so the initial cards show a random
		# mix of symbols instead of the layout's default frame.
		var frame := _random_prize_frame_with_difficulty(gx, gy, DEFAULT_RANDOM_DIFFICULTY)
		set_card_var(card, "type", frame)
		# The card faces live in "Animation 1"; "Default" only holds the back.
		card.set_animation("Animation 1", false)
		card.set_frame(frame)
		update_card_special_flags(card)
	enforce_single_special_cards()

func _closest_index(sorted: Array, v: float) -> int:
	var best := 0
	var best_d := INF
	for i in sorted.size():
		var d: float = abs(float(sorted[i]) - v)
		if d < best_d:
			best_d = d
			best = i
	return best

## Builds the grid[row][col] lookup from the current card positions.
func build_grid() -> Array:
	var grid: Array = []
	for r in rows:
		var row: Array = []
		row.resize(columns)
		grid.append(row)
	for card in get_cards():
		if not is_instance_valid(card):
			continue
		var col := int(round(float(card_var(card, "gridX", 0))))
		var row := int(round(float(card_var(card, "gridY", 0))))
		if row >= 0 and row < rows and col >= 0 and col < columns:
			grid[row][col] = card
	return grid

func snap_all_cards_to_grid() -> void:
	for card in get_cards():
		if not is_instance_valid(card):
			continue
		var col := int(round(float(card_var(card, "gridX", 0))))
		var row := int(round(float(card_var(card, "gridY", 0))))
		set_card_var(card, "gridX", col)
		set_card_var(card, "gridY", row)
		set_card_var(card, "type", card.current_frame)
		update_card_special_flags(card)
		card.set_position_xy(grid_to_x(col), grid_to_y(row))

# ------------------------------------------------------------------- money
func ensure_game_money_variables() -> void:
	if runtime.get_global("Balance", null) == null:
		set_global_number("Balance", 100)
	if runtime.get_global("BetAmount", null) == null:
		set_global_number("BetAmount", 0.1)
	if runtime.get_global("TotalWinnings", null) == null:
		set_global_number("TotalWinnings", 0)
	if runtime.get_global("RoundWin", null) == null:
		set_global_number("RoundWin", 0)

func get_money() -> float:
	return get_global_number("Balance", 0)

func set_money(v: float) -> void:
	set_global_number("Balance", v)

## Formats a number with exactly two decimals and a thousands separator:
## 71050 -> 71,050.00 | 0.1 -> 0.10 | 2.5 -> 2.50
func format_money(value: float) -> String:
	var fixed := "%.2f" % value
	var parts := fixed.split(".")
	var whole := parts[0]
	var out := ""
	var count := 0
	for i in range(whole.length() - 1, -1, -1):
		out = whole[i] + out
		count += 1
		if count % 3 == 0 and i > 0:
			out = "," + out
	return out + "." + parts[1]

## The winnings text stays empty while TotalWinnings is zero.
func format_winnings_text() -> String:
	var v := get_global_number("TotalWinnings", 0)
	return "$" + format_money(v) if v > 0 else ""

func update_money_texts() -> void:
	var money_text := "$" + format_money(get_money())
	var winnings_text := format_winnings_text()
	if money_text != last_money_text:
		last_money_text = money_text
		set_object_text("SF_Money", money_text)
	if winnings_text != last_winnings_text:
		last_winnings_text = winnings_text
		set_object_text("SF_Winnings", winnings_text)

func set_object_text(type_name: String, text: String) -> void:
	var inst = runtime.first_instance(type_name)
	if inst == null:
		return
	if inst.extra_state.size() > 0:
		inst.extra_state[0] = text
	if inst.has_method("set_text"):
		inst.set_text(text)

# ------------------------------------------------------------- special flags
func update_card_special_flags(card: Node) -> void:
	var t := card_type(card)
	set_card_var(card, "frameDragon", 1 if t == DRAGON_FRAME else 0)
	set_card_var(card, "FrameBlitz", 1 if t == BLITZ_FRAME else 0)
	set_card_var(card, "FrameBonus", 1 if t == BONUS_FRAME else 0)

func update_all_card_special_flags() -> void:
	for card in get_cards():
		if is_instance_valid(card):
			update_card_special_flags(card)

func get_multiplier_card() -> Node:
	for card in get_cards():
		if not is_instance_valid(card):
			continue
		if card_type(card) == MULTIPLIER_FRAME:
			return card
	return null

func get_dragon_card() -> Node:
	for card in get_cards():
		if not is_instance_valid(card):
			continue
		if card_type(card) == DRAGON_FRAME:
			return card
	return null

func count_cards_by_type(type: int) -> int:
	var n := 0
	for card in get_cards():
		if is_instance_valid(card) and card_type(card) == type:
			n += 1
	return n

func replace_card_frame(card: Node, frame: int) -> void:
	if card == null or not is_instance_valid(card):
		return
	set_card_var(card, "type", frame)
	card.set_frame(frame)
	update_card_special_flags(card)

func enforce_single_special_cards() -> void:
	if is_server_result_active():
		return
	var found_multiplier := false
	var found_dragon := false
	for card in get_cards():
		if not is_instance_valid(card):
			continue
		var t := card_type(card)
		if t == MULTIPLIER_FRAME:
			if found_multiplier:
				replace_card_frame(card, _rng.randi_range(0, 2))
			else:
				found_multiplier = true
		elif t == DRAGON_FRAME:
			if found_dragon:
				replace_card_frame(card, _rng.randi_range(0, 2))
			else:
				found_dragon = true

# ------------------------------------------------------- server result mode
func is_server_result_active() -> bool:
	return get_global_number("ControlledResultEnabled", 0) == 1

func load_result_queue_from_global() -> void:
	result_queue.clear()
	var raw := get_global_string("GameResult", "")
	for part in raw.split(",", false):
		var s := str(part).strip_edges()
		if s.is_valid_int():
			result_queue.append(clamp_int(int(s), 0, FRAME_COUNT - 1))

# ---------------------------------------------------------- random drawing
func get_next_frame(grid_x: int = -1, grid_y: int = -1) -> int:
	if not is_server_result_active():
		return _random_frame(grid_x, grid_y)
	if result_queue.is_empty():
		load_result_queue_from_global()
	if not result_queue.is_empty():
		var frame: int = result_queue.pop_front()
		set_global_string("GameResult", ", ".join(result_queue.map(func(x): return str(x))))
		return clamp_int(frame, 0, FRAME_COUNT - 1)
	# The controlled result ran out: the round is cancelled and refunded.
	push_warning("GameResult ended before the round was complete.")
	return -1

func _random_frame(grid_x: int = -1, grid_y: int = -1) -> int:
	var difficulty := clamp_int(int(get_global_number("RandomDifficulty", DEFAULT_RANDOM_DIFFICULTY)), 0, 3)
	var special := _try_random_special_frame(difficulty)
	if special >= 0:
		return special
	return _random_prize_frame_with_difficulty(grid_x, grid_y, difficulty)

func _try_random_special_frame(difficulty: int) -> int:
	var has_multiplier := get_multiplier_card() != null
	var has_dragon := get_dragon_card() != null
	var special_scale: float = [1.15, 1.0, 0.70, 0.45][difficulty]
	var r := _rng.randf()
	var cursor := 0.0
	if not has_multiplier and (not has_dragon or dragon_free_round_active):
		cursor += MULTIPLIER_SPAWN_CHANCE * special_scale
		if r < cursor:
			return MULTIPLIER_FRAME
	if not has_dragon and not has_multiplier:
		cursor += DRAGON_SPAWN_CHANCE * special_scale
		if r < cursor:
			return DRAGON_FRAME
	cursor += BLITZ_SPAWN_CHANCE * special_scale
	if r < cursor:
		return BLITZ_FRAME
	cursor += BONUS_SPAWN_CHANCE * special_scale
	if r < cursor:
		return BONUS_FRAME
	return -1

func _random_prize_frame_with_difficulty(grid_x: int, grid_y: int, difficulty: int) -> int:
	var weights: Array = [10, 10, 10, 8, 7, 6, 5]
	var avoid_prize_chance: float = [0.55, 0.75, 0.90, 0.98][difficulty]
	var fallback := 0
	for attempt in 14:
		var frame := _weighted_pick(weights)
		if attempt == 0:
			fallback = frame
		if not _would_create_immediate_prize(grid_x, grid_y, frame):
			return frame
		if _rng.randf() > avoid_prize_chance:
			return frame
	return fallback

func _would_create_immediate_prize(grid_x: int, grid_y: int, frame: int) -> bool:
	if grid_x < 0 or grid_y < 0:
		return false
	if grid_y >= rows or grid_x >= columns:
		return false
	var grid := build_grid()
	var visited := {}
	var stack: Array = [[grid_y, grid_x, true]]
	var count := 0
	while not stack.is_empty():
		var cur: Array = stack.pop_back()
		var key := "%d:%d" % [cur[0], cur[1]]
		if visited.has(key):
			continue
		visited[key] = true
		if not cur[2]:
			var c = grid[cur[0]][cur[1]]
			if c == null or int(round(float(card_var(c, "type", 0)))) != frame:
				continue
		count += 1
		if count >= 3:
			return true
		for n in [[cur[0], cur[1] - 1], [cur[0], cur[1] + 1], [cur[0] - 1, cur[1]], [cur[0] + 1, cur[1]]]:
			if n[0] < 0 or n[0] >= rows or n[1] < 0 or n[1] >= columns:
				continue
			var nkey := "%d:%d" % [n[0], n[1]]
			if visited.has(nkey):
				continue
			var next = grid[n[0]][n[1]]
			if next == null or int(round(float(card_var(next, "type", 0)))) != frame:
				continue
			stack.append([n[0], n[1], false])
	return false

func _weighted_pick(weights: Array) -> int:
	var total := 0.0
	for w in weights:
		total += max(0.0, float(w))
	if total <= 0.0:
		return _rng.randi_range(0, PRIZE_FRAME_MAX)
	var r := _rng.randf() * total
	for i in weights.size():
		r -= max(0.0, float(weights[i]))
		if r <= 0.0:
			return i
	return weights.size() - 1

# ------------------------------------------------------------- winning groups
func find_winning_groups() -> Array:
	var grid := build_grid()
	var visited := {}
	var groups: Array = []
	for row in rows:
		for col in columns:
			var start = grid[row][col]
			if start == null:
				continue
			var key := "%d:%d" % [row, col]
			if visited.has(key):
				continue
			var type := card_type(start)
			# Special frames 7..10 are not part of the normal paytable.
			if type > PRIZE_FRAME_MAX:
				continue
			var group: Array = []
			var stack: Array = [[row, col]]
			visited[key] = true
			while not stack.is_empty():
				var cur: Array = stack.pop_back()
				var card = grid[cur[0]][cur[1]]
				if card == null or card_type(card) != type:
					continue
				group.append(card)
				for n in [[cur[0], cur[1] - 1], [cur[0], cur[1] + 1], [cur[0] - 1, cur[1]], [cur[0] + 1, cur[1]]]:
					if n[0] < 0 or n[0] >= rows or n[1] < 0 or n[1] >= columns:
						continue
					var nkey := "%d:%d" % [n[0], n[1]]
					if visited.has(nkey):
						continue
					var next = grid[n[0]][n[1]]
					if next == null or card_type(next) != type:
						continue
					visited[nkey] = true
					stack.append(n)
			if group.size() >= 3:
				groups.append({"type": type, "cards": _sort_group_cards(group)})
	return _sort_winning_groups(groups)

func _sort_winning_groups(groups: Array) -> Array:
	groups.sort_custom(func(a, b):
		if a["type"] != b["type"]:
			return a["type"] < b["type"]
		var af = a["cards"][0]
		var bf = b["cards"][0]
		if af == null or bf == null:
			return false
		var ay := int(card_var(af, "gridY", 0))
		var by := int(card_var(bf, "gridY", 0))
		if ay != by:
			return ay < by
		return int(card_var(af, "gridX", 0)) < int(card_var(bf, "gridX", 0)))
	return groups

func _sort_group_cards(cards: Array) -> Array:
	cards.sort_custom(func(a, b):
		var ay := int(card_var(a, "gridY", 0))
		var by := int(card_var(b, "gridY", 0))
		if ay != by:
			return ay < by
		return int(card_var(a, "gridX", 0)) < int(card_var(b, "gridX", 0)))
	return cards

func get_multiplier(item_type: int, amount: int) -> float:
	if amount < 3:
		return 0.0
	var row: Dictionary = PAY_TABLE.get(item_type, PAY_TABLE[0])
	var key := 12 if amount >= 12 else amount
	return float(row.get(key, 0))
