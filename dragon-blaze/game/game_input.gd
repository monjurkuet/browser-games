extends Node2D
## Input handling: detects touches on the spin button (BTN_Iniciar) and
## starts the round, mirroring HandlePointerDown() from main.js.

var runtime: Node = null
var slot: Node = null
var flow: Node = null

func setup(rt: Node, s: Node, f: Node) -> void:
	runtime = rt
	slot = s
	flow = f

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		_handle_pointer(event.position)
	elif event is InputEventScreenTouch and event.pressed:
		_handle_pointer(event.position)

func _handle_pointer(screen_pos: Vector2) -> void:
	if not pointer_is_on_spin_button(screen_pos):
		return
	if slot.processing or slot.button_click_waiting:
		return
	if slot.get_global_number("IsProcessing", 0) == 1:
		return
	start_round_after_button_click()

## Tests a screen position against the spin button's rectangle.
## The button's global position is already in screen space (the layout root
## carries the display scale).
func pointer_is_on_spin_button(screen_pos: Vector2) -> bool:
	var layout = runtime.current_layout
	if layout == null:
		return false
	var buttons: Array = runtime.instances_of("BTN_Iniciar")
	if buttons.is_empty():
		return false
	var view_scale: float = runtime.display_scale
	if view_scale <= 0.0:
		return false
	for btn in buttons:
		var layer_scale := 1.0
		var li = layout.layers.get(btn.layer_name, null)
		if li != null:
			layer_scale = float(li.get("scale", 1.0))
		var half_w: float = btn.world_w * 0.5 * layer_scale * view_scale
		var half_h: float = btn.world_h * 0.5 * layer_scale * view_scale
		var centre: Vector2 = btn.global_position
		if abs(screen_pos.x - centre.x) <= half_w and abs(screen_pos.y - centre.y) <= half_h:
			return true
	return false

## Waits for the button's click animation, then starts the round.
func start_round_after_button_click() -> void:
	if slot.processing or slot.button_click_waiting:
		return
	slot.button_click_waiting = true
	await _wait_button_click_tween_finished()
	slot.button_click_waiting = false
	if slot.processing:
		return
	await flow.spin_board()

## Mirrors WaitButtonClickTweenFinished(): waits for the "Click" tween to
## start and finish, with a timed fallback.
func _wait_button_click_tween_finished() -> void:
	var elapsed := 0.0
	var saw_click_tween := false
	var tween_api_available := false
	while elapsed < 2.0:
		var dt := get_process_delta_time()
		elapsed += dt
		var playing = _is_button_click_tween_playing()
		if playing != null:
			tween_api_available = true
			if playing:
				saw_click_tween = true
			elif saw_click_tween:
				return
		if not tween_api_available and elapsed >= 0.42:
			return
		if tween_api_available and not saw_click_tween and elapsed >= 0.5 and elapsed >= 0.42:
			return
		await get_tree().process_frame

## Returns true/false when the tween API is available, null otherwise.
func _is_button_click_tween_playing() -> Variant:
	var buttons: Array = runtime.instances_of("BTN_Iniciar")
	if buttons.is_empty():
		return null
	for btn in buttons:
		var tween = runtime.get_tween_state(btn, "Click")
		if tween == null:
			continue
		return tween
	return false
