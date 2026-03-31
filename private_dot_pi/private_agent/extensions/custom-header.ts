/**
 * Custom Header Extension
 *
 * Demonstrates ctx.ui.setHeader() for replacing the built-in header
 * (logo + keybinding hints) with a custom component showing the pi mascot.
 */

import type { ExtensionAPI, Theme } from "@mariozechner/pi-coding-agent";
import { VERSION } from "@mariozechner/pi-coding-agent";

// --- PI SYMBOL HEADER ---
function getPiHeader(theme: Theme): string[] {
	const piSymbol = theme.fg("accent", "π");
	const version = theme.fg("dim", VERSION);
	return ["", `${piSymbol} ${version}`, ""];
}

export default function (pi: ExtensionAPI) {
	// Set custom header immediately on load (if UI is available)
	pi.on("session_start", async (_event, ctx) => {
		if (ctx.hasUI) {
			ctx.ui.setHeader((_tui, theme) => {
				return {
					render(_width: number): string[] {
						return getPiHeader(theme);
					},
					invalidate() {},
				};
			});
		}
	});

	// Command to restore built-in header
	pi.registerCommand("builtin-header", {
		description: "Restore built-in header with keybinding hints",
		handler: async (_args, ctx) => {
			ctx.ui.setHeader(undefined);
			ctx.ui.notify("Built-in header restored", "info");
		},
	});
}
