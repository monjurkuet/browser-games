extends Node
## Round flow and animation helpers for the cascade slot, continuing the
## port of scripts/project/main.js.

const CS = preload("res://game/cascade_slot.gd")

var runtime: Node = null
var slot: Node = null   # CascadeSlot node

func setup(rt: Node, s: Node) -> void:
	runtime = rt
	slot = s

static func clamp_int(v: int, lo: int, hi: int) -> int:
	return max(lo, min(hi, v))

static func round2(v: float) -> float:
	return round(v * 100.0) / 100.0

# ------------------------------------------------------------- animations
## Easing functions matching the original JavaScript.
static func ease_in_cubic(t: float) -> float:
	return t * t * t

static func ease_out_cubic(t: float) -> float:
	var f := t - 1.0
	return f * f * f + 1.0

static func ease_in_back_soft(t: float) -> float:
	const c1 := 1.70158
	const c3 := c1 + 1.0
	return c3 * t * t * t - c1 * t * t

static func ease_out_back_soft(t: float) -> float:
	const c1 := 1.70158
	const c3 := c1 + 1.0
	var f := t - 1.0
	return 1.0 + c3 * f * f * f + c1 * f * f

## Animates a list of items to their target positions.
## Each item is {"inst", "x", "y", "delay", "playStopSound"}.
func animate_many(items: Array, duration: float, easing: Callable) -> void:
	if items.is_empty() or duration <= 0.0:
		for item in items:
			if item["inst"] != null and is_instance_valid(item["inst"]):
				item["inst"].set_position_xy(item["x"], item["y"])
		return
	# Reset the stop-sound trigger before the movement starts.
	for item in items:
		var inst = item["inst"]
		if inst != null and is_instance_valid(inst):
			slot.set_card_var(inst, "Soundeffect", 0)
			inst.set_meta("anim_from_x", inst.world_x)
			inst.set_meta("anim_from_y", inst.world_y)
	var total := duration
	var max_delay := 0.0
	for item in items:
		max_delay = max(max_delay, float(item.get("delay", 0.0)))
	var elapsed := 0.0
	var started: Dictionary = {}
	while elapsed < total + max_delay:
		var dt := get_process_delta_time()
		if dt <= 0.0:
			dt = 1.0 / 60.0
		elapsed += dt
		for item in items:
			var inst = item["inst"]
			if inst == null or not is_instance_valid(inst):
				continue
			var delay := float(item.get("delay", 0.0))
			if elapsed < delay:
				continue
			if not started.has(inst.get_instance_id()):
				started[inst.get_instance_id()] = true
			var t := clampf((elapsed - delay) / max(duration, 0.0001), 0.0, 1.0)
			var e: float = easing.call(t)
			var from_x: float = inst.get_meta("anim_from_x", inst.world_x)
			var from_y: float = inst.get_meta("anim_from_y", inst.world_y)
			inst.set_position_xy(lerpf(from_x, float(item["x"]), e), lerpf(from_y, float(item["y"]), e))
		await get_tree().process_frame
	# Snap to the final positions.
	for item in items:
		var inst = item["inst"]
		if inst != null and is_instance_valid(inst):
			inst.set_position_xy(item["x"], item["y"])

## Animates a list of items scaling down to zero, then destroys them.
func animate_scale_to_zero(items: Array, duration: float, easing: Callable) -> void:
	if items.is_empty() or duration <= 0.0:
		for item in items:
			if item != null and is_instance_valid(item):
				item.set_scale_factor(0.0)
		return
	var elapsed := 0.0
	while elapsed < duration:
		var dt := get_process_delta_time()
		elapsed += dt
		var t := clampf(elapsed / duration, 0.0, 1.0)
		var e: float = easing.call(t)
		for item in items:
			if item != null and is_instance_valid(item):
				item.set_scale_factor(1.0 - e)
		await get_tree().process_frame
	for item in items:
		if item != null and is_instance_valid(item):
			item.set_scale_factor(0.0)

## Creates a card instance at the given position.
func create_card(layer: String, x: float, y: float, width: float, height: float,
		grid_x: int, grid_y: int, frame: int) -> Node:
	var type_data: Dictionary = runtime.data.get_type("OBJ_Cards")
	if type_data.is_empty():
		push_error("OBJ_Cards type not found")
		return null
	var inst = runtime.spawn_instance(type_data, layer)
	if inst == null:
		push_error("Failed to create card on layer " + layer)
		return null
	inst.set_position_xy(x, y)
	inst.set_size(width, height)
	slot.set_card_var(inst, "gridX", grid_x)
	slot.set_card_var(inst, "gridY", grid_y)
	slot.set_card_var(inst, "type", frame)
	slot.set_card_var(inst, "animate", 0)
	slot.set_card_var(inst, "animateMultiplicador", 0)
	slot.set_card_var(inst, "frameDragon", 0)
	slot.set_card_var(inst, "FrameBlitz", 0)
	slot.set_card_var(inst, "FrameBonus", 0)
	slot.set_card_var(inst, "Soundeffect", 0)
	inst.set_animation("Animation 1")
	inst.set_frame(frame)
	inst.anim_playing = false
	slot.update_card_special_flags(inst)
	inst.move_to_top()
	return inst

