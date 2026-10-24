// Cascade Slot Mechanics for Construct 3
// ------------------------------------------------------------
// Game flow:
// 1) BTN_Iniciar is touched, waits for the click animation, and starts the round by deducting BetAmount from Balance.
// 2) All symbols leave according to ExitType: 0 staggered, 1 all at once, 2 by column.
// 3) The grid is filled from the top using cascade drops.
// 4) The game checks for connected groups of 3+ identical items.
// 5) For each winning group: calculate the payout, play the prize animation,
// shrink the items to 0 and destroy the group.
// 6) If a multiplier exists, it animates before the check and adds +1x for each prize.
// 7) After all current groups are paid, apply the cascade and refill the grid.
// 8) The check repeats until there are no more prizes.
// 9) At the end, if a multiplier exists, play the final animation and apply the multiplier.

const CascadeSlot = {
	startX: 0,
	startY: 0,
	cellW: 0,
	cellH: 0,
	rows: 0,
	columns: 0,
	processing: false,
	layerName: "BG_Base",
	animationName: "Animation 1",
	frameCount: 11,
	prizeFrameMax: 6,
	multiplierFrame: 7,
	dragonFrame: 8,
	blitzFrame: 9,
	bonusFrame: 10,

	// Visual rule for the FIRST drop: after 2 IDENTICAL special frames appear in previous columns,
	// 2x frame 9 or 2x frame 10 activates the long special queue. Frame 9 + frame 10 does not activate it.
	// The special queue uses 50 extra visual frames from 1..6 before landing on the actual result.
	// This rule does not run on refills/cascades after prizes.
	specialCascadeTriggerCount: 2,
	specialCascadeExtraFrameCount: 50,
	specialCascadeExtraFrameMin: 1,
	specialCascadeExtraFrameMax: 6,

	// First drop: after completing 3x frame 9 OR 3x frame 10, no additional 9/10 can enter the same result.
	// Refill: allows forming 3x frame 9 OR 3x frame 10 even after a normal prize.
	// From the moment 3 identical specials exist, the special mode becomes pending and new 9/10 frames become normal 0..6 frames
	// until all normal prizes are finished. Only then does the game animate and enter the special layout.
	bonusSpecialLockCount: 3,
	pendingBonusSpecialFrame: null,
	waitingForSpecialLayoutReturn: false,
	specialLayoutWasVisited: false,
	resumeAfterSpecialStarted: false,

	// Server result control.
	// When ControlledResultEnabled = 1, each new card uses the next frame from the GameResult queue.
	// After a frame is used, it is removed from the GameResult variable.
	resultQueue: [],
	usingServerResult: false,

	// CONTROLLED-RESULT ERROR TIMINGS:
	// If ControlledResultEnabled = 1 and GameResult remains empty for this amount of time,
	// the game does NOT use a random result. It changes Loading to 2.
	// You can change these two values later if you want to adjust the experience.
	serverResultWaitBeforeLoading2: 10,

	// After Loading becomes 2, wait this additional time, reset the round, and refund the bet.
	serverResultLoading2ResetDelay: 5,

	// Chance to create the multiplier when a new card is drawn.
	// Even with this chance, the script limits the screen to a maximum of 1 multiplier.
	// Increase it to make the multiplier appear more often; decrease it to make it rarer.
	multiplierSpawnChance: 0.02,

	// Chance to create the Dragon/extra-round card.
	// It is also limited to a maximum of 1 Dragon on screen.
	dragonSpawnChance: 0.02,

	// Individual chance to create bonus cards. They may repeat because 3 identical cards activate the bonus.
	blitzSpawnChance: 0.04,
	bonusSpawnChance: 0.04,

	// Difficulty level for the normal draw when ControlledResultEnabled = 0.
	// 0 = loose/easy, 1 = normal, 2 = hard, 3 = very hard.
	// The higher the value, the lower the chance of high frames and accidental winning groups.
	defaultRandomDifficulty: 1,
	multiplierInitialPlayedThisRound: false,
	// True only during the free round/refill created by the Dragon.
	// During this phase the multiplier may be drawn again before the final payout.
	dragonFreeRoundActive: false,

	// Time each item takes to leave the screen after Spin is clicked.
	exitTime: 0.40,

	// Base delay used by the exit modes.
	// ExitType = 0: delay between each item in the current staggered effect.
	// ExitType = 1: no delay; all items leave together.
	// ExitType = 2: delay between full columns leaving in a vertical cascade.
	// The larger the value, the stronger the spacing between drops.
	exitDelay: 0.055,

	// Entry time for new items after Spin.
	enterTime: 0.46,

	// Drop time for existing items after a winning group is destroyed.
	cascadeTime: 0.34,

	// Duration of the animation that shrinks winning items to scale 0.
	winScaleTime: 0.22,

	// Delay between items entering the grid after Spin.
	spawnDelay: 0.055,

	// Delay between movements/creations during the cascade after prizes.
	cascadeDelay: 0.045,

	// Approximate total duration of the visual animation created in the Event Sheet.
	// It waits until the "animate winner 4" Tween finishes before continuing the check.
	winnerUiAnimationTime: 1.60,

	// Approximate duration of type-1 winning-card animations.
	// Used for frames 0, 1, 2, and 3.
	// The Event Sheet sequence is: animate card 1 / animate card 1-1 -> animate card 1-2.
	// Adjust this value if you change the timing of those Tweens in the Event Sheet.
	winnerCardsLowAnimationTime: 0.70,

	// Approximate duration of type-2 winning-card animations.
	// Used for frames 4, 5, and 6.
	// The Event Sheet sequence uses the "animate card 2" Tween.
	// Adjust this value if you change the timing of that Tween in the Event Sheet.
	winnerCardsHighAnimationTime: 1.55,

	// Approximate duration of the multiplier's initial animation.
	// The Event Sheet should start when AnimateMultiplier = 1 and finish at "Animate Multiplicador 0".
	// Prize checking only starts after this time.
	multiplierInitialAnimationTime: 1.10,

	// Approximate duration of the animation that adds +1x to the multiplier.
	// The Event Sheet should start when AnimateMultiplier = 2 and finish at "Animate Multiplicador 1".
	// After it finishes, the game proceeds to the next prize/check.
	multiplierIncrementAnimationTime: 1.00,

	// Approximate duration of the final animation that applies the multiplier to the round winnings.
	// The Event Sheet should start when AnimateMultiplier = 3 and finish at "Animate Multiplicador 3.5".
	// According to the current logic, at the end of this animation the Event Sheet multiplies TotalWinnings and adds it to Balance.
	multiplierApplyAnimationTime: 3.40,

	// Approximate duration of the Dragon card animation.
	// The Event Sheet starts when DragonBlaze = 1 and finishes at the "Animate Dragon 4" Tween.
	// When it finishes, JS starts a new free round.
	dragonAnimationTime: 0.55,

	// Safety limit for consecutive Dragon extra rounds.
	maxDragonExtraRounds: 5,

	buttonObjectName: "BTN_Iniciar",

	// Sounds played when a card STOPS at its final drop position.
	// Primary path: play directly from JS on the same tick the card reaches its destination.
	// Fallback: if AudioContext is unavailable, use the Event Sheet counters.
	// Special sound only for frames 9 and 10; all others use the normal sound.
	commonCardStopSoundName: "sound card comun",
	specialCardStopSoundName: "sound card especial",
	specialCardStopSoundFrames: [9, 10],
	cardStopEffectVar: "Soundeffect",
	commonCardSoundCounterVar: "CommonCardSoundCount",
	specialCardSoundCounterVar: "SpecialCardSoundCount",
	sfxBuffers: new Map(),
	sfxBufferPromises: new Map(),

	// Internal guard to prevent starting two rounds when the same touch fires both document and runtime events.
	buttonClickWaiting: false,

	// Cache used to update money text in Debug/Preview only when the value changes.
	lastMoneyText: "",
	lastWinningsText: "",

	// BTN_Iniciar click Tween.
	// The round now starts only after the "Click" Tween has actually finished.
	buttonClickTweenTag: "Click",

	// Safety fallback in case the Tween API is unavailable in preview/export.
	buttonClickAnimationTime: 0.42,
	buttonClickTweenFinishTimeout: 2.0,

	maxResolveLoops: 30
};

// Paytable: row = item frame, column = connected quantity.
// GetMultiplier() converts quantities of 12+ to the final value in the table.
const PAY_TABLE = {
	0: { 3: 0.1, 4: 0.4, 5: 1.0, 6: 1.5, 7: 2.2, 8: 3.5, 9: 4.0, 10: 5.0, 11: 6.0, 12: 10 },
	1: { 3: 0.2, 4: 0.8, 5: 1.5, 6: 2.0, 7: 3.2, 8: 4.5, 9: 5.0, 10: 6.0, 11: 7.0, 12: 20 },
	2: { 3: 0.3, 4: 1.0, 5: 2.0, 6: 3.0, 7: 4.2, 8: 5.5, 9: 6.0, 10: 7.0, 11: 8.0, 12: 30 },
	3: { 3: 0.5, 4: 1.5, 5: 2.5, 6: 4.0, 7: 5.2, 8: 6.5, 9: 7.0, 10: 8.0, 11: 10, 12: 40 },
	4: { 3: 1.0, 4: 2.0, 5: 3.0, 6: 5.0, 7: 10,  8: 15,  9: 20,  10: 30,  11: 40,  12: 50 },
	5: { 3: 1.5, 4: 3.0, 5: 5.0, 6: 10,  7: 15,  8: 20,  9: 30,  10: 40,  11: 50,  12: 100 },
	6: { 3: 2.0, 4: 5.0, 5: 10,  6: 15,  7: 20,  8: 30,  9: 40,  10: 50,  11: 100, 12: 200 }
};

