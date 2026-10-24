// Edit this file to customize the demo without rebuilding.
// Run the folder through a static host or local preview server, then open index.html.

window.SLOTGEN_GAME_CONFIG = {
	// Frame playback speed. Edit and reload; no build is required.
	animations: { symbolFps: 20 },
	display: {
		gameName: 'SLOTGEN',
		logoText: 'SLOTGEN',
		version: '1.0.0',
	},

	demo: {
		// Starting demo balance shown to the player.
		startBalance: 10000,

		// Currency code used for balance, bet and win labels.
		currency: 'USD',

		// Bet values shown in the bet picker.
		betItems: [
			0.1, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8,
			2, 3, 4, 5, 6, 7, 8, 9, 10, 12,
			14, 16, 18, 20, 30, 40, 50, 75, 100,
		],

		// Demo payout sequence. Each number is a multiplier of the selected bet.
		// Example: 3 means the spin wins 3x the selected bet.
		// The sequence repeats after the last item.
		payoutSequence: [0, 0.2, 3],
	},
};