# --------------------------------------------------------------- exit anim
func build_exit_animations(cards: Array) -> Array:
	var exit_type: int = clamp_int(int(slot.get_global_number("ExitType", 0)), 0, 2)
	var exit_y := get_exit_y()
	var animations: Array = []
	if exit_type == 1:
		for card in cards:
			animations.append({
				"inst": card,
				"x": card.world_x,
				"y": exit_y + int(slot.card_var(card, "gridY", 0)) * slot.cell_h * 0.15,
				"delay": 0.0,
			})
		return animations
	if exit_type == 2:
		var column_delay := CS.EXIT_DELAY * 2.25
		var ordered := cards.duplicate()
		ordered.sort_custom(func(a, b):
			var ax := int(round(float(slot.card_var(a, "gridX", 0))))
			var bx := int(round(float(slot.card_var(b, "gridX", 0))))
			if ax != bx:
				return ax < bx
			return int(slot.card_var(b, "gridY", 0)) < int(slot.card_var(a, "gridY", 0)))
		for card in ordered:
			var col := int(round(float(slot.card_var(card, "gridX", 0))))
			animations.append({
				"inst": card,
				"x": card.world_x,
				"y": exit_y + int(slot.card_var(card, "gridY", 0)) * slot.cell_h * 0.15,
				"delay": col * column_delay,
			})
		return animations
	# ExitType 0: item-by-item staggered exit, bottom row first.
	var exit_ordered := cards.duplicate()
	exit_ordered.sort_custom(func(a, b):
		var ay := int(round(float(slot.card_var(a, "gridY", 0))))
		var by := int(round(float(slot.card_var(b, "gridY", 0))))
		if ay != by:
			return by < ay
		return int(slot.card_var(a, "gridX", 0)) < int(slot.card_var(b, "gridX", 0)))
	var order := 0
	for card in exit_ordered:
		animations.append({
			"inst": card,
			"x": card.world_x,
			"y": exit_y + int(slot.card_var(card, "gridY", 0)) * slot.cell_h * 0.15,
			"delay": order * CS.EXIT_DELAY,
		})
		order += 1
	return animations

func get_exit_y() -> float:
	var layout = runtime.current_layout
	if layout == null:
		return 3000.0
	return float(layout.layout_data.get("height", 2500)) + 200.0

# ------------------------------------------------------------- round flow
## Starts a round: deducts the bet, spins the board, resolves prizes.
func spin_board() -> void:
	if slot.processing:
		return
	slot.ensure_game_money_variables()
	var bet: float = slot.get_global_number("BetAmount", 0.10)
	var money: float = slot.get_money()
	if money < bet:
		slot.set_global_number("IsProcessing", 0)
		slot.button_click_waiting = false
		return
	slot.processing = true
	slot.set_global_number("IsProcessing", 1)
	slot.initialise_grid()
	slot.set_money(CS.round2(money - bet))
	slot.set_global_number("RoundWin", 0)
	slot.set_global_number("TotalWinnings", 0)
	slot.set_global_number("BonusWinnings", 0)
	slot.set_global_number("MultiplierValue", 1)
	slot.set_global_number("AnimateMultiplier", 0)
	slot.set_global_number("DragonBlaze", 0)
	slot.set_global_number("BlitzPremiation", 0)
	slot.set_global_number("BonusGame", 0)
	slot.result_queue.clear()
	slot.using_server_result = slot.is_server_result_active()
	slot.set_global_number("Loading", 1 if slot.using_server_result else 0)
	slot.update_money_texts()
	await run_spin_cycle(0)
	if not slot.waiting_for_special_layout_return:
		slot.processing = false
		slot.set_global_number("IsProcessing", 0)
	slot.update_money_texts()

## One spin: exit the old cards, refill from the top, then resolve prizes.
func run_spin_cycle(dragon_depth: int) -> Dictionary:
	slot.initialise_grid()
	var old_cards: Array = slot.get_cards().duplicate()
	if not old_cards.is_empty():
		var exit_animations := build_exit_animations(old_cards)
		await animate_many(exit_animations, CS.EXIT_TIME, Callable(self, "ease_in_cubic"))
		for card in old_cards:
			if is_instance_valid(card) and runtime.current_layout:
				runtime.current_layout.remove_instance(card)
	slot.dragon_free_round_active = dragon_depth > 0
	if dragon_depth > 0:
		slot.set_global_number("MultiplierValue", 1)
		slot.multiplier_initial_played_this_round = false
	await refill_board_from_top(dragon_depth)
	var special := await handle_initial_special_cards(dragon_depth)
	if special.get("stopForBonus", false):
		return special
	if special.get("startFreeRound", false):
		return await run_spin_cycle(dragon_depth + 1)
	await resolve_all_wins(dragon_depth)
	return {"stopForBonus": false, "startFreeRound": false}