runOnStartup(async runtime =>
{
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

function OnBeforeProjectStart(runtime)
{
	InitialiseGrid(runtime);
	EnsureGameMoneyVariables(runtime);
	SetGlobalNumber(runtime, "PrizeChartOpen", 0);

	// Ensures animations controlled by the Event Sheet do not start automatically when the layout starts.
	SetGlobalNumber(runtime, "WinningCardsAnimation", 0);
	SetGlobalNumber(runtime, "RoundWinAnimation", 0);
	SetGlobalNumber(runtime, "AnimateMultiplier", 0);
	SetGlobalNumber(runtime, "MultiplierValue", 1);
	SetGlobalNumber(runtime, "DragonBlaze", 0);
	SetGlobalNumber(runtime, "BlitzPremiation", 0);
	SetGlobalNumber(runtime, "BonusGame", 0);
	ResetSpecialLocalAnimations(runtime);
	UpdateMoneyTexts(runtime);

	// Resume AudioContext on first user interaction (required for mobile browsers)
	let audioResumed = false;
	const resumeAudio = () =>
	{
		if (audioResumed) return;
		const audioObject = runtime.objects.Audio;
		if (audioObject && audioObject.audioContext && audioObject.audioContext.state === "suspended")
		{
			audioObject.audioContext.resume().then(() =>
			{
				audioResumed = true;
				console.log("AudioContext resumed");
			});
		}
		else
		{
			audioResumed = true;
		}
	};
	document.addEventListener("pointerdown", resumeAudio, { once: true });
	document.addEventListener("keydown", resumeAudio, { once: true });
	document.addEventListener("touchstart", resumeAudio, { once: true });

	// Keeps SF_Money and SF_Winnings formatted even when the Event Sheet changes
	// Balance/TotalWinnings directly, as happens at the end of the multiplier sequence.
	// Also forces text refresh when the layout has just created/recreated the text objects,
	// preventing the balance from remaining stuck at the editor's initial text, such as $0.00.
	runtime.addEventListener("tick", () => AutoRefreshMoneyTexts(runtime));
	runtime.addEventListener("afteranylayoutstart", () => SyncPrizeChartState(runtime));

	// Exposes functions to the Event Sheet in case you want to call them through Browser -> Execute JavaScript.
	// SlotGameSpin() respects the BTN_Iniciar click animation before starting the round.
	// SlotGameSpinNow() starts the round immediately without waiting for animation.
	globalThis.SlotGameSpin = () => StartRoundAfterButtonClick(runtime);
	globalThis.SlotGameSpinNow = () => SpinBoard(runtime);
	globalThis.PreloadCardStopSounds = () => PreloadCardStopSounds(runtime);
	globalThis.TestCardStopSound = frame => PlayCardStopSoundByFrame(runtime, Number(frame));
	globalThis.OpenPrizeChart = () => SetPrizeChartOpen(runtime, true);
	globalThis.ClosePrizeChart = () => SetPrizeChartOpen(runtime, false);
	globalThis.IsPrizeChartOpen = () => IsPrizeChartOpen(runtime);

	// Debug: test if spin button is detected at given coordinates
	globalThis.TestSpinButtonHit = (x, y) =>
	{
		const mockEvent = { clientX: x, clientY: y };
		return PointerIsOnSpinButton(runtime, mockEvent);
	};

	// Debug: log button info
	globalThis.DebugSpinButton = () =>
	{
		const buttonType = runtime.objects[CascadeSlot.buttonObjectName];
		if (!buttonType)
		{
			console.log("Button type not found:", CascadeSlot.buttonObjectName);
			return;
		}
		const buttons = buttonType.getAllInstances ? buttonType.getAllInstances() : [];
		console.log("Button instances found:", buttons.length);
		for (const btn of buttons)
		{
			console.log("Button:", { x: btn.x, y: btn.y, width: btn.width, height: btn.height, layer: btn.layer?.name, containsPoint: !!btn.containsPoint });
		}
	};

	// Preloads/decodes the 2 effects for direct playback at the exact stop moment.
	// If you prefer manual Event Sheet control, call PreloadCardStopSounds() at layout start.
	void PreloadCardStopSounds(runtime);

	// Also uses document capture because Construct buttons/controls may consume the pointer event.
	// BTN_Iniciar is now the official round-start button. JS waits for the click animation
	// performed in the Event Sheet and only then calls SpinBoard().
	document.addEventListener("pointerdown", ev => HandlePointerDown(runtime, ev), true);
	runtime.addEventListener("pointerdown", ev => HandlePointerDown(runtime, ev));

	console.log("Cascade slot mechanics and paytable loaded.");
}

function InitialiseGrid(runtime)
{
	const cards = GetCards(runtime);
	if (!cards.length) return;

	const xs = UniqueSorted(cards.map(c => c.x));
	const ys = UniqueSorted(cards.map(c => c.y));

	CascadeSlot.startX = xs[0];
	CascadeSlot.startY = ys[0];
	CascadeSlot.cellW = xs.length > 1 ? xs[1] - xs[0] : cards[0].width;
	CascadeSlot.cellH = ys.length > 1 ? ys[1] - ys[0] : cards[0].height;
	CascadeSlot.columns = xs.length;
	CascadeSlot.rows = ys.length;
	CascadeSlot.layerName = cards[0].layer ? cards[0].layer.name : CascadeSlot.layerName;
	CascadeSlot.animationName = cards[0].animationName || CascadeSlot.animationName;

	for (const card of cards)
	{
		card.instVars.gridX = ClosestIndex(xs, card.x);
		card.instVars.gridY = ClosestIndex(ys, card.y);
		card.instVars.type = card.animationFrame || 0;
		if (card.instVars.animate === undefined) card.instVars.animate = 0;
		if (card.instVars.animateMultiplicador === undefined) card.instVars.animateMultiplicador = 0;
		if (card.instVars.frameDragon === undefined) card.instVars.frameDragon = 0;
		if (card.instVars.FrameBlitz === undefined) card.instVars.FrameBlitz = 0;
		if (card.instVars.FrameBonus === undefined) card.instVars.FrameBonus = 0;
		UpdateCardSpecialFlags(card);
	}
	EnforceSingleSpecialCards(runtime);

	if (CascadeSlot.columns === 0 || CascadeSlot.rows === 0)
	{
		console.error("Grid initialisation failed: no columns or rows detected");
	}
}


// ------------------------------------------------------------
// PRIZE CHART / GAME INFO OVERLAY
// ------------------------------------------------------------
// Uses Construct's HTML Element scripting interface, so the close button works
// in both DOM mode and worker mode. PrizeChartOpen is also used by the PLAY
// event and the slot logic to guarantee no round can start while the overlay is open.
const PrizeChartBoundInstances = new WeakSet();

function GetPrizeChartInstances(runtime)
{
	const objectType = runtime.objects.PrizeChartHTML;
	if (!objectType || typeof objectType.getAllInstances !== "function") return [];
	return objectType.getAllInstances();
}

function IsPrizeChartOpen(runtime)
{
	return GetGlobalNumber(runtime, "PrizeChartOpen", 0) === 1;
}

function BindPrizeChartCloseButton(runtime, inst)
{
	if (!inst || PrizeChartBoundInstances.has(inst)) return;
	PrizeChartBoundInstances.add(inst);

	inst.addEventListener("click", ev =>
	{
		if (ev && ev.targetId === "db-close-info")
			SetPrizeChartOpen(runtime, false);
	});
}

function SyncPrizeChartState(runtime)
{
	const isOpen = IsPrizeChartOpen(runtime);
	for (const inst of GetPrizeChartInstances(runtime))
	{
		BindPrizeChartCloseButton(runtime, inst);
		inst.isVisible = isOpen;
	}
}

function SetPrizeChartOpen(runtime, open)
{
	const shouldOpen = !!open;
	const instances = GetPrizeChartInstances(runtime);

	// Do not leave the game locked if this function is called on a layout
	// that does not contain the PrizeChartHTML object.
	if (shouldOpen && !instances.length)
		return false;

	SetGlobalNumber(runtime, "PrizeChartOpen", shouldOpen ? 1 : 0);

	for (const inst of instances)
	{
		BindPrizeChartCloseButton(runtime, inst);
		inst.isVisible = shouldOpen;

		// Every time the player opens the page, start at the top.
		if (shouldOpen && typeof inst.setScrollPosition === "function")
			void inst.setScrollPosition(".db-root", "top", 0);
	}

	return true;
}

function HandlePointerDown(runtime, ev)
{
	if (IsPrizeChartOpen(runtime)) return;
	if (!PointerIsOnSpinButton(runtime, ev)) return;

	const buttonTweenPlaying = IsButtonClickTweenPlaying(runtime) === true;
	const isProcessingGlobal = GetGlobalNumber(runtime, "IsProcessing", 0) === 1;

	if (
		CascadeSlot.processing ||
		CascadeSlot.buttonClickWaiting ||
		buttonTweenPlaying ||
		isProcessingGlobal
	)
	{
		BlockPointerEvent(ev);
		return;
	}

	StartRoundAfterButtonClick(runtime);
}

function BlockPointerEvent(ev)
{
	if (!ev) return;

	if (typeof ev.preventDefault === "function")
		ev.preventDefault();

	if (typeof ev.stopImmediatePropagation === "function")
		ev.stopImmediatePropagation();
	else if (typeof ev.stopPropagation === "function")
		ev.stopPropagation();
}

async function StartRoundAfterButtonClick(runtime)
{
	if (IsPrizeChartOpen(runtime) || CascadeSlot.processing || CascadeSlot.buttonClickWaiting) return;

	// Sets only the internal lock while the BTN_Iniciar click animation is running.
	// IMPORTANT: IsProcessing is not changed here because the Event Sheet still needs to
	// run the Touch actions, such as destroying SF_Multiplicador2.
	// IsProcessing only becomes 1 when the round actually starts in SpinBoard().
	CascadeSlot.buttonClickWaiting = true;

	const clickConfirmed = await WaitButtonClickTweenFinished(runtime);

	CascadeSlot.buttonClickWaiting = false;
	if (!clickConfirmed || CascadeSlot.processing || IsPrizeChartOpen(runtime)) return;
	await SpinBoard(runtime);
}

function WaitButtonClickTweenFinished(runtime)
{
	return new Promise(resolve =>
	{
		let elapsed = 0;
		let sawClickTweenPlaying = false;
		let tweenApiAvailable = false;

		const finish = confirmed =>
		{
			runtime.removeEventListener("tick", tick);
			resolve(confirmed);
		};

		const tick = () =>
		{
			elapsed += runtime.dt;

			const playing = IsButtonClickTweenPlaying(runtime);
			if (playing !== null)
			{
				tweenApiAvailable = true;
				if (playing) sawClickTweenPlaying = true;

				// Waits for the "Click" Tween to start and only releases after it finishes.
				if (sawClickTweenPlaying && !playing)
				{
					finish(true);
					return;
				}
			}

			// If Construct does not expose the Tween API in this runtime/export, keep the old timing as a fallback.
			if (!tweenApiAvailable && elapsed >= CascadeSlot.buttonClickAnimationTime)
			{
				finish(true);
				return;
			}

			// If the Tween API exists but the "Click" Tween never started within a short grace period,
			// fall back to the timed animation instead of cancelling the round.
			// This handles cases where the Event Sheet doesn't have the Touch -> BTN_Iniciar event set up.
			const tweenStartGracePeriod = 0.5; // seconds to wait for tween to start
			if (tweenApiAvailable && !sawClickTweenPlaying && elapsed >= tweenStartGracePeriod)
			{
				// Tween API exists but Click tween never started - use timed fallback
				if (elapsed >= CascadeSlot.buttonClickAnimationTime)
				{
					finish(true);
					return;
				}
			}

			// Hard timeout - should not normally reach here
			if (elapsed >= CascadeSlot.buttonClickTweenFinishTimeout)
				finish(true);
		};

		runtime.addEventListener("tick", tick);
	});
}

function IsButtonClickTweenPlaying(runtime)
{
	const buttons = GetSpinButtons(runtime);
	if (!buttons.length) return null;

	let foundTweenApi = false;
	for (const button of buttons)
	{
		const tween = button.behaviors && button.behaviors.Tween;
		if (!tween || typeof tween.isPlaying !== "function") continue;

		foundTweenApi = true;
		try
		{
			if (tween.isPlaying(CascadeSlot.buttonClickTweenTag))
				return true;
		}
		catch (_)
		{
			return null;
		}
	}

	return foundTweenApi ? false : null;
}

function GetSpinButtons(runtime)
{
	const buttonType = runtime.objects[CascadeSlot.buttonObjectName];
	if (!buttonType || !buttonType.getAllInstances) return [];
	return buttonType.getAllInstances();
}

async function SpinBoard(runtime)
{
	if (CascadeSlot.processing || IsPrizeChartOpen(runtime)) return;
	EnsureGameMoneyVariables(runtime);

	const bet = GetGlobalNumber(runtime, "BetAmount", 0.10);
	const money = GetMoney(runtime);

	if (money < bet)
	{
		console.warn("Insufficient balance for this bet. Balance:", money, "BetAmount:", bet);
		SetGlobalNumber(runtime, "IsProcessing", 0);
		CascadeSlot.buttonClickWaiting = false;
		return;
	}

	CascadeSlot.processing = true;
	SetGlobalNumber(runtime, "IsProcessing", 1);
	InitialiseGrid(runtime);

	// Starts a new round: deducts the bet and resets this round's total winnings.
	SetMoney(runtime, Round2(money - bet));
	SetGlobalNumber(runtime, "RoundWin", 0);
	SetGlobalNumber(runtime, "TotalWinnings", 0);
	SetGlobalNumber(runtime, "BonusWinnings", 0);
	SetGlobalNumber(runtime, "MultiplierValue", 1);
	SetGlobalNumber(runtime, "AnimateMultiplier", 0);
	SetGlobalNumber(runtime, "DragonBlaze", 0);
	SetGlobalNumber(runtime, "BlitzPremiation", 0);
	SetGlobalNumber(runtime, "BonusGame", 0);
	ResetEspecialRoundFlags(runtime);
	ResetPendingSpecialRoundState();
	CascadeSlot.multiplierInitialPlayedThisRound = false;
	CascadeSlot.resultQueue = [];
	CascadeSlot.usingServerResult = IsServerResultActive(runtime);
	SetGlobalNumber(runtime, "Loading", CascadeSlot.usingServerResult ? 1 : 0);
	ResetSpecialLocalAnimations(runtime);
	UpdateMoneyTexts(runtime);

	try
	{
		const result = await RunSpinCycle(runtime, 0);

		// Empty/missing controlled result: do not use a random result.
		// Enter the Loading = 2 flow, wait, reset the round, and refund the bet.
		if (result && result.refundBet)
		{
			await HandleMissingServerResult(runtime, bet);
			return;
		}

		// If Blitz/Bonus was triggered, the Event Sheet will switch layouts.
		// In that case JS does not finish the standard round payout.
		if (!result || !result.stopForBonus)
			await FinishRoundPayout(runtime);
	}
	catch (err)
	{
		if (IsMissingServerResultError(err))
		{
			console.warn(err.message);
			await HandleMissingServerResult(runtime, bet);
			return;
		}

		throw err;
	}
	finally
	{
		// Reset button lock
		CascadeSlot.buttonClickWaiting = false;

		// If the round paused to enter a special layout, keep IsProcessing enabled
		// until Bonus/Blitz returns to the Game layout and the final payout animation finishes.
		if (CascadeSlot.waitingForSpecialLayoutReturn)
		{
			CascadeSlot.processing = true;
			SetGlobalNumber(runtime, "IsProcessing", 1);
		}
		else
		{
			CascadeSlot.processing = false;
			SetGlobalNumber(runtime, "IsProcessing", 0);
		}

		UpdateMoneyTexts(runtime);
	}
}

async function RunSpinCycle(runtime, dragonDepth)
{
	InitialiseGrid(runtime);
	const oldCards = GetCards(runtime).slice();

	if (oldCards.length)
	{
		const exitAnimations = BuildExitAnimations(runtime, oldCards);
		await AnimateMany(runtime, exitAnimations, CascadeSlot.exitTime, EaseInCubic);

		for (const card of oldCards)
		{
			if (!card.isDestroyed) card.destroy();
		}
	}

	// If ControlledResultEnabled = 1, wait for the server/dev to fill GameResult.
	// The cards have already left normally; Loading stays at 1 until a result exists.
	const serverResultReady = await EnsureServerResultReady(runtime);
	if (!serverResultReady)
		return { stopForBonus: false, startFreeRound: false, refundBet: true };

	CascadeSlot.dragonFreeRoundActive = dragonDepth > 0;
	
	// Reset multiplier state for Dragon free rounds
	if (dragonDepth > 0)
	{
		SetGlobalNumber(runtime, "MultiplierValue", 1);
		CascadeSlot.multiplierInitialPlayedThisRound = false;
	}
	
	await RefillBoardFromTop(runtime, dragonDepth);

	const specialResult = await HandleInitialSpecialCards(runtime, dragonDepth);
	if (specialResult.stopForBonus)
		return specialResult;

	if (specialResult.startFreeRound)
		return await RunSpinCycle(runtime, dragonDepth + 1);

	await ResolveAllWins(runtime, dragonDepth);

	const pendingDragonResult = await TryTriggerPendingDragonAfterWins(runtime, dragonDepth);
	if (pendingDragonResult.startFreeRound)
		return await RunSpinCycle(runtime, dragonDepth + 1);

	if (TriggerPendingSpecialLayout(runtime))
		return { stopForBonus: true, startFreeRound: false };

	return { stopForBonus: false, startFreeRound: false };
}

async function HandleInitialSpecialCards(runtime, dragonDepth)
{
	SnapAllCardsToGrid(runtime);

	// In server-controlled mode, the developer is responsible for the frame contents.
	// Therefore no automatic limit/conversion of special frames is forced here.
	if (!IsServerResultActive(runtime))
		EnforceSingleSpecialCards(runtime);

	UpdateAllCardSpecialFlags(runtime);
	UpdatePendingBonusSpecialFromCurrentCards(runtime);

	const hasImmediateNormalWin = FindWinningGroups(runtime).length > 0;

	// New rule: if 3x frame 9/10 appears together with a normal prize,
	// the special layout remains pending. The game resolves all 0..6 prizes first.
	// Blitz/Bonus is entered only when no normal prize remains on screen.
	if (HasPendingBonusSpecial() && !hasImmediateNormalWin)
	{
		if (TriggerPendingSpecialLayout(runtime))
			return { stopForBonus: true, startFreeRound: false };
	}

	const dragonCard = GetDragonCard(runtime);
	if (!dragonCard)
		return { stopForBonus: false, startFreeRound: false };

	// Dragon cannot compete for priority with a multiplier or with 3x frame 9/10.
	// If a normal prize exists, Dragon stays pending on screen and activates only after the animations/prizes.
	if (!IsServerResultActive(runtime) && ShouldBlockDragonActivation(runtime, dragonDepth))
	{
		ReplaceCardFrame(dragonCard, Math.floor(runtime.random() * 3));
		UpdateAllCardSpecialFlags(runtime);
		return { stopForBonus: false, startFreeRound: false };
	}

	if (hasImmediateNormalWin)
		return { stopForBonus: false, startFreeRound: false };

	if (dragonDepth >= CascadeSlot.maxDragonExtraRounds)
	{
		console.warn("Limite de rodadas extras do Dragon atingido. Convertendo Dragon em frame normal.");
		ReplaceCardFrame(dragonCard, Math.floor(runtime.random() * 3));
		UpdateAllCardSpecialFlags(runtime);
		return { stopForBonus: false, startFreeRound: false };
	}

	// With no immediate prize and no pending special: play the Dragon animation and, when it ends,
	// start a new free round.
	await PlayDragonAnimation(runtime, dragonCard);
	return { stopForBonus: false, startFreeRound: true };
}

async function PlayDragonAnimation(runtime, dragonCard)
{
	ResetDragonLocalFlags(runtime);
	dragonCard.instVars.frameDragon = 1;

	// DragonBlaze = 1 should trigger its animation in the Event Sheet.
	// JS waits approximately until the "Animate Dragon 4" Tween finishes.
	SetGlobalNumber(runtime, "DragonBlaze", 1);
	await WaitGlobalVarValue(runtime, "DragonBlaze", 0, 15);

	dragonCard.instVars.frameDragon = 0;
}

async function TryTriggerPendingDragonAfterWins(runtime, dragonDepth)
{
	SnapAllCardsToGrid(runtime);
	UpdateAllCardSpecialFlags(runtime);
	UpdatePendingBonusSpecialFromCurrentCards(runtime);

	const dragonCard = GetDragonCard(runtime);
	if (!dragonCard)
		return { stopForBonus: false, startFreeRound: false };

	if (!IsServerResultActive(runtime) && ShouldBlockDragonActivation(runtime, dragonDepth))
	{
		ReplaceCardFrame(dragonCard, Math.floor(runtime.random() * 3));
		UpdateAllCardSpecialFlags(runtime);
		return { stopForBonus: false, startFreeRound: false };
	}

	await PlayDragonAnimation(runtime, dragonCard);
	return { stopForBonus: false, startFreeRound: true };
}

function ShouldBlockDragonActivation(runtime, dragonDepth = 0)
{
	if (dragonDepth >= CascadeSlot.maxDragonExtraRounds) return true;
	if (GetMultiplierCard(runtime)) return true;
	UpdatePendingBonusSpecialFromCurrentCards(runtime);
	return HasPendingBonusSpecial();
}

function BuildExitAnimations(runtime, cards)
{
	const tipoSaida = ClampInt(GetGlobalNumber(runtime, "ExitType", 0), 0, 2);
	const exitY = GetExitY(runtime);
	const animations = [];

	// ExitType controls only the EXIT of cards during Spin.
	// ENTRY remains unchanged because it is already working as intended.
	//
	// 0 = current item-by-item staggered/cascade exit:
	// starts on the bottom row, moves left to right, then proceeds upward.
	// 1 = all cards leave at once:
	// all cards move down at the same time with no delay.
	// 2 = vertical-column exit:
	// one entire column leaves together, followed by the next column.
	if (tipoSaida === 1)
	{
		for (const card of cards)
		{
			animations.push({
				inst: card,
				x: card.x,
				y: exitY + (card.instVars.gridY || 0) * CascadeSlot.cellH * 0.15,
				delay: 0
			});
		}
		return animations;
	}

	if (tipoSaida === 2)
	{
		// Entire column leaves at the same time.
		// The delay changes per column, so column 0 drops, then 1, then 2, and so on.
		// For a slower cascade between columns, increase CascadeSlot.exitDelay at the top of the file.
		const columnDelay = CascadeSlot.exitDelay * 2.25;
		const cardsInColumnOrder = cards.slice().sort((a, b) =>
		{
			const ax = Math.round(a.instVars.gridX || 0);
			const bx = Math.round(b.instVars.gridX || 0);
			if (ax !== bx) return ax - bx; // left to right

			const ay = Math.round(a.instVars.gridY || 0);
			const by = Math.round(b.instVars.gridY || 0);
			return by - ay; // within the column, keep bottom-to-top order, but all items use the same delay
		});

		for (const card of cardsInColumnOrder)
		{
			const col = Math.round(card.instVars.gridX || 0);
			animations.push({
				inst: card,
				x: card.x,
				y: exitY + (card.instVars.gridY || 0) * CascadeSlot.cellH * 0.15,
				delay: col * columnDelay
			});
		}
		return animations;
	}

	// ExitType = 0 or any invalid value: keep the existing exit behavior.
	// Use an item-by-item staggered/cascade exit instead of dropping the entire board at once.
	const cardsInExitOrder = cards.slice().sort((a, b) =>
	{
		const ay = Math.round(a.instVars.gridY || 0);
		const by = Math.round(b.instVars.gridY || 0);
		if (ay !== by) return by - ay; // bottom to top

		const ax = Math.round(a.instVars.gridX || 0);
		const bx = Math.round(b.instVars.gridX || 0);
		return ax - bx; // left to right within the row
	});

	let exitOrder = 0;
	for (const card of cardsInExitOrder)
	{
		animations.push({
			inst: card,
			x: card.x,
			y: exitY + (card.instVars.gridY || 0) * CascadeSlot.cellH * 0.15,
			delay: exitOrder * CascadeSlot.exitDelay
		});
		exitOrder++;
	}

	return animations;
}

async function ResolveAllWins(runtime, dragonDepth = 0)
{
	for (let loop = 0; loop < CascadeSlot.maxResolveLoops; loop++)
	{
		SnapAllCardsToGrid(runtime);
		UpdatePendingBonusSpecialFromCurrentCards(runtime);

		// Before any prize check, verify whether a multiplier exists on screen.
		// If it exists and its initial animation has not run in this round, set AnimateMultiplier = 1
		// and wait for "Animate Multiplicador 0" to finish before checking prizes.
		await MaybePlayInitialMultiplierAnimation(runtime);

		const winningGroups = FindWinningGroups(runtime);
		if (!winningGroups.length) return;

		// Each winning group is handled separately.
		// Example: if item A and item K both win, A animates/pays/is destroyed first,
		// then K animates/pays/is destroyed. The cascade occurs only after all current groups are finished.
		for (const group of winningGroups)
		{
			await PayAndAnimateWinningGroup(runtime, group);
			await AnimateWinAndDestroy(runtime, group.cards);
		}

		await CascadeExistingCardsAndRefill(runtime, dragonDepth);
		UpdatePendingBonusSpecialFromCurrentCards(runtime);
	}

	console.warn("ResolveAllWins stopped at the safety limit. Check whether the draw is generating an infinite prize loop.");
}

async function PayAndAnimateWinningGroup(runtime, group)
{
	const itemType = ClampInt(group.type, 0, CascadeSlot.frameCount - 1);
	const amount = group.cards.length;
	const bet = GetGlobalNumber(runtime, "BetAmount", 0.10);
	const multiplier = GetMultiplier(itemType, amount);
	const prize = Round2(bet * multiplier);

	// Shows only the value of the current prize.
	// IMPORTANT: the TotalWinnings/SF_Winnings total is updated only after
	// the "animate winner 4" animation finishes.
	SetGlobalNumber(runtime, "RoundWin", prize);
	SetObjectText(runtime, "SF_Winner", "$" + FormatMoney(prize));

	// First play the winning-card animation.
	// After it finishes, release the round win animation.
	await PlayWinnerCardsAnimation(runtime, group);

	// Runs the prize animation created in the Event Sheet.
	// JS waits for the full duration through the end of the "animate winner 4" Tween before allowing the next check.
	await PlayWinnerUiAnimation(runtime, prize);

	// Now that the "animate winner 4" animation has finished,
	// add the prize to the round total and update the formatted SF_Winnings text.
	SetGlobalNumber(runtime, "TotalWinnings", Round2(GetGlobalNumber(runtime, "TotalWinnings", 0) + prize));
	UpdateMoneyTexts(runtime);

	// If a multiplier is active in the round, each prize adds +1x.
	// The Event Sheet should listen for AnimateMultiplier = 2 to play "Animate Multiplicador 1".
	await PlayMultiplierIncrementAnimation(runtime);
}

function GetMultiplier(itemType, amount)
{
	if (amount < 3) return 0;
	const row = PAY_TABLE[itemType] || PAY_TABLE[0];
	const key = amount >= 12 ? 12 : amount;
	return row[key] || 0;
}

async function PlayWinnerCardsAnimation(runtime, group)
{
	// Winning-card animation is controlled by the Event Sheet.
	// JS marks only the cards in the winning group using the local "animate" variable.
	// Frames 0, 1, 2, and 3 receive animate = 1.
	// Frames 4, 5, and 6 receive animate = 2.
	// Then JS sets WinningCardsAnimation = 1 so the Event Sheet can start the Tweens.
	//
	// IMPORTANT ABOUT TIMING:
	// Because the animation is performed in the Event Sheet, JS waits for a configured duration here:
	// - winnerCardsLowAnimationTime for the "animate card 1-2" sequence;
	// - winnerCardsHighAnimationTime for the "animate card 2" sequence.
	// If you change those Tween timings in the Event Sheet, also adjust the values in CascadeSlot.

	const itemType = ClampInt(group.type, 0, CascadeSlot.frameCount - 1);
	const animateValue = itemType <= 3 ? 1 : 2;
	const waitTime = animateValue === 1
		? CascadeSlot.winnerCardsLowAnimationTime
		: CascadeSlot.winnerCardsHighAnimationTime;

	// Clears animation state from all cards so only the current group animates.
	for (const card of GetCards(runtime))
	{
		if (!card.isDestroyed) card.instVars.animate = 0;
	}

	// Marks only the winning cards in the current group.
	for (const card of group.cards)
	{
		if (!card.isDestroyed) card.instVars.animate = animateValue;
	}

	SetGlobalNumber(runtime, "WinningCardsAnimation", 1);
	await WaitSeconds(runtime, waitTime);

	// After the card animation finishes, clear the local variable.
	// Card destruction continues to be handled by the main JS flow.
	for (const card of group.cards)
	{
		if (!card.isDestroyed) card.instVars.animate = 0;
	}
}

async function PlayWinnerUiAnimation(runtime, prize)
{
	// The round visual animation is fully controlled by the Event Sheet.
	// This stage starts only after the winning-card animation has finished.
	// JS sets RoundWinAnimation to 1; the Event Sheet logic
	// detects this value, resets the variable to 0, and starts the sequence:
	// animate winner 1 -> animate winner 2 -> animate winner 3 -> animate winner 4.
	//
	// IMPORTANT ABOUT TIMING:
	// JS waits winnerUiAnimationTime before continuing to the next winning group.
	// This duration must cover the full "animate winner 4" Tween.
	// If you increase or decrease the timings in the Event Sheet, also adjust
	// CascadeSlot.winnerUiAnimationTime at the top of this file.
	SetObjectText(runtime, "SF_Winner", "$" + FormatMoney(prize));
	SetGlobalNumber(runtime, "RoundWinAnimation", 1);

	await WaitSeconds(runtime, CascadeSlot.winnerUiAnimationTime);

	// The round total is updated in PayAndAnimateWinningGroup(),
	// immediately after this function finishes. This prevents SF_Winnings from changing
	// before the end of the "animate winner 4" animation.
}


async function MaybePlayInitialMultiplierAnimation(runtime)
{
	const multiplierCard = GetMultiplierCard(runtime);
	if (!multiplierCard) return;

	// If the multiplier has already been initialized this round, do not repeat the initial animation.
	// It remains active until the end of the round.
	if (GetGlobalNumber(runtime, "MultiplierValue", 1) < 1)
		SetGlobalNumber(runtime, "MultiplierValue", 1);

	if (CascadeSlot.multiplierInitialPlayedThisRound)
		return;

	// Marks only the multiplier card for its visual logic in the Event Sheet.
	ResetMultiplierLocalAnimation(runtime);
	multiplierCard.instVars.animateMultiplicador = 1;

	// AnimateMultiplier = 1 should trigger the initial "Animate Multiplicador 0" animation.
	// Winning-group checks start only after this duration ends.
	SetGlobalNumber(runtime, "AnimateMultiplier", 1);
	UpdateMultiplierText(runtime);

	await WaitSeconds(runtime, CascadeSlot.multiplierInitialAnimationTime);

	multiplierCard.instVars.animateMultiplicador = 0;
	CascadeSlot.multiplierInitialPlayedThisRound = true;
}

async function PlayMultiplierIncrementAnimation(runtime)
{
	const multiplierCard = GetMultiplierCard(runtime);
	if (!multiplierCard) return;

	// Each prize found increases the multiplier by +1x.
	// In this version, the +1 to MultiplierValue is handled by the Event Sheet logic,
	// inside the AnimateMultiplier = 2 trigger, preserving full control of that section there.
	// JS only sets the variable and waits for "Animate Multiplicador 1" to finish.
	SetGlobalNumber(runtime, "AnimateMultiplier", 2);
	multiplierCard.instVars.animateMultiplicador = 2;

	await WaitSeconds(runtime, CascadeSlot.multiplierIncrementAnimationTime);

	multiplierCard.instVars.animateMultiplicador = 0;
	UpdateMultiplierText(runtime);
}

async function FinishRoundPayout(runtime)
{
	const totalBasePrize = Round2(GetGlobalNumber(runtime, "TotalWinnings", 0));
	if (totalBasePrize <= 0)
	{
		UpdateMoneyTexts(runtime);
		return;
	}

	const multiplierCard = GetMultiplierCard(runtime);
	if (multiplierCard)
	{
		// End of round with multiplier.
		// AnimateMultiplier = 3 should trigger the final animation ending at "Animate Multiplicador 3.5".
		// According to the Event Sheet logic, at the end of this animation TotalWinnings is multiplied
		// by MultiplierValue and the result is added to Balance.
		SetGlobalNumber(runtime, "AnimateMultiplier", 3);
		multiplierCard.instVars.animateMultiplicador = 3;
		UpdateMultiplierText(runtime);

		await WaitSeconds(runtime, CascadeSlot.multiplierApplyAnimationTime);

		multiplierCard.instVars.animateMultiplicador = 0;
		UpdateMoneyTexts(runtime);
		return;
	}

	// Round without a multiplier: JS adds the base prize to Balance normally.
	SetMoney(runtime, Round2(GetMoney(runtime) + totalBasePrize));
	UpdateMoneyTexts(runtime);
}

function GetMultiplierCard(runtime)
{
	for (const card of GetCards(runtime))
	{
		if (card.isDestroyed) continue;
		const type = Math.round(card.instVars.type ?? card.animationFrame ?? 0);
		if (type === CascadeSlot.multiplierFrame)
			return card;
	}
	return null;
}

function ResetMultiplierLocalAnimation(runtime)
{
	// Kept for backward compatibility.
	ResetSpecialLocalAnimations(runtime);
}

function ResetSpecialLocalAnimations(runtime)
{
	for (const card of GetCards(runtime))
	{
		if (!card.isDestroyed && card.instVars)
		{
			card.instVars.animateMultiplicador = 0;
			card.instVars.frameDragon = 0;
			card.instVars.FrameBlitz = 0;
			card.instVars.FrameBonus = 0;
		}
	}
}

function ResetDragonLocalFlags(runtime)
{
	for (const card of GetCards(runtime))
	{
		if (!card.isDestroyed && card.instVars)
			card.instVars.frameDragon = 0;
	}
}

function UpdateCardSpecialFlags(card)
{
	if (!card || card.isDestroyed || !card.instVars) return;
	const type = Math.round(card.instVars.type ?? card.animationFrame ?? 0);
	card.instVars.animateMultiplicador = type === CascadeSlot.multiplierFrame ? card.instVars.animateMultiplicador || 0 : 0;
	card.instVars.frameDragon = type === CascadeSlot.dragonFrame ? 1 : 0;
	card.instVars.FrameBlitz = type === CascadeSlot.blitzFrame ? 1 : 0;
	card.instVars.FrameBonus = type === CascadeSlot.bonusFrame ? 1 : 0;
}

function UpdateAllCardSpecialFlags(runtime)
{
	for (const card of GetCards(runtime))
		UpdateCardSpecialFlags(card);
}

function UpdateMultiplierText(runtime)
{
	SetObjectText(runtime, "SF_Multiplicador", "X" + GetGlobalNumber(runtime, "MultiplierValue", 1));
}

function FindWinningGroups(runtime)
{
	const grid = BuildGrid(runtime);
	const visited = new Set();
	const groups = [];

	// Connected-group rule:
	// checks left/right/up/down neighbors with the same frame.
	// Diagonals do not connect. Any connected group of 3+ items becomes a prize.
	for (let row = 0; row < CascadeSlot.rows; row++)
	{
		for (let col = 0; col < CascadeSlot.columns; col++)
		{
			const start = grid[row][col];
			if (!start) continue;

			const startKey = GridKey(row, col);
			if (visited.has(startKey)) continue;

			const type = start.instVars.type;
			// Special frames 7, 8, 9, and 10 are not included in the normal paytable.
			// 7 = multiplier, 8 = Dragon, 9/10 = layout bonuses.
			if (type > CascadeSlot.prizeFrameMax) continue;

			const group = [];
			const stack = [{ row, col }];
			visited.add(startKey);

			while (stack.length)
			{
				const current = stack.pop();
				const card = grid[current.row][current.col];
				if (!card || card.instVars.type !== type) continue;

				group.push(card);

				const neighbours = [
					{ row: current.row, col: current.col - 1 },
					{ row: current.row, col: current.col + 1 },
					{ row: current.row - 1, col: current.col },
					{ row: current.row + 1, col: current.col }
				];

				for (const n of neighbours)
				{
					if (n.row < 0 || n.row >= CascadeSlot.rows || n.col < 0 || n.col >= CascadeSlot.columns)
						continue;

					const key = GridKey(n.row, n.col);
					if (visited.has(key)) continue;

					const next = grid[n.row][n.col];
					if (!next || next.instVars.type !== type) continue;

					visited.add(key);
					stack.push(n);
				}
			}

			if (group.length >= 3)
			{
				groups.push({
					type,
					cards: SortGroupCards(group)
				});
			}
		}
	}

	return SortWinningGroups(groups);
}

function SortWinningGroups(groups)
{
	return groups.sort((a, b) =>
	{
		// Stable visual order: lower frame first, then top to bottom and left to right.
		if (a.type !== b.type) return a.type - b.type;

		const aFirst = a.cards[0];
		const bFirst = b.cards[0];
		if (!aFirst || !bFirst) return 0;
		if (aFirst.instVars.gridY !== bFirst.instVars.gridY) return aFirst.instVars.gridY - bFirst.instVars.gridY;
		return aFirst.instVars.gridX - bFirst.instVars.gridX;
	});
}

function SortGroupCards(cards)
{
	return cards.slice().sort((a, b) =>
	{
		if (a.instVars.gridY !== b.instVars.gridY) return a.instVars.gridY - b.instVars.gridY;
		return a.instVars.gridX - b.instVars.gridX;
	});
}

function GridKey(row, col)
{
	return row + ":" + col;
}

async function AnimateWinAndDestroy(runtime, winners)
{
	await AnimateScaleToZero(runtime, winners, CascadeSlot.winScaleTime, EaseInBackSoft);

	for (const card of winners)
	{
		if (!card.isDestroyed) card.destroy();
	}
}

async function CascadeExistingCardsAndRefill(runtime, dragonDepth = 0)
{
	const sample = GetCards(runtime)[0];
	const width = sample ? sample.width : CascadeSlot.cellW;
	const height = sample ? sample.height : CascadeSlot.cellH;
	const layerName = CascadeSlot.layerName;
	const animations = [];
	let order = 0;
	const bonusSpecialLimiter = CreateBonusSpecialLimitStateFromCurrentCards(runtime);

	for (let col = 0; col < CascadeSlot.columns; col++)
	{
		const columnCards = GetCards(runtime)
			.filter(card => !card.isDestroyed && Math.round(card.instVars.gridX) === col)
			.sort((a, b) => b.instVars.gridY - a.instVars.gridY); // bottom to top

		let targetRow = CascadeSlot.rows - 1;
		for (const card of columnCards)
		{
			card.instVars.gridY = targetRow;
			card.instVars.gridX = col;
			animations.push({
				inst: card,
				x: GridToX(col),
				y: GridToY(targetRow),
				delay: order * CascadeSlot.cascadeDelay,
				// During refill, an existing card that only moves down does NOT play a sound.
				// Sound and Soundeffect=1 are used only for new frames created during refill.
				playStopSound: false
			});
			order++;
			targetRow--;
		}

		// Refill/cascade after a prize does NOT use the 50-frame special queue.
		// That visual queue should occur only on the first drop of the round, inside RefillBoardFromTop().
		for (let row = targetRow; row >= 0; row--)
		{
			// Refill/cascade after a prize: Dragon may be created and remain pending,
			// but it cannot coexist with a multiplier or with 3x frame 9/10.
			let frame = SanitizeRefillFrame(runtime, GetNextFrame(runtime, col, row), bonusSpecialLimiter, dragonDepth);
			frame = SanitizeBonusSpecialFrameForRefill(runtime, frame, bonusSpecialLimiter);
			const targetX = GridToX(col);
			const targetY = GridToY(row);
			const spawnY = CascadeSlot.startY - CascadeSlot.cellH * (targetRow - row + 1.25);
			const card = CreateCard(runtime, layerName, targetX, spawnY, width, height, col, row, frame);
			animations.push({
				inst: card,
				x: targetX,
				y: targetY,
				delay: order * CascadeSlot.cascadeDelay,
				playStopSound: true
			});
			order++;
		}
	}

	await AnimateMany(runtime, animations, CascadeSlot.cascadeTime, EaseOutBackSoft);
	SnapAllCardsToGrid(runtime);
}

async function RefillBoardFromTop(runtime, dragonDepth = 0)
{
	const layerName = CascadeSlot.layerName;
	const sample = GetCards(runtime)[0];
	const width = sample ? sample.width : CascadeSlot.cellW;
	const height = sample ? sample.height : CascadeSlot.cellH;
	const framesByRow = [];
	const columnFrames = [];
	const specsByColumn = [];

	for (let row = 0; row < CascadeSlot.rows; row++)
		framesByRow[row] = new Array(CascadeSlot.columns).fill(0);

	for (let col = 0; col < CascadeSlot.columns; col++)
	{
		columnFrames[col] = [];
		specsByColumn[col] = [];
	}

	// Consumes results in the original order: bottom row to top, left to right.
	for (let row = CascadeSlot.rows - 1; row >= 0; row--)
	{
		for (let col = 0; col < CascadeSlot.columns; col++)
		{
			const frame = GetNextFrame(runtime, col, row);
			framesByRow[row][col] = frame;
			columnFrames[col].push(frame);
		}
	}

	// Adjusts final frames while they are still in memory, before creating any card on screen.
	// This prevents the player from seeing frame 8/Dragon appear and then change.
	PrepareInitialFramesBeforeDrop(runtime, framesByRow, dragonDepth);
	SyncColumnFramesFromMatrix(framesByRow, columnFrames);

	const useSpecialByColumn = BuildSpecialColumnsFromFrames(columnFrames);
	const firstSpecialColumn = useSpecialByColumn.findIndex(Boolean);

	let order = 0;
	for (let row = CascadeSlot.rows - 1; row >= 0; row--)
	{
		for (let col = 0; col < CascadeSlot.columns; col++)
		{
			const targetX = GridToX(col);
			const targetY = GridToY(row);
			const spawnY = CascadeSlot.startY - CascadeSlot.cellH * (CascadeSlot.rows + 1 + (CascadeSlot.rows - 1 - row));
			const frame = framesByRow[row][col];

			specsByColumn[col].push({
				col,
				row,
				frame,
				targetX,
				targetY,
				spawnY,
				delay: order * CascadeSlot.spawnDelay
			});

			order++;
		}
	}

	// No special mode: keep the original normal drop exactly as-is, with all cards using the global delay.
	if (firstSpecialColumn < 0)
	{
		const normalItems = [];
		const orderedSpecs = [];
		for (const columnSpecs of specsByColumn)
		{
			for (const spec of columnSpecs)
				orderedSpecs.push(spec);
		}
		orderedSpecs.sort((a, b) => a.delay - b.delay);
		for (const spec of orderedSpecs)
		{
			const card = CreateCard(runtime, layerName, spec.targetX, spec.spawnY, width, height, spec.col, spec.row, spec.frame);
			normalItems.push({
				inst: card,
				x: spec.targetX,
				y: spec.targetY,
				delay: spec.delay,
				playStopSound: true
			});
		}

		await AnimateMany(runtime, normalItems, CascadeSlot.enterTime, EaseOutBackSoft);
		SnapAllCardsToGrid(runtime);
		return;
	}

	// Before the special trigger, keep the normal cascade drop.
	// After the special begins, no later column may drop before the current column finishes.
	// This allows the special drop to be disabled after the 3rd matching frame without breaking visual order.
	const preSpecialItems = [];
	const preSpecialSpecs = [];
	for (let col = 0; col < firstSpecialColumn; col++)
	{
		for (const spec of specsByColumn[col])
			preSpecialSpecs.push(spec);
	}
	preSpecialSpecs.sort((a, b) => a.delay - b.delay);
	for (const spec of preSpecialSpecs)
	{
		const card = CreateCard(runtime, layerName, spec.targetX, spec.spawnY, width, height, spec.col, spec.row, spec.frame);
		preSpecialItems.push({
			inst: card,
			x: spec.targetX,
			y: spec.targetY,
			delay: spec.delay,
			playStopSound: true
		});
	}

	await AnimateMany(runtime, preSpecialItems, CascadeSlot.enterTime, EaseOutBackSoft);

	const lastSpecialColumn = useSpecialByColumn.reduce((last, value, index) => value ? index : last, -1);

	for (let col = firstSpecialColumn; col < CascadeSlot.columns; col++)
	{
		const specs = specsByColumn[col];
		if (!specs.length) continue;

		if (useSpecialByColumn[col])
		{
			StartEspecialRound(runtime, col);

			await CreateAndDropExtendedSpecialColumn(runtime, specs, layerName, width, height, CascadeSlot.cascadeTime, CascadeSlot.cascadeDelay);

			if (col === lastSpecialColumn)
				FinishEspecialRound(runtime);
		}
		else
		{
			await CreateAndDropFinalColumnCards(runtime, specs, layerName, width, height, CascadeSlot.enterTime, CascadeSlot.cascadeDelay);
		}
	}

	SnapAllCardsToGrid(runtime);
}


function ResetEspecialRoundFlags(runtime)
{
	// SpecialRound remains under manual/visual Event Sheet control.
	// JS only reports the current special column when it begins to drop.
	SetGlobalNumber(runtime, "SpecialRoundFinished", 0);
}

function StartEspecialRound(runtime, col)
{
	// Construct uses visual columns 1..5; internally JS uses 0..4.
	SetGlobalNumber(runtime, "SpecialRound", col + 1);
	SetGlobalNumber(runtime, "SpecialRoundFinished", 0);
}

function FinishEspecialRound(runtime)
{
	// Do not reset SpecialRound here; it is intended to be controlled/reset manually.
	SetGlobalNumber(runtime, "SpecialRoundFinished", 1);
}

function PrepareInitialFramesBeforeDrop(runtime, framesByRow, dragonDepth = 0)
{
	// Special 9/10 rule: after completing 3 identical frames, remove any extra 9/10 still in memory.
	// This runs before the drop, including with GameResult, so the player never sees the replacement.
	LimitBonusSpecialFramesInMatrix(runtime, framesByRow);

	// In GameResult-controlled mode, keep all other visual rules faithful to the server/dev result.
	// The refill exception is handled in SanitizeRefillFrame(), because refill already implies a previous prize.
	if (IsServerResultActive(runtime))
		return;

	EnforceSingleSpecialFramesInMatrix(runtime, framesByRow);

	const hasDragon = MatrixHasFrame(framesByRow, CascadeSlot.dragonFrame);
	if (!hasDragon) return;

	const hasMultiplier = MatrixHasFrame(framesByRow, CascadeSlot.multiplierFrame);
	const hasBonusLayoutWin = CountFrameInMatrix(framesByRow, CascadeSlot.blitzFrame) >= 3
		|| CountFrameInMatrix(framesByRow, CascadeSlot.bonusFrame) >= 3;
	const dragonBlockedByDepth = dragonDepth >= CascadeSlot.maxDragonExtraRounds;

	if (hasMultiplier || hasBonusLayoutWin || dragonBlockedByDepth)
		ReplaceFrameInMatrix(runtime, framesByRow, CascadeSlot.dragonFrame);
}

function SanitizeRefillFrame(runtime, frame, state = null, dragonDepth = 0)
{
	const type = ClampInt(frame, 0, CascadeSlot.frameCount - 1);

	// Standard refill continues without a multiplier.
	// Exception: the free round/refill created by Dragon before the final payout.
	if (type === CascadeSlot.multiplierFrame && dragonDepth <= 0)
		return GetSafeNormalReplacementFrame(runtime);

	// Dragon may be created during refill, but only if there is no conflict with a multiplier,
	// another Dragon, a pending 9/10 special, or the safety limit.
	if (type === CascadeSlot.dragonFrame)
	{
		const hasLockedBonusSpecial = !!state && state.lockedFrame !== null;
		if (GetMultiplierCard(runtime) || GetDragonCard(runtime) || HasPendingBonusSpecial() || hasLockedBonusSpecial || dragonDepth >= CascadeSlot.maxDragonExtraRounds)
			return GetSafeNormalReplacementFrame(runtime);
	}

	// Bonus special frames (9/10) during refill should check current screen state
	// to prevent forming 3+ while Dragon is active
	if (IsBonusSpecialFrame(type))
	{
		const hasLockedBonusSpecial = !!state && state.lockedFrame !== null;
		if (GetDragonCard(runtime) || HasPendingBonusSpecial() || hasLockedBonusSpecial)
			return GetAnyNormalReplacementFrame(runtime);
	}

	return type;
}

function LimitBonusSpecialFramesInMatrix(runtime, framesByRow)
{
	const lockedFrame = GetFirstBonusSpecialTripleFrameInMatrix(framesByRow);
	if (lockedFrame === null) return;

	let keptLockedFrameCount = 0;
	ForEachFrameCellInDropOrder(framesByRow, (row, col, type) =>
	{
		if (!IsBonusSpecialFrame(type)) return;

		if (type === lockedFrame && keptLockedFrameCount < CascadeSlot.bonusSpecialLockCount)
		{
			keptLockedFrameCount++;
			return;
		}

		framesByRow[row][col] = GetAnyNormalReplacementFrame(runtime);
	});
}

function GetFirstBonusSpecialTripleFrameInMatrix(framesByRow)
{
	let blitzCount = 0;
	let bonusCount = 0;
	const lockCount = Math.max(1, CascadeSlot.bonusSpecialLockCount || 3);
	let lockedFrame = null;

	ForEachFrameCellInDropOrder(framesByRow, (row, col, type) =>
	{
		if (lockedFrame !== null) return;

		if (type === CascadeSlot.blitzFrame)
		{
			blitzCount++;
			if (blitzCount >= lockCount) lockedFrame = CascadeSlot.blitzFrame;
		}
		else if (type === CascadeSlot.bonusFrame)
		{
			bonusCount++;
			if (bonusCount >= lockCount) lockedFrame = CascadeSlot.bonusFrame;
		}
	});

	return lockedFrame;
}

function CreateBonusSpecialLimitStateFromCurrentCards(runtime)
{
	const state = { blitzCount: 0, bonusCount: 0, lockedFrame: null };
	const lockCount = Math.max(1, CascadeSlot.bonusSpecialLockCount || 3);

	for (const card of GetCards(runtime))
	{
		if (card.isDestroyed) continue;
		const type = Math.round(card.instVars.type ?? card.animationFrame ?? 0);
		if (type === CascadeSlot.blitzFrame) state.blitzCount++;
		else if (type === CascadeSlot.bonusFrame) state.bonusCount++;
	}

	// Priority: pending bonus special > blitz if >= lockCount > bonus if >= lockCount
	// But only one can be locked at a time
	if (CascadeSlot.pendingBonusSpecialFrame !== null)
		state.lockedFrame = CascadeSlot.pendingBonusSpecialFrame;
	else if (state.blitzCount >= lockCount && state.bonusCount >= lockCount)
	{
		// Both have >= 3: lock the one with more count, or blitz if tied
		state.lockedFrame = state.blitzCount >= state.bonusCount ? CascadeSlot.blitzFrame : CascadeSlot.bonusFrame;
	}
	else if (state.blitzCount >= lockCount)
		state.lockedFrame = CascadeSlot.blitzFrame;
	else if (state.bonusCount >= lockCount)
		state.lockedFrame = CascadeSlot.bonusFrame;

	return state;
}

function SanitizeBonusSpecialFrameForRefill(runtime, frame, state)
{
	const type = ClampInt(frame, 0, CascadeSlot.frameCount - 1);
	if (!state || !IsBonusSpecialFrame(type)) return type;

	// If a Dragon is already pending/active on screen, new 9/10 frames during refill become normal frames.
	// This prevents 3x 9/10 from forming while Dragon is still going to activate round continuation.
	if (GetDragonCard(runtime))
		return GetAnyNormalReplacementFrame(runtime);

	// New refill rule after a prize:
	// - 9 and 10 may continue appearing normally until 3 identical frames are formed.
	// - when 3x 9 OR 3x 10 is formed, the special becomes pending;
	// - from that point onward, any future 9/10 becomes a normal 0..6 frame.
	// This allows normal prizes to finish before entering the special layout.
	const lockCount = Math.max(1, CascadeSlot.bonusSpecialLockCount || 3);

	if (CascadeSlot.pendingBonusSpecialFrame !== null || state.lockedFrame !== null)
		return GetAnyNormalReplacementFrame(runtime);

	if (type === CascadeSlot.blitzFrame)
	{
		state.blitzCount++;
		if (state.blitzCount >= lockCount)
		{
			state.lockedFrame = CascadeSlot.blitzFrame;
			RegisterPendingBonusSpecialFrame(CascadeSlot.blitzFrame);
		}
		return type;
	}

	state.bonusCount++;
	if (state.bonusCount >= lockCount)
	{
		state.lockedFrame = CascadeSlot.bonusFrame;
		RegisterPendingBonusSpecialFrame(CascadeSlot.bonusFrame);
	}

	return type;
}

function ResetPendingSpecialRoundState()
{
	CascadeSlot.pendingBonusSpecialFrame = null;
	CascadeSlot.waitingForSpecialLayoutReturn = false;
	CascadeSlot.specialLayoutWasVisited = false;
	CascadeSlot.resumeAfterSpecialStarted = false;
}

function RegisterPendingBonusSpecialFrame(frame)
{
	if (!IsBonusSpecialFrame(frame)) return;
	if (CascadeSlot.pendingBonusSpecialFrame === null)
		CascadeSlot.pendingBonusSpecialFrame = frame;
}

function HasPendingBonusSpecial()
{
	return IsBonusSpecialFrame(CascadeSlot.pendingBonusSpecialFrame);
}

function UpdatePendingBonusSpecialFromCurrentCards(runtime)
{
	if (HasPendingBonusSpecial()) return;

	const blitzCount = CountCardsByType(runtime, CascadeSlot.blitzFrame);
	const bonusCount = CountCardsByType(runtime, CascadeSlot.bonusFrame);
	const lockCount = Math.max(1, CascadeSlot.bonusSpecialLockCount || 3);

	// If both have >= lockCount, prioritize blitz (consistent with CreateBonusSpecialLimitStateFromCurrentCards)
	if (blitzCount >= lockCount && bonusCount >= lockCount)
	{
		RegisterPendingBonusSpecialFrame(CascadeSlot.blitzFrame);
		return;
	}

	if (blitzCount >= lockCount)
	{
		RegisterPendingBonusSpecialFrame(CascadeSlot.blitzFrame);
		return;
	}

	if (bonusCount >= lockCount)
		RegisterPendingBonusSpecialFrame(CascadeSlot.bonusFrame);
}

function TriggerPendingSpecialLayout(runtime)
{
	UpdatePendingBonusSpecialFromCurrentCards(runtime);

	const pendingFrame = CascadeSlot.pendingBonusSpecialFrame;
	if (!IsBonusSpecialFrame(pendingFrame)) return false;

	if (!IsServerResultActive(runtime))
		ReplaceDragonWithNormal(runtime);

	UpdateAllCardSpecialFlags(runtime);
	CascadeSlot.waitingForSpecialLayoutReturn = true;
	CascadeSlot.specialLayoutWasVisited = false;
	CascadeSlot.resumeAfterSpecialStarted = false;

	if (pendingFrame === CascadeSlot.blitzFrame)
	{
		SetGlobalNumber(runtime, "BlitzPremiation", 1);
		return true;
	}

	SetGlobalNumber(runtime, "BonusGame", 1);
	return true;
}

function IsBonusSpecialFrame(type)
{
	return type === CascadeSlot.blitzFrame || type === CascadeSlot.bonusFrame;
}

function EnforceSingleSpecialFramesInMatrix(runtime, framesByRow)
{
	let foundMultiplier = false;
	let foundDragon = false;

	ForEachFrameCell(framesByRow, (row, col, type) =>
	{
		if (type === CascadeSlot.multiplierFrame)
		{
			if (foundMultiplier) framesByRow[row][col] = GetSafeNormalReplacementFrame(runtime);
			else foundMultiplier = true;
		}
		else if (type === CascadeSlot.dragonFrame)
		{
			if (foundDragon) framesByRow[row][col] = GetSafeNormalReplacementFrame(runtime);
			else foundDragon = true;
		}
	});
}

function SyncColumnFramesFromMatrix(framesByRow, columnFrames)
{
	for (let col = 0; col < CascadeSlot.columns; col++)
		columnFrames[col] = [];

	for (let row = CascadeSlot.rows - 1; row >= 0; row--)
	{
		for (let col = 0; col < CascadeSlot.columns; col++)
		{
			const frame = ClampInt(framesByRow?.[row]?.[col] ?? 0, 0, CascadeSlot.frameCount - 1);
			columnFrames[col].push(frame);
		}
	}
}

function MatrixHasFrame(framesByRow, targetFrame)
{
	let found = false;
	ForEachFrameCell(framesByRow, (row, col, type) =>
	{
		if (type === targetFrame) found = true;
	});
	return found;
}

function CountFrameInMatrix(framesByRow, targetFrame)
{
	let count = 0;
	ForEachFrameCell(framesByRow, (row, col, type) =>
	{
		if (type === targetFrame) count++;
	});
	return count;
}

function ReplaceFrameInMatrix(runtime, framesByRow, targetFrame)
{
	ForEachFrameCell(framesByRow, (row, col, type) =>
	{
		if (type === targetFrame)
			framesByRow[row][col] = GetSafeNormalReplacementFrame(runtime);
	});
}

function GetSafeNormalReplacementFrame(runtime)
{
	return Math.floor(runtime.random() * 3);
}

function GetAnyNormalReplacementFrame(runtime)
{
	return Math.floor(runtime.random() * (CascadeSlot.prizeFrameMax + 1));
}

function ForEachFrameCell(framesByRow, callback)
{
	if (!Array.isArray(framesByRow)) return;

	for (let row = 0; row < CascadeSlot.rows; row++)
	{
		const rowFrames = framesByRow[row];
		if (!Array.isArray(rowFrames)) continue;

		for (let col = 0; col < CascadeSlot.columns; col++)
		{
			const type = ClampInt(rowFrames[col] ?? 0, 0, CascadeSlot.frameCount - 1);
			callback(row, col, type);
		}
	}
}

function ForEachFrameCellInDropOrder(framesByRow, callback)
{
	if (!Array.isArray(framesByRow)) return;

	for (let row = CascadeSlot.rows - 1; row >= 0; row--)
	{
		const rowFrames = framesByRow[row];
		if (!Array.isArray(rowFrames)) continue;

		for (let col = 0; col < CascadeSlot.columns; col++)
		{
			const type = ClampInt(rowFrames[col] ?? 0, 0, CascadeSlot.frameCount - 1);
			callback(row, col, type);
		}
	}
}

function FindWinningGroupsInFrameMatrix(framesByRow)
{
	const visited = new Set();
	const groups = [];

	for (let row = 0; row < CascadeSlot.rows; row++)
	{
		for (let col = 0; col < CascadeSlot.columns; col++)
		{
			const type = ClampInt(framesByRow?.[row]?.[col] ?? 0, 0, CascadeSlot.frameCount - 1);
			const startKey = GridKey(row, col);
			if (visited.has(startKey)) continue;

			// Only frames 0..6 are normal prizes. Frames 7, 8, 9, and 10 are special.
			if (type > CascadeSlot.prizeFrameMax) continue;

			const group = [];
			const stack = [{ row, col }];
			visited.add(startKey);

			while (stack.length)
			{
				const current = stack.pop();
				const currentType = ClampInt(framesByRow?.[current.row]?.[current.col] ?? 0, 0, CascadeSlot.frameCount - 1);
				if (currentType !== type) continue;

				group.push(current);

				const neighbours = [
					{ row: current.row, col: current.col - 1 },
					{ row: current.row, col: current.col + 1 },
					{ row: current.row - 1, col: current.col },
					{ row: current.row + 1, col: current.col }
				];

				for (const n of neighbours)
				{
					if (n.row < 0 || n.row >= CascadeSlot.rows || n.col < 0 || n.col >= CascadeSlot.columns)
						continue;

					const key = GridKey(n.row, n.col);
					if (visited.has(key)) continue;

					const nextType = ClampInt(framesByRow?.[n.row]?.[n.col] ?? 0, 0, CascadeSlot.frameCount - 1);
					if (nextType !== type) continue;

					visited.add(key);
					stack.push(n);
				}
			}

			if (group.length >= 3)
				groups.push({ type, cells: group });
		}
	}

	return groups;
}

function BuildSpecialColumnsFromFrames(columnFrames)
{
	const useSpecialByColumn = [];
	let blitzCount = 0;
	let bonusCount = 0;
	const triggerCount = Math.max(1, CascadeSlot.specialCascadeTriggerCount || 2);
	const lockCount = Math.max(triggerCount + 1, CascadeSlot.bonusSpecialLockCount || 3);
	let lockedType = null; // Track which type has been locked

	for (let col = 0; col < CascadeSlot.columns; col++)
	{
		// The special reel continues to start when there are already 2 IDENTICAL special frames
		// in previous columns. Frame 9 and frame 10 continue to be counted separately.
		// New rule: after the 3rd matching special has already appeared, subsequent columns
		// return to the normal drop because the bonus/special layout is already guaranteed.
		const waitingThirdBlitz = lockedType === null && blitzCount >= triggerCount && blitzCount < lockCount;
		const waitingThirdBonus = lockedType === null && bonusCount >= triggerCount && bonusCount < lockCount;
		useSpecialByColumn[col] = waitingThirdBlitz || waitingThirdBonus;

		const frames = columnFrames[col] || [];
		for (const frame of frames)
		{
			const type = Math.round(Number(frame) || 0);
			if (type === CascadeSlot.blitzFrame) blitzCount++;
			else if (type === CascadeSlot.bonusFrame) bonusCount++;
		}

		// Check if this column completes a triple for either type
		if (lockedType === null)
		{
			if (blitzCount >= lockCount)
				lockedType = CascadeSlot.blitzFrame;
			else if (bonusCount >= lockCount)
				lockedType = CascadeSlot.bonusFrame;
		}
	}

	return useSpecialByColumn;
}

async function CreateAndDropFinalColumnCards(runtime, specs, layerName, width, height, duration, delayStep)
{
	const items = [];
	let localOrder = 0;

	for (const spec of specs.slice().sort((a, b) => b.row - a.row))
	{
		const card = CreateCard(runtime, layerName, spec.targetX, spec.spawnY, width, height, spec.col, spec.row, spec.frame);
		items.push({
			inst: card,
			x: spec.targetX,
			y: spec.targetY,
			delay: localOrder * delayStep,
			playStopSound: true
		});
		localOrder++;
	}

	await AnimateMany(runtime, items, duration, EaseOutBackSoft);
}

async function CreateAndDropExtendedSpecialColumn(runtime, specs, layerName, width, height, duration, delayStep)
{
	const orderedFinalSpecs = specs.slice().sort((a, b) => b.row - a.row);
	if (!orderedFinalSpecs.length) return;

	const col = orderedFinalSpecs[0].col;
	const x = GridToX(col);
	const spawnY = CascadeSlot.startY - CascadeSlot.cellH * 1.35;
	const exitY = CascadeSlot.startY + CascadeSlot.rows * CascadeSlot.cellH + CascadeSlot.cellH * 1.35;
	const extraCount = Math.max(0, Math.floor(CascadeSlot.specialCascadeExtraFrameCount || 0));
	const queue = [];
	let localOrder = 0;

	// First, the 50 extra visual frames pass through.
	// They are only a drop effect: they do not enter the grid and do not consume GameResult.
	for (let i = 0; i < extraCount; i++)
	{
		const frame = GetRandomSpecialExtraFrame(runtime);
		queue.push({
			fromX: x,
			fromY: spawnY,
			toX: x,
			toY: exitY,
			delay: localOrder * delayStep,
			destroyAfter: true,
			create: () => CreateCard(runtime, layerName, x, spawnY, width, height, col, -100 - i, frame)
		});
		localOrder++;
	}

	// Then the final frames already defined by the result enter.
	// This makes the special column stop exactly on the drawn/predefined result.
	for (const spec of orderedFinalSpecs)
	{
		queue.push({
			fromX: spec.targetX,
			fromY: spec.spawnY,
			toX: spec.targetX,
			toY: spec.targetY,
			delay: localOrder * delayStep,
			destroyAfter: false,
			playStopSound: true,
			create: () => CreateCard(runtime, layerName, spec.targetX, spec.spawnY, width, height, spec.col, spec.row, spec.frame)
		});
		localOrder++;
	}

	await AnimateQueuedSpecialCards(runtime, queue, duration, EaseOutBackSoft);
}

function AnimateQueuedSpecialCards(runtime, queue, duration, easingFn)
{
	return new Promise(resolve =>
	{
		if (!queue.length || duration <= 0)
		{
			for (const item of queue)
			{
				const inst = item.create();
				inst.setPosition(item.toX, item.toY);
				if (item.playStopSound && !item.destroyAfter)
					PlayCardStopSoundIfNeeded(runtime, { inst, playStopSound: true });
				if (item.destroyAfter && !inst.isDestroyed) inst.destroy();
			}
			resolve();
			return;
		}

		let elapsed = 0;
		const tick = () =>
		{
			elapsed += runtime.dt;
			let allDone = true;

			for (const item of queue)
			{
				if (item.done) continue;

				const localTime = elapsed - (item.delay || 0);
				if (localTime < 0)
				{
					allDone = false;
					continue;
				}

				if (!item.inst)
				{
					item.inst = item.create();
					item.inst.setPosition(item.fromX, item.fromY);
				}

				if (item.inst.isDestroyed)
				{
					item.done = true;
					continue;
				}

				const t = Math.min(localTime / duration, 1);
				const eased = easingFn ? easingFn(t) : t;
				item.inst.setPosition(Lerp(item.fromX, item.toX, eased), Lerp(item.fromY, item.toY, eased));

				if (t >= 1)
				{
					if (item.playStopSound && !item.destroyAfter)
						PlayCardStopSoundIfNeeded(runtime, { inst: item.inst, playStopSound: true });
					if (item.destroyAfter && !item.inst.isDestroyed) item.inst.destroy();
					item.done = true;
				}
				else
				{
					allDone = false;
				}
			}

			if (allDone)
			{
				runtime.removeEventListener("tick", tick);
				resolve();
			}
		};

		runtime.addEventListener("tick", tick);
	});
}

function GetRandomSpecialExtraFrame(runtime)
{
	let minFrame = ClampInt(CascadeSlot.specialCascadeExtraFrameMin, 0, CascadeSlot.prizeFrameMax);
	let maxFrame = ClampInt(CascadeSlot.specialCascadeExtraFrameMax, 0, CascadeSlot.prizeFrameMax);
	if (maxFrame < minFrame)
	{
		const temp = minFrame;
		minFrame = maxFrame;
		maxFrame = temp;
	}

	return minFrame + Math.floor(runtime.random() * (maxFrame - minFrame + 1));
}

function CreateCard(runtime, layerName, x, y, width, height, gridX, gridY, frame)
{
	const card = runtime.objects.OBJ_Cards.createInstance(layerName, x, y);
	card.width = width;
	card.height = height;
	card.instVars.gridX = gridX;
	card.instVars.gridY = gridY;
	card.instVars.type = frame;
	card.instVars.animate = 0;
	card.instVars.animateMultiplicador = 0;
	card.instVars.frameDragon = 0;
	card.instVars.FrameBlitz = 0;
	card.instVars.FrameBonus = 0;
	SetCardSoundEffect(card, 0);
	card.setAnimation(CascadeSlot.animationName, "beginning");
	card.animationFrame = frame;
	card.stopAnimation();
	UpdateCardSpecialFlags(card);
	card.moveToTop();
	return card;
}

function BuildGrid(runtime)
{
	const grid = [];
	for (let row = 0; row < CascadeSlot.rows; row++)
	{
		grid.push(new Array(CascadeSlot.columns).fill(null));
	}

	for (const card of GetCards(runtime))
	{
		if (card.isDestroyed) continue;
		const col = Math.round(card.instVars.gridX);
		const row = Math.round(card.instVars.gridY);
		if (row >= 0 && row < CascadeSlot.rows && col >= 0 && col < CascadeSlot.columns)
		{
			grid[row][col] = card;
		}
	}

	return grid;
}

function SnapAllCardsToGrid(runtime)
{
	for (const card of GetCards(runtime))
	{
		if (card.isDestroyed) continue;
		const col = Math.round(card.instVars.gridX);
		const row = Math.round(card.instVars.gridY);
		card.instVars.gridX = col;
		card.instVars.gridY = row;
		card.instVars.type = card.animationFrame || card.instVars.type || 0;
		UpdateCardSpecialFlags(card);
		card.setPosition(GridToX(col), GridToY(row));
	}
}

function PointerIsOnSpinButton(runtime, ev)
{
	const buttonType = runtime.objects[CascadeSlot.buttonObjectName];
	if (!buttonType) return false;

	const buttons = buttonType.getAllInstances ? buttonType.getAllInstances() : [];
	if (!buttons.length) return false;

	for (const button of buttons)
	{
		const layer = button.layer;
		let lx = ev.clientX;
		let ly = ev.clientY;
		if (layer && layer.cssPxToLayer)
			[lx, ly] = layer.cssPxToLayer(ev.clientX, ev.clientY);

		// First use Construct's real hit test, respecting sprite collision/polygon shape.
		if (button.containsPoint && button.containsPoint(lx, ly))
			return true;

		// Fallback only if containsPoint does not exist.
		// Corrected for the Sprite's centered origin; previously button.x/button.y was treated as the top-left corner,
		// creating a false clickable area below and to the right of the button.
		if (!button.containsPoint)
		{
			const left = button.x - button.width * 0.5;
			const top = button.y - button.height * 0.5;
			const right = button.x + button.width * 0.5;
			const bottom = button.y + button.height * 0.5;
			if (lx >= left && lx <= right && ly >= top && ly <= bottom)
				return true;
		}
	}

	return false;
}

function AnimateMany(runtime, items, duration, easingFn)
{
	return new Promise(resolve =>
	{
		if (!items.length || duration <= 0)
		{
			for (const item of items)
			{
				SetCardSoundEffect(item.inst, 0);
				item.inst.setPosition(item.x, item.y);
				PlayCardStopSoundIfNeeded(runtime, item);
			}
			resolve();
			return;
		}

		for (const item of items)
		{
			// Before a drop/movement starts, reset the local trigger.
			// It returns to 1 at the exact stop moment if the item is allowed to trigger it.
			if (item && item.inst && !item.inst.isDestroyed)
				SetCardSoundEffect(item.inst, 0);
		}

		const starts = items.map(item => ({
			inst: item.inst,
			fromX: item.inst.x,
			fromY: item.inst.y,
			toX: item.x,
			toY: item.y,
			delay: item.delay || 0,
			playStopSound: !!item.playStopSound,
			stopSoundPlayed: false
		}));

		let elapsed = 0;
		const tick = () =>
		{
			elapsed += runtime.dt;
			let allDone = true;

			for (const s of starts)
			{
				if (s.inst.isDestroyed) continue;

				const localTime = elapsed - s.delay;
				if (localTime < 0)
				{
					allDone = false;
					continue;
				}

				const t = Math.min(localTime / duration, 1);
				const eased = easingFn ? easingFn(t) : t;
				s.inst.setPosition(Lerp(s.fromX, s.toX, eased), Lerp(s.fromY, s.toY, eased));

				if (t >= 1 && s.playStopSound && !s.stopSoundPlayed)
				{
					PlayCardStopSoundIfNeeded(runtime, s);
					s.stopSoundPlayed = true;
				}

				if (t < 1) allDone = false;
			}

			if (allDone)
			{
				runtime.removeEventListener("tick", tick);
				resolve();
			}
		};

		runtime.addEventListener("tick", tick);
	});
}

function AnimateScaleToZero(runtime, items, duration, easingFn)
{
	return new Promise(resolve =>
	{
		if (!items.length || duration <= 0)
		{
			resolve();
			return;
		}

		const starts = items.map(inst => ({
			inst,
			x: inst.x,
			y: inst.y,
			w: inst.width,
			h: inst.height
		}));

		let elapsed = 0;
		const tick = () =>
		{
			elapsed += runtime.dt;
			const t = Math.min(elapsed / duration, 1);
			const eased = easingFn ? easingFn(t) : t;
			const scale = Math.max(0, 1 - eased);

			for (const s of starts)
			{
				if (s.inst.isDestroyed) continue;
				s.inst.setPosition(s.x, s.y);
				s.inst.width = s.w * scale;
				s.inst.height = s.h * scale;
			}

			if (t >= 1)
			{
				runtime.removeEventListener("tick", tick);
				resolve();
			}
		};

		runtime.addEventListener("tick", tick);
	});
}

function WaitSeconds(runtime, seconds)
{
	return new Promise(resolve =>
	{
		let elapsed = 0;
		const tick = () =>
		{
			elapsed += runtime.dt;
			if (elapsed >= seconds)
			{
				runtime.removeEventListener("tick", tick);
				resolve();
			}
		};
		runtime.addEventListener("tick", tick);
	});
}

function WaitGlobalVarValue(runtime, varName, targetValue, timeoutSeconds = 30)
{
	return new Promise(resolve =>
	{
		let elapsed = 0;

		const tick = () =>
		{
			elapsed += runtime.dt;

			if (GetGlobalNumber(runtime, varName, null) === targetValue || elapsed >= timeoutSeconds)
			{
				runtime.removeEventListener("tick", tick);
				resolve();
			}
		};

		runtime.addEventListener("tick", tick);
	});
}

function EnsureGameMoneyVariables(runtime)
{
	if (!runtime.globalVars) return;
	if (typeof runtime.globalVars.IsProcessing !== "number") runtime.globalVars.IsProcessing = 0;
	if (typeof runtime.globalVars.BetAmount !== "number") runtime.globalVars.BetAmount = 0.10;
	if (typeof runtime.globalVars.Balance !== "number") runtime.globalVars.Balance = 100;
	if (typeof runtime.globalVars.RoundWin !== "number") runtime.globalVars.RoundWin = 0;
	if (typeof runtime.globalVars.TotalWinnings !== "number") runtime.globalVars.TotalWinnings = 0;
	if (typeof runtime.globalVars.BonusWinnings !== "number") runtime.globalVars.BonusWinnings = 0;
	if (typeof runtime.globalVars.WinningCardsAnimation !== "number") runtime.globalVars.WinningCardsAnimation = 0;
	if (typeof runtime.globalVars.RoundWinAnimation !== "number") runtime.globalVars.RoundWinAnimation = 0;
	if (typeof runtime.globalVars.ExitType !== "number") runtime.globalVars.ExitType = 0;
	if (typeof runtime.globalVars.AnimateMultiplier !== "number") runtime.globalVars.AnimateMultiplier = 0;
	if (typeof runtime.globalVars.MultiplierValue !== "number") runtime.globalVars.MultiplierValue = 1;
	if (typeof runtime.globalVars.DragonBlaze !== "number") runtime.globalVars.DragonBlaze = 0;
	if (typeof runtime.globalVars.BlitzPremiation !== "number") runtime.globalVars.BlitzPremiation = 0;
	if (typeof runtime.globalVars.BonusGame !== "number") runtime.globalVars.BonusGame = 0;
	if (typeof runtime.globalVars.SpecialRound !== "number") runtime.globalVars.SpecialRound = 0;
	if (typeof runtime.globalVars.SpecialRoundFinished !== "number") runtime.globalVars.SpecialRoundFinished = 0;
	if (typeof runtime.globalVars.ControlledResultEnabled !== "number") runtime.globalVars.ControlledResultEnabled = 0;
	if (typeof runtime.globalVars.RandomDifficulty !== "number") runtime.globalVars.RandomDifficulty = CascadeSlot.defaultRandomDifficulty;
	if (typeof runtime.globalVars.Loading !== "number") runtime.globalVars.Loading = 0;
	if (typeof runtime.globalVars.CommonCardSoundCount !== "number") runtime.globalVars.CommonCardSoundCount = 0;
	if (typeof runtime.globalVars.SpecialCardSoundCount !== "number") runtime.globalVars.SpecialCardSoundCount = 0;
	if (runtime.globalVars.GameResult === undefined) runtime.globalVars.GameResult = "";
	if (runtime.globalVars.BlitzResult === undefined) runtime.globalVars.BlitzResult = "";
	if (runtime.globalVars.BonusResult === undefined) runtime.globalVars.BonusResult = "";
}

function GetGlobalNumber(runtime, name, fallback = 0)
{
	if (!runtime.globalVars || runtime.globalVars[name] === undefined) return fallback;
	const value = Number(runtime.globalVars[name]);
	return Number.isFinite(value) ? value : fallback;
}

function SetGlobalNumber(runtime, name, value)
{
	if (!runtime.globalVars) return;
	const v = Number(value) || 0;
	runtime.globalVars[name] = v;
}

function GetGlobalString(runtime, name, fallback = "")
{
	if (!runtime.globalVars || runtime.globalVars[name] === undefined) return fallback;
	return String(runtime.globalVars[name] ?? fallback);
}

function SetGlobalString(runtime, name, value)
{
	if (!runtime.globalVars) return;
	runtime.globalVars[name] = String(value ?? "");
}

function GetMoney(runtime)
{
	// The current Event Sheet uses the canonical global variable "Balance".
	return GetGlobalNumber(runtime, "Balance", 100);
}

function SetMoney(runtime, value)
{
	const v = Number(value) || 0;
	SetGlobalNumber(runtime, "Balance", v);
}

function FormatWinningsText(runtime)
{
	// If TotalWinnings is zero, leave SF_Winnings completely empty.
	// This prevents the visual text from remaining stuck at "$0.00" at startup or between rounds.
	const winningsValue = GetGlobalNumber(runtime, "TotalWinnings", 0);
	return winningsValue > 0 ? "$" + FormatMoney(winningsValue) : "";
}

function UpdateMoneyTexts(runtime)
{
	// Always format using the US dollar standard: $71,050.00, $0.10, $2.50.
	// This function is called by JS at the main round checkpoints.
	const moneyText = "$" + FormatMoney(GetMoney(runtime));
	const winningsText = FormatWinningsText(runtime);
	SetObjectText(runtime, "SF_Money", moneyText);
	SetObjectText(runtime, "SF_Winnings", winningsText);
	CascadeSlot.lastMoneyText = moneyText;
	CascadeSlot.lastWinningsText = winningsText;
}

function AutoRefreshMoneyTexts(runtime)
{
	// The Event Sheet also changes Balance/TotalWinnings during some animations.
	// Therefore this lightweight refresh runs every tick and only writes to the text objects if the formatted value changed
	// OR if the text object still contains the layout's initial value.
	// This ensures the balance appears as soon as the game starts, even if the layout creates SF_Money
	// after the first UpdateMoneyTexts() call made in beforeprojectstart.
	const moneyText = "$" + FormatMoney(GetMoney(runtime));
	const winningsText = FormatWinningsText(runtime);

	if (moneyText !== CascadeSlot.lastMoneyText || ObjectTextNeedsUpdate(runtime, "SF_Money", moneyText))
	{
		SetObjectText(runtime, "SF_Money", moneyText);
		CascadeSlot.lastMoneyText = moneyText;
	}

	if (winningsText !== CascadeSlot.lastWinningsText || ObjectTextNeedsUpdate(runtime, "SF_Winnings", winningsText))
	{
		SetObjectText(runtime, "SF_Winnings", winningsText);
		CascadeSlot.lastWinningsText = winningsText;
	}

	WatchForSpecialLayoutReturn(runtime);
}

function WatchForSpecialLayoutReturn(runtime) {
  if (!CascadeSlot.waitingForSpecialLayoutReturn) return;

  const layoutName = runtime?.layout?.name || "";

  const isMainGameLayout =
    layoutName === "Game Port" || layoutName === "Game Land";

  const isSpecialLayout =
    layoutName === "BlitzGame Port" ||
    layoutName === "BlitzGame Land" ||
    layoutName === "BonusGame Port" ||
    layoutName === "BonusGame Land";

  // Confirms that a special layout was actually entered.
  if (isSpecialLayout) {
    CascadeSlot.specialLayoutWasVisited = true;
    return;
  }

  // Do not continue while the game has not yet returned to the main layout.
  if (!isMainGameLayout) return;

  // Continue only after the special layout was actually visited.
  if (
    !CascadeSlot.specialLayoutWasVisited ||
    CascadeSlot.resumeAfterSpecialStarted
  )
    return;

  CascadeSlot.resumeAfterSpecialStarted = true;

  void ContinueRoundAfterSpecialLayout(runtime);
}

async function ContinueRoundAfterSpecialLayout(runtime)
{
	try
	{
		CascadeSlot.processing = true;
		SetGlobalNumber(runtime, "IsProcessing", 1);

		// Wait one short tick so the Game layout Event Sheet can restore Array/copy
		// and place the saved frames back in their correct positions.
		await WaitSeconds(runtime, 0.05);
		InitialiseGrid(runtime);
		UpdateAllCardSpecialFlags(runtime);

		MergeMoneyBonusIntoWinnings(runtime);
		UpdateMoneyTexts(runtime);

		await FinishRoundPayout(runtime);
	}
	catch (err)
	{
		console.error("Error while resuming the round after the special layout.", err);
	}
	finally
	{
		CascadeSlot.pendingBonusSpecialFrame = null;
		CascadeSlot.waitingForSpecialLayoutReturn = false;
		CascadeSlot.specialLayoutWasVisited = false;
		CascadeSlot.resumeAfterSpecialStarted = false;
		CascadeSlot.processing = false;
		CascadeSlot.buttonClickWaiting = false;
		SetGlobalNumber(runtime, "BlitzPremiation", 0);
		SetGlobalNumber(runtime, "BonusGame", 0);
		SetGlobalNumber(runtime, "IsProcessing", 0);
		UpdateMoneyTexts(runtime);
	}
}

function MergeMoneyBonusIntoWinnings(runtime)
{
	const bonusPrize = Round2(GetGlobalNumber(runtime, "BonusWinnings", 0));
	if (bonusPrize <= 0) return;

	const currentWinnings = Round2(GetGlobalNumber(runtime, "TotalWinnings", 0));
	SetGlobalNumber(runtime, "TotalWinnings", Round2(currentWinnings + bonusPrize));
	SetGlobalNumber(runtime, "RoundWin", bonusPrize);
	SetGlobalNumber(runtime, "BonusWinnings", 0);
}

function ObjectTextNeedsUpdate(runtime, objectName, text)
{
	const objectType = runtime.objects[objectName];
	if (!objectType || !objectType.getAllInstances) return false;

	const expectedText = String(text);
	const instances = objectType.getAllInstances();
	if (!instances.length) return false;

	return instances.some(inst => "text" in inst && inst.text !== expectedText);
}

function SetObjectText(runtime, objectName, text)
{
	const objectType = runtime.objects[objectName];
	if (!objectType || !objectType.getAllInstances) return;
	for (const inst of objectType.getAllInstances())
	{
		if ("text" in inst) inst.text = String(text);
	}
}

function SetObjectVisibility(runtime, objectName, visible)
{
	const objectType = runtime.objects[objectName];
	if (!objectType || !objectType.getAllInstances) return;
	for (const inst of objectType.getAllInstances())
	{
		if ("isVisible" in inst) inst.isVisible = visible;
	}
}

function GetCards(runtime)
{
	return runtime.objects.OBJ_Cards ? runtime.objects.OBJ_Cards.getAllInstances() : [];
}

function GetExitY(runtime)
{
	const layoutHeight = runtime.layout && runtime.layout.height ? runtime.layout.height : 0;
	const boardBottom = CascadeSlot.startY + CascadeSlot.rows * CascadeSlot.cellH;
	return Math.max(layoutHeight, boardBottom) + CascadeSlot.cellH * 1.5;
}


function PlayCardStopSoundIfNeeded(runtime, item)
{
	// Card stop sound/effect:
	// - runs only on items marked with playStopSound;
	// - during refill, only newly created frames receive playStopSound=true;
	// - existing cards that only move down during refill receive playStopSound=false;
	// - the 50 visual frames in the special queue do NOT play sounds because they are destroyed and never stop on the grid;
	// - the special sound is used only for frames 9 and 10; all others use the normal sound;
	// - Soundeffect becomes 1 on the same tick the card reaches its destination.
	if (!runtime || !item || !item.playStopSound || !item.inst || item.inst.isDestroyed) return;

	SetCardSoundEffect(item.inst, 1);

	const frame = Math.round(Number(item.inst.instVars?.type ?? item.inst.animationFrame ?? 0) || 0);
	PlayCardStopSoundByFrame(runtime, frame);
}

function SetCardSoundEffect(card, value)
{
	if (!card || !card.instVars) return;
	const varName = CascadeSlot.cardStopEffectVar || "Soundeffect";
	if (card.instVars[varName] !== undefined)
		card.instVars[varName] = value;
}

function PlayCardStopSoundByFrame(runtime, frame)
{
	// Uses the same audio control as the Event Sheet.
	// MusicActive = 1: audio enabled | MusicActive = 0: audio disabled.
	// The check happens before direct AudioContext playback and before the fallback,
	// which also prevents sounds from accumulating and playing when audio is re-enabled.
	if (GetGlobalNumber(runtime, "MusicActive", 0) !== 1) return;

	const isSpecialSound = IsSpecialCardStopSoundFrame(frame);
	const soundName = isSpecialSound
		? CascadeSlot.specialCardStopSoundName
		: CascadeSlot.commonCardStopSoundName;

	// First try to play immediately through Construct's own AudioContext.
	// This avoids waiting for the next Event Sheet tick.
	if (PlaySfxImmediately(runtime, soundName)) return;

	// Safety fallback: if the project is running in a Worker or the buffer has not loaded yet,
	// use the legacy Event Sheet queue so the stop sound is not lost.
	const counterName = isSpecialSound
		? CascadeSlot.specialCardStopSoundCounterVar
		: CascadeSlot.commonCardStopSoundCounterVar;
	IncrementGlobalCounter(runtime, counterName, 1);
}

function IsSpecialCardStopSoundFrame(frame)
{
	const value = Math.round(Number(frame) || 0);
	return Array.isArray(CascadeSlot.specialCardStopSoundFrames)
		&& CascadeSlot.specialCardStopSoundFrames.includes(value);
}

function PlaySfxImmediately(runtime, soundName)
{
	try
	{
		const audioObject = runtime?.objects?.Audio;
		const audioContext = audioObject?.audioContext;
		const destination = audioObject?.destinationNode || audioContext?.destination;
		if (!audioContext || !destination || !soundName)
		{
			void LoadSfxBuffer(runtime, soundName);
			return false;
		}

		const buffer = CascadeSlot.sfxBuffers.get(soundName);
		if (!buffer)
		{
			void LoadSfxBuffer(runtime, soundName);
			return false;
		}

		const source = audioContext.createBufferSource();
		source.buffer = buffer;
		source.connect(destination);
		source.start(audioContext.currentTime);
		return true;
	}
	catch (err)
	{
		console.warn("Falha ao tocar SFX direto no JS; usando fallback do Event Sheet.", err);
		return false;
	}
}

async function PreloadCardStopSounds(runtime)
{
	await Promise.all([
		LoadSfxBuffer(runtime, CascadeSlot.commonCardStopSoundName),
		LoadSfxBuffer(runtime, CascadeSlot.specialCardStopSoundName)
	]);
}

async function LoadSfxBuffer(runtime, soundName)
{
	if (!runtime || !soundName) return null;
	if (CascadeSlot.sfxBuffers.has(soundName)) return CascadeSlot.sfxBuffers.get(soundName);
	if (CascadeSlot.sfxBufferPromises.has(soundName)) return CascadeSlot.sfxBufferPromises.get(soundName);

	const promise = (async () =>
	{
		const audioObject = runtime?.objects?.Audio;
		const audioContext = audioObject?.audioContext;
		if (!audioContext || !runtime.assets?.getMediaFileUrl) return null;

		const candidates = [
			`${soundName}.webm`,
			`sounds/${soundName}.webm`,
			`${soundName}.ogg`,
			`sounds/${soundName}.ogg`,
			`${soundName}.m4a`,
			`sounds/${soundName}.m4a`
		];

		let lastError = null;
		for (const fileName of candidates)
		{
			try
			{
				const url = await runtime.assets.getMediaFileUrl(fileName);
				const arrayBuffer = await runtime.assets.fetchArrayBuffer(url);
				const buffer = await audioContext.decodeAudioData(arrayBuffer);
				CascadeSlot.sfxBuffers.set(soundName, buffer);
				return buffer;
			}
			catch (err)
			{
				lastError = err;
			}
		}

		console.warn(`Unable to load SFX "${soundName}" for direct JS playback.`, lastError);
		return null;
	})();

	CascadeSlot.sfxBufferPromises.set(soundName, promise);
	return promise;
}

function IncrementGlobalCounter(runtime, name, amount = 1)
{
	if (!runtime || !runtime.globalVars || !name) return;
	const current = Number(runtime.globalVars[name]);
	runtime.globalVars[name] = (Number.isFinite(current) ? current : 0) + amount;
}

function CreateMissingServerResultError(message)
{
	const err = new Error(message);
	err.missingServerResult = true;
	return err;
}

function IsMissingServerResultError(err)
{
	return !!err && err.missingServerResult === true;
}

async function HandleMissingServerResult(runtime, bet)
{
	// CONTROLLED-RESULT ERROR:
	// 1) Loading = 2 indicates that GameResult did not arrive or ended incomplete.
	// 2) Wait serverResultLoading2ResetDelay seconds.
	// 3) Reset the round and refund exactly the bet deducted at the start of the spin.
	// To change the timings, edit serverResultWaitBeforeLoading2 and
	// serverResultLoading2ResetDelay in the CascadeSlot object near the top of this file.
	SetGlobalNumber(runtime, "Loading", 2);
	await WaitSeconds(runtime, CascadeSlot.serverResultLoading2ResetDelay);

	ClearBoardCards(runtime);
	CascadeSlot.resultQueue = [];
	CascadeSlot.usingServerResult = false;
	SetGlobalString(runtime, "GameResult", "");

	SetGlobalNumber(runtime, "RoundWin", 0);
	SetGlobalNumber(runtime, "TotalWinnings", 0);
	SetGlobalNumber(runtime, "BonusWinnings", 0);
	SetGlobalNumber(runtime, "WinningCardsAnimation", 0);
	SetGlobalNumber(runtime, "RoundWinAnimation", 0);
	SetGlobalNumber(runtime, "AnimateMultiplier", 0);
	SetGlobalNumber(runtime, "MultiplierValue", 1);
	SetGlobalNumber(runtime, "DragonBlaze", 0);
	SetGlobalNumber(runtime, "BlitzPremiation", 0);
	SetGlobalNumber(runtime, "BonusGame", 0);

	SetMoney(runtime, Round2(GetMoney(runtime) + bet));
	SetGlobalNumber(runtime, "Loading", 0);
	UpdateMoneyTexts(runtime);
}

function ClearBoardCards(runtime)
{
	for (const card of GetCards(runtime))
	{
		if (!card.isDestroyed) card.destroy();
	}
}

function IsServerResultActive(runtime)
{
	return GetGlobalNumber(runtime, "ControlledResultEnabled", 0) === 1;
}

async function EnsureServerResultReady(runtime)
{
	if (!IsServerResultActive(runtime))
	{
		CascadeSlot.usingServerResult = false;
		CascadeSlot.resultQueue = [];
		SetGlobalNumber(runtime, "Loading", 0);
		return true;
	}

	CascadeSlot.usingServerResult = true;

	// Loading = 1 while the game waits for the server/dev to fill GameResult.
	// The screen is already empty, so cards begin entering only after this wait ends.
	SetGlobalNumber(runtime, "Loading", 1);

	let safetySeconds = 0;
	while (IsServerResultActive(runtime) && CascadeSlot.resultQueue.length === 0 && GetGlobalString(runtime, "GameResult", "").trim() === "")
	{
		await WaitSeconds(runtime, 0.05);
		safetySeconds += 0.05;

		// IMPORTANT: ControlledResultEnabled = 1 must never fall back to a random result.
		// If GameResult remains empty for serverResultWaitBeforeLoading2 seconds,
		// the round enters a controlled error state: Loading = 2, then resets and refunds the bet.
		// To change the timing, edit CascadeSlot.serverResultWaitBeforeLoading2 near the top of the file.
		if (safetySeconds >= CascadeSlot.serverResultWaitBeforeLoading2)
		{
			console.warn("ControlledResultEnabled is enabled, but GameResult is empty. The round will reset without a random draw.");
			return false;
		}
	}

	LoadResultQueueFromGlobal(runtime);
	SetGlobalNumber(runtime, "Loading", 0);
	return true;
}

function LoadResultQueueFromGlobal(runtime)
{
	const raw = GetGlobalString(runtime, "GameResult", "").trim();
	if (!raw) return;

	CascadeSlot.resultQueue = raw
		.split(",")
		.map(v => Number(String(v).trim()))
		.filter(v => Number.isFinite(v))
		.map(v => ClampInt(v, 0, CascadeSlot.frameCount - 1));
}

function GetNextFrame(runtime, gridX = null, gridY = null)
{
	if (!IsServerResultActive(runtime))
		return RandomFrame(runtime, gridX, gridY);

	// If the local queue is empty, try to reload it from the current GameResult text.
	// This allows the server/dev to populate the variable before the spin begins.
	if (CascadeSlot.resultQueue.length === 0)
		LoadResultQueueFromGlobal(runtime);

	if (CascadeSlot.resultQueue.length > 0)
	{
		const frame = CascadeSlot.resultQueue.shift();

		// Remove the consumed frame from the global variable so Construct visibly shows
		// which frames still remain to be used in the round/cascades.
		SetGlobalString(runtime, "GameResult", CascadeSlot.resultQueue.join(","));
		return ClampInt(frame, 0, CascadeSlot.frameCount - 1);
	}

	// If GameResult runs out before all required cards are filled,
	// do NOT use a random result. The round is cancelled and the bet is refunded.
	throw CreateMissingServerResultError("GameResult ended before the round was complete. The round was cancelled without a random draw.");
}

function RandomFrame(runtime, gridX = null, gridY = null)
{
	// This random draw is used only when ControlledResultEnabled = 0.
	// When ControlledResultEnabled = 1, the frame comes from GameResult and this function does not control the result.
	//
	// RandomDifficulty controls how strongly the game avoids accidental prizes:
	// 0 = easier/looser: more high frames and a greater chance of groups forming naturally.
	// 1 = normal.
	// 2 = hard: high-paying frames appear less often and the game avoids 3+ groups more aggressively.
	// 3 = very hard: high-paying frames and accidental groups become very rare.
	const difficulty = ClampInt(GetGlobalNumber(runtime, "RandomDifficulty", CascadeSlot.defaultRandomDifficulty), 0, 3);

	// First try to draw special cards 7, 8, 9, and 10 with a chance reduced according to difficulty.
	// Multiplier and Dragon remain limited to 1 on screen.
	const specialFrame = TryRandomSpecialFrame(runtime, difficulty);
	if (specialFrame !== null)
		return specialFrame;

	// Then draw normal symbols 0..6 using weights.
	// Frames 4, 5, and 6 pay more, so they receive lower weights, especially at higher difficulties.
	return RandomPrizeFrameWithDifficulty(runtime, gridX, gridY, difficulty);
}

function TryRandomSpecialFrame(runtime, difficulty)
{
	const hasMultiplier = GetMultiplierCard(runtime) !== null;
	const hasDragon = GetDragonCard(runtime) !== null;

	// At higher difficulty, special cards appear less often in random mode.
	// In server mode these chances do not matter because the developer defines the frames in GameResult.
	const specialScale = [1.15, 1.0, 0.70, 0.45][difficulty] ?? 0.70;
	const r = runtime.random();
	let cursor = 0;

	if (!hasMultiplier && (!hasDragon || CascadeSlot.dragonFreeRoundActive))
	{
		cursor += CascadeSlot.multiplierSpawnChance * specialScale;
		if (r < cursor) return CascadeSlot.multiplierFrame;
	}

	if (!hasDragon && !hasMultiplier)
	{
		cursor += CascadeSlot.dragonSpawnChance * specialScale;
		if (r < cursor) return CascadeSlot.dragonFrame;
	}

	cursor += CascadeSlot.blitzSpawnChance * specialScale;
	if (r < cursor) return CascadeSlot.blitzFrame;

	cursor += CascadeSlot.bonusSpawnChance * specialScale;
	if (r < cursor) return CascadeSlot.bonusFrame;

	return null;
}

function RandomPrizeFrameWithDifficulty(runtime, gridX, gridY, difficulty)
{
	// Weights for normal frames 0..6 by difficulty.
	// The higher the weight, the greater the chance that frame is selected.
	// Higher frames pay more, so they become progressively rarer.
	const weightTable = [
		[10, 10, 10, 8, 7, 6, 5],      // 0 = easiest
		[10, 10, 10, 8, 7, 6, 5],       // 1 = normal
		[10, 10, 10, 8, 7, 6, 5],     // 2 = hard
		[10, 10, 10, 8, 7, 6, 5]     // 3 = very hard
	];

	// Chance to reject a frame if it immediately forms a connected group of 3+.
	// This does not block prizes 100%; it only makes the draw less likely to produce frequent high payouts.
	const avoidPrizeChance = [0.55, 0.75, 0.90, 0.98][difficulty] ?? 0.90;
	const weights = weightTable[difficulty] || weightTable[2];
	let fallback = 0;

	// Makes several attempts to find a frame that does not create an immediate prize.
	// If all attempts fail, use the fallback to keep the game flowing without stalling.
	for (let attempt = 0; attempt < 14; attempt++)
	{
		const frame = WeightedPick(runtime, weights);
		if (attempt === 0) fallback = frame;

		const wouldPayNow = WouldCreateImmediatePrize(runtime, gridX, gridY, frame);
		if (!wouldPayNow)
			return frame;

		// At lower difficulties, allow some natural prizes to pass through.
		// At higher difficulties, reject them most of the time and try another frame.
		if (runtime.random() > avoidPrizeChance)
			return frame;
	}

	return fallback;
}

function WouldCreateImmediatePrize(runtime, gridX, gridY, frame)
{
	if (gridX === null || gridY === null || gridX === undefined || gridY === undefined)
		return false;

	const col = Math.round(gridX);
	const row = Math.round(gridY);
	if (row < 0 || row >= CascadeSlot.rows || col < 0 || col >= CascadeSlot.columns)
		return false;

	// Builds the current grid. During filling, cards already created are added here,
	// allowing the next frame to be checked so it does not complete a connected 3+ group.
	const grid = BuildGrid(runtime);
	const visited = new Set();
	const stack = [{ row, col, virtual: true }];
	let count = 0;

	while (stack.length)
	{
		const current = stack.pop();
		const key = GridKey(current.row, current.col);
		if (visited.has(key)) continue;
		visited.add(key);

		if (!current.virtual)
		{
			const card = grid[current.row][current.col];
			if (!card || Math.round(card.instVars.type) !== frame)
				continue;
		}

		count++;
		if (count >= 3) return true;

		const neighbours = [
			{ row: current.row, col: current.col - 1 },
			{ row: current.row, col: current.col + 1 },
			{ row: current.row - 1, col: current.col },
			{ row: current.row + 1, col: current.col }
		];

		for (const n of neighbours)
		{
			if (n.row < 0 || n.row >= CascadeSlot.rows || n.col < 0 || n.col >= CascadeSlot.columns)
				continue;

			const nKey = GridKey(n.row, n.col);
			if (visited.has(nKey)) continue;

			const next = grid[n.row][n.col];
			if (!next || Math.round(next.instVars.type) !== frame)
				continue;

			stack.push({ row: n.row, col: n.col, virtual: false });
		}
	}

	return false;
}

function WeightedPick(runtime, weights)
{
	let total = 0;
	for (const w of weights) total += Math.max(0, Number(w) || 0);
	if (total <= 0) return Math.floor(runtime.random() * (CascadeSlot.prizeFrameMax + 1));

	let r = runtime.random() * total;
	for (let i = 0; i < weights.length; i++)
	{
		r -= Math.max(0, Number(weights[i]) || 0);
		if (r <= 0) return i;
	}
	return weights.length - 1;
}

function GetDragonCard(runtime)
{
	for (const card of GetCards(runtime))
	{
		if (card.isDestroyed) continue;
		const type = Math.round(card.instVars.type ?? card.animationFrame ?? 0);
		if (type === CascadeSlot.dragonFrame)
			return card;
	}
	return null;
}

function CountCardsByType(runtime, type)
{
	let count = 0;
	for (const card of GetCards(runtime))
	{
		if (card.isDestroyed) continue;
		const cardType = Math.round(card.instVars.type ?? card.animationFrame ?? 0);
		if (cardType === type) count++;
	}
	return count;
}

function ReplaceCardFrame(card, frame)
{
	if (!card || card.isDestroyed) return;
	card.instVars.type = frame;
	card.animationFrame = frame;
	UpdateCardSpecialFlags(card);
}

function ReplaceDragonWithNormal(runtime)
{
	const dragonCard = GetDragonCard(runtime);
	if (!dragonCard) return;
	ReplaceCardFrame(dragonCard, Math.floor(runtime.random() * 3));
}

function EnforceSingleSpecialCards(runtime)
{
	if (IsServerResultActive(runtime))
		return;

	// Ensures multiplier and Dragon have at most 1 card on screen.
	// If more than one is created for any reason, extra cards become normal frames 0, 1, or 2.
	let foundMultiplier = false;
	let foundDragon = false;

	for (const card of GetCards(runtime))
	{
		if (card.isDestroyed) continue;
		const type = Math.round(card.instVars.type ?? card.animationFrame ?? 0);

		if (type === CascadeSlot.multiplierFrame)
		{
			if (foundMultiplier) ReplaceCardFrame(card, Math.floor(runtime.random() * 3));
			else foundMultiplier = true;
		}
		else if (type === CascadeSlot.dragonFrame)
		{
			if (foundDragon) ReplaceCardFrame(card, Math.floor(runtime.random() * 3));
			else foundDragon = true;
		}
	}
}

function FormatMoney(value)
{
	// Ensures exactly 2 decimal places and a thousands separator.
	// Example: 71050 -> 71,050.00 | 0.1 -> 0.10 | 2.5 -> 2.50
	const number = Number(value);
	const safeNumber = Number.isFinite(number) ? number : 0;
	const fixed = safeNumber.toFixed(2);
	const parts = fixed.split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}

function Round2(value)
{
	return Math.round((Number(value) || 0) * 100) / 100;
}

function ClampInt(value, min, max)
{
	const n = Math.trunc(Number(value) || 0);
	return Math.max(min, Math.min(max, n));
}

function GridToX(gridX) { return CascadeSlot.startX + gridX * CascadeSlot.cellW; }
function GridToY(gridY) { return CascadeSlot.startY + gridY * CascadeSlot.cellH; }
function Lerp(a, b, t) { return a + (b - a) * t; }
function EaseInCubic(t) { return t * t * t; }
function EaseInBackSoft(t)
{
	const c1 = 1.4;
	return c1 * t * t * t - (c1 - 1) * t * t;
}
function EaseOutBackSoft(t)
{
	const c1 = 1.25;
	const c3 = c1 + 1;
	return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
function UniqueSorted(values)
{
	const rounded = values.map(v => Math.round(v * 10000) / 10000);
	return [...new Set(rounded)].sort((a, b) => a - b);
}

function ClosestIndex(values, value)
{
	let bestIndex = 0;
	let bestDistance = Infinity;
	const target = Math.round(value * 10000) / 10000;
	for (let i = 0; i < values.length; i++)
	{
		const distance = Math.abs(values[i] - target);
		if (distance < bestDistance)
		{
			bestDistance = distance;
			bestIndex = i;
		}
	}
	return bestIndex;
}