/**
 * Web Extension - Fetch and search the web
 *
 * Provides:
 * - web_fetch tool: Fetch and extract readable text from URLs
 * - web_search tool: Search the web using DuckDuckGo instant answers
 *
 * Usage:
 * 1. Install lynx for better HTML extraction:
 *    - macOS: brew install lynx
 *    - Debian/Ubuntu: sudo apt-get install lynx
 * 2. The extension will work without lynx but with basic HTML stripping
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { Text } from "@mariozechner/pi-tui";

export default function webExtension(pi: ExtensionAPI) {
	// Register web_fetch tool
	pi.registerTool({
		name: "web_fetch",
		label: "Fetch URL",
		description: "Fetch a URL and extract readable text content. Returns markdown-formatted text.",
		promptSnippet: "Fetch and extract text from URLs",
		promptGuidelines: [
			"Use this tool to read documentation, articles, or any web page content",
			"Text content only - JavaScript-rendered content may not work",
		],
		parameters: Type.Object({
			url: Type.String({ description: "URL to fetch" }),
		}),

		async execute(_toolCallId, params, signal, onUpdate, _ctx) {
			onUpdate?.({ content: [{ type: "text", text: `Fetching ${params.url}...` }] });

			try {
				let text: string;

				// Check if lynx is available
				const lynxCheck = await pi.exec("sh", ["-c", "command -v lynx"], { signal });

				if (lynxCheck.code === 0) {
					// Use lynx for extraction - single command pipeline
					const result = await pi.exec(
						"sh",
						["-c", `curl -sSL --insecure '${params.url}' | lynx -stdin -dump -nolist`],
						{ signal, timeout: 30000 },
					);
					if (result.code !== 0) {
						throw new Error(`Fetch/extract failed (code ${result.code}): ${result.stderr}`);
					}
					text = result.stdout;
				} else {
					// Fallback: fetch HTML and do basic stripping
					const fetchResult = await pi.exec(
						"curl",
						["-sSL", "--insecure", params.url],
						{ signal, timeout: 30000 },
					);
					if (fetchResult.code !== 0) {
						throw new Error(`curl failed (code ${fetchResult.code}): ${fetchResult.stderr}`);
					}
					const html = fetchResult.stdout;
					const stripped = html
						.replace(/<script[^>]*>.*?<\/script>/gs, '')
						.replace(/<style[^>]*>.*?<\/style>/gs, '')
						.replace(/<[^>]*>/g, '')
						.replace(/&nbsp;/g, ' ')
						.replace(/&lt;/g, '<')
						.replace(/&gt;/g, '>')
						.replace(/&amp;/g, '&')
						.replace(/^\s+/gm, '')
						.split('\n')
						.filter(line => line.trim())
						.slice(0, 500)
						.join('\n');
					
					text = `# ${params.url}\n\n${stripped}\n\nNote: Install lynx for better extraction`;
				}

				const trimmed = text.trim();
				if (!trimmed) {
					throw new Error(`Extracted text is empty (raw length: ${text.length})`);
				}

				return {
					content: [{ type: "text", text: trimmed }],
					details: { url: params.url, length: trimmed.length },
				};
			} catch (error: any) {
				const msg = error.message || String(error);
				const stack = error.stack ? `\n${error.stack}` : "";
				return {
					content: [{ type: "text", text: `Error fetching ${params.url}: ${msg}${stack}` }],
					details: { url: params.url, error: msg },
					isError: true,
				};
			}
		},

		renderCall(args, theme, _context) {
			return new Text(
				theme.fg("toolTitle", theme.bold("web_fetch ")) +
				theme.fg("muted", args.url),
				0,
				0,
			);
		},

		renderResult(result, { expanded }, theme, _context) {
			const details = result.details as any;
			const text = result.content[0];
			const content = text?.type === "text" ? text.text : "";

			if (details?.error) {
				return new Text(theme.fg("error", `Error: ${details.error}`), 0, 0);
			}

			const summary = `${theme.fg("success", "✓")} ${theme.fg("muted", `Fetched ${details?.length || 0} chars`)}`;
			
			if (expanded) {
				const preview = content.slice(0, 1000);
				return new Text(
					summary + "\n" + theme.fg("dim", preview) +
					(content.length > 1000 ? theme.fg("dim", "\n...") : ""),
					0,
					0,
				);
			}

			return new Text(summary, 0, 0);
		},
	});

	// Register web_search tool
	pi.registerTool({
		name: "web_search",
		label: "Search Web",
		description: "Search the web using DuckDuckGo instant answer API. Returns quick answers, definitions, and related topics.",
		promptSnippet: "Search DuckDuckGo for instant answers",
		promptGuidelines: [
			"Use this tool for factual queries, definitions, and simple documentation lookups",
			"Best for quick facts - for full pages use web_fetch",
		],
		parameters: Type.Object({
			query: Type.String({ description: "Search query" }),
		}),

		async execute(_toolCallId, params, signal, onUpdate, _ctx) {
			onUpdate?.({ content: [{ type: "text", text: `Searching: ${params.query}...` }] });

			try {
				// URL encode the query
				const encoded = encodeURIComponent(params.query);
				const url = `https://api.duckduckgo.com/?q=${encoded}&format=json&no_html=1&skip_disambig=1`;

				// Fetch results
				const fetchResult = await pi.exec(
					"curl",
					["-s", url],
					{ signal, timeout: 15000 },
				);

				if (fetchResult.code !== 0) {
					throw new Error(`Search failed: ${fetchResult.stderr || "Unknown error"}`);
				}

				const result = JSON.parse(fetchResult.stdout);
				const parts: string[] = [];

				if (result.Abstract) {
					parts.push("=== Answer ===");
					parts.push(result.Abstract);
					parts.push("");
				}

				if (result.Answer) {
					parts.push("=== Quick Answer ===");
					parts.push(result.Answer);
					parts.push("");
				}

				if (result.Definition) {
					parts.push("=== Definition ===");
					parts.push(result.Definition);
					parts.push("");
				}

				if (result.RelatedTopics && Array.isArray(result.RelatedTopics)) {
					const related = result.RelatedTopics
						.filter((t: any) => t.Text)
						.slice(0, 5)
						.map((t: any) => t.Text);
					
					if (related.length > 0) {
						parts.push("=== Related ===");
						parts.push(related.join("\n"));
					}
				}

				if (parts.length === 0) {
					return {
						content: [{ type: "text", text: "No instant answer found." }],
						details: { query: params.query, found: false },
					};
				}

				return {
					content: [{ type: "text", text: parts.join("\n") }],
					details: { 
						query: params.query,
						found: true,
						sections: {
							abstract: !!result.Abstract,
							answer: !!result.Answer,
							definition: !!result.Definition,
							related: result.RelatedTopics?.length || 0,
						}
					},
				};
			} catch (error: any) {
				const msg = error.message || String(error);
				return {
					content: [{ type: "text", text: `Error: ${msg}` }],
					details: { query: params.query, error: msg },
				};
			}
		},

		renderCall(args, theme, _context) {
			return new Text(
				theme.fg("toolTitle", theme.bold("web_search ")) +
				theme.fg("muted", `"${args.query}"`),
				0,
				0,
			);
		},

		renderResult(result, { expanded }, theme, _context) {
			const details = result.details as any;
			const text = result.content[0];
			const content = text?.type === "text" ? text.text : "";

			if (details?.error) {
				return new Text(theme.fg("error", `Error: ${details.error}`), 0, 0);
			}

			if (!details?.found) {
				return new Text(theme.fg("dim", "No instant answer found"), 0, 0);
			}

			const sections: string[] = [];
			if (details.sections?.abstract) sections.push("abstract");
			if (details.sections?.answer) sections.push("answer");
			if (details.sections?.definition) sections.push("definition");
			if (details.sections?.related > 0) sections.push(`${details.sections.related} related`);

			const summary = `${theme.fg("success", "✓")} ${theme.fg("muted", sections.join(", "))}`;

			if (expanded) {
				const preview = content.slice(0, 500);
				return new Text(
					summary + "\n" + theme.fg("dim", preview) +
					(content.length > 500 ? theme.fg("dim", "\n...") : ""),
					0,
					0,
				);
			}

			return new Text(summary, 0, 0);
		},
	});
}