## Fills the board with new cards dropping from above.
func refill_board_from_top(dragon_depth: int) -> void:
	var layer: String = slot.layer_name
	var sample = slot.get_cards()[0] if not slot.get_cards().is_empty() else null
	var width: float = sample.world_w if sample != null else slot.cell_w
	var height: float = sample.world_h if sample != null else slot.cell_h
	var frames_by_row: Array = []
	for r in slot.rows:
		var row: Array = []
		row.resize(slot.columns)
		row.fill(0)
		frames_by_row.append(row)
	# Results are consumed bottom row to top, left to right.
	for row in range(slot.rows - 1, -1, -1):
		for col in slot.columns:
			var frame: int = slot.get_next_frame(col, row)
			if frame < 0:
				frame = 0
			frames_by_row[row][col] = frame
	var order := 0
	var items: Array = []
	for row in range(slot.rows - 1, -1, -1):
		for col in slot.columns:
			var target_x: float = slot.grid_to_x(col)
			var target_y: float = slot.grid_to_y(row)
			var spawn_y: float = slot.start_y - slot.cell_h * (slot.rows + 1 + (slot.rows - 1 - row))
			var frame: int = frames_by_row[row][col]
			var card = create_card(layer, target_x, spawn_y, width, height, col, row, frame)
			items.append({
				"inst": card, "x": target_x, "y": target_y,
				"delay": order * CS.SPAWN_DELAY, "playStopSound": true,
			})
			order += 1
	await animate_many(items, CS.ENTER_TIME, Callable(self, "ease_out_back_soft"))
	slot.snap_all_cards_to_grid()

## Resolves every winning group, paying and clearing each in turn.
func resolve_all_wins(dragon_depth: int) -> void:
	for _loop in CS.MAX_RESOLVE_LOOPS:
		slot.snap_all_cards_to_grid()
		await maybe_play_initial_multiplier_animation()
		var groups: Array = slot.find_winning_groups()
		if groups.is_empty():
			return
		for group in groups:
			await pay_and_animate_winning_group(group)
			await animate_win_and_destroy(group["cards"])
		await cascade_existing_cards_and_refill(dragon_depth)

## Pays a winning group and plays its animations.
func pay_and_animate_winning_group(group: Dictionary) -> void:
	var item_type := clamp_int(int(group["type"]), 0, CS.FRAME_COUNT - 1)
	var amount: int = group["cards"].size()
	var bet: float = slot.get_global_number("BetAmount", 0.10)
	var multiplier: float = slot.get_multiplier(item_type, amount)
	var prize := CS.round2(bet * multiplier)
	slot.set_global_number("RoundWin", prize)
	slot.set_object_text("SF_Winner", "$" + slot.format_money(prize))
	await play_winner_cards_animation(group)
	await play_winner_ui_animation(prize)
	slot.set_global_number("TotalWinnings", CS.round2(slot.get_global_number("TotalWinnings", 0) + prize))
	slot.update_money_texts()

## Marks the winning cards so the Event Sheet can animate them.
func play_winner_cards_animation(group: Dictionary) -> void:
	var item_type := clamp_int(int(group["type"]), 0, CS.FRAME_COUNT - 1)
	var animate_value := 1 if item_type <= 3 else 2
	var wait_time := CS.WINNER_CARDS_LOW_ANIMATION_TIME if animate_value == 1 else CS.WINNER_CARDS_HIGH_ANIMATION_TIME
	for card in slot.get_cards():
		if is_instance_valid(card):
			slot.set_card_var(card, "animate", 0)
	for card in group["cards"]:
		if is_instance_valid(card):
			slot.set_card_var(card, "animate", animate_value)
	slot.set_global_number("WinningCardsAnimation", 1)
	await slot.wait_seconds(wait_time)
	for card in group["cards"]:
		if is_instance_valid(card):
			slot.set_card_var(card, "animate", 0)

## Plays the prize UI animation, driven by the Event Sheet.
func play_winner_ui_animation(prize: float) -> void:
	slot.set_object_text("SF_Winner", "$" + slot.format_money(prize))
	slot.set_global_number("RoundWinAnimation", 1)
	await slot.wait_seconds(CS.WINNER_UI_ANIMATION_TIME)

## Shrinks the winning cards to zero and destroys them.
func animate_win_and_destroy(winners: Array) -> void:
	await animate_scale_to_zero(winners, CS.WIN_SCALE_TIME, Callable(self, "ease_in_back_soft"))
	for card in winners:
		if is_instance_valid(card) and runtime.current_layout:
			runtime.current_layout.remove_instance(card)

## Moves the remaining cards down and refills the empty cells.
func cascade_existing_cards_and_refill(dragon_depth: int) -> void:
	var sample = slot.get_cards()[0] if not slot.get_cards().is_empty() else null
	var width: float = sample.world_w if sample != null else slot.cell_w
	var height: float = sample.world_h if sample != null else slot.cell_h
	var layer: String = slot.layer_name
	var animations: Array = []
	var order := 0
	for col in slot.columns:
		var column_cards: Array = []
		for card in slot.get_cards():
			if is_instance_valid(card) and int(round(float(slot.card_var(card, "gridX", 0)))) == col:
				column_cards.append(card)
		column_cards.sort_custom(func(a, b):
			return int(slot.card_var(b, "gridY", 0)) < int(slot.card_var(a, "gridY", 0)))
		var target_row: int = slot.rows - 1
		for card in column_cards:
			set_card_var_safe(card, "gridY", target_row)
			set_card_var_safe(card, "gridX", col)
			animations.append({
				"inst": card,
				"x": slot.grid_to_x(col),
				"y": slot.grid_to_y(target_row),
				"delay": order * CS.CASCADE_DELAY,
				"playStopSound": false,
			})
			order += 1
			target_row -= 1
		for row in range(target_row, -1, -1):
			var frame: int = slot.get_next_frame(col, row)
			if frame < 0:
				frame = 0
			var target_x: float = slot.grid_to_x(col)
			var target_y: float = slot.grid_to_y(row)
			var spawn_y: float = slot.start_y - slot.cell_h * (target_row - row + 1.25)
			var card = create_card(layer, target_x, spawn_y, width, height, col, row, frame)
			animations.append({
				"inst": card, "x": target_x, "y": target_y,
				"delay": order * CS.CASCADE_DELAY, "playStopSound": true,
			})
			order += 1
	await animate_many(animations, CS.CASCADE_TIME, Callable(self, "ease_out_back_soft"))
	slot.snap_all_cards_to_grid()

func set_card_var_safe(card: Node, name: String, value: Variant) -> void:
	if card != null and is_instance_valid(card):
		slot.set_card_var(card, name, value)

## Plays the multiplier's initial animation once per round.
func maybe_play_initial_multiplier_animation() -> void:
	if slot.get_multiplier_card() == null:
		return
	if slot.multiplier_initial_played_this_round:
		return
	slot.multiplier_initial_played_this_round = true
	slot.set_global_number("AnimateMultiplier", 1)
	await slot.wait_seconds(CS.MULTIPLIER_INITIAL_ANIMATION_TIME)

## Handles the special cards that may appear on the first drop.
func handle_initial_special_cards(dragon_depth: int) -> Dictionary:
	slot.snap_all_cards_to_grid()
	if not slot.is_server_result_active():
		slot.enforce_single_special_cards()
	slot.update_all_card_special_flags()
	var has_immediate_normal_win: bool = not slot.find_winning_groups().is_empty()
	var dragon_card = slot.get_dragon_card()
	if dragon_card == null:
		return {"stopForBonus": false, "startFreeRound": false}
	if not slot.is_server_result_active() and should_block_dragon_activation(dragon_depth):
		slot.replace_card_frame(dragon_card, _rng_int(3))
		slot.update_all_card_special_flags()
		return {"stopForBonus": false, "startFreeRound": false}
	if has_immediate_normal_win:
		return {"stopForBonus": false, "startFreeRound": false}
	if dragon_depth >= CS.MAX_DRAGON_EXTRA_ROUNDS:
		slot.replace_card_frame(dragon_card, _rng_int(3))
		slot.update_all_card_special_flags()
		return {"stopForBonus": false, "startFreeRound": false}
	await play_dragon_animation(dragon_card)
	return {"stopForBonus": false, "startFreeRound": true}

func should_block_dragon_activation(dragon_depth: int) -> bool:
	if dragon_depth >= CS.MAX_DRAGON_EXTRA_ROUNDS:
		return true
	if slot.get_multiplier_card() != null:
		return true
	return false

## Plays the Dragon animation, then starts a free round.
func play_dragon_animation(dragon_card: Node) -> void:
	slot.set_card_var(dragon_card, "frameDragon", 1)
	slot.set_global_number("DragonBlaze", 1)
	await slot.wait_seconds(CS.DRAGON_ANIMATION_TIME)
	slot.set_card_var(dragon_card, "frameDragon", 0)

func _rng_int(exclusive_max: int) -> int:
	return randi_range(0, exclusive_max - 1)
