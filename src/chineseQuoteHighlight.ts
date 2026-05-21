import {
	ViewPlugin,
	Decoration,
	EditorView,
	ViewUpdate,
	DecorationSet,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

type QuoteSegment = {
	from: number;
	to: number;
	className: string;
};

function findMatchingClose(
	text: string,
	openIdx: number,
	openChar: string,
	closeChar: string
): number {
	let depth = 1;
	let i = openIdx + 1;
	while (i < text.length && depth > 0) {
		if (text[i] === openChar) depth++;
		else if (text[i] === closeChar) depth--;
		i++;
	}
	return depth === 0 ? i : -1;
}

function parseQuoteHighlights(
	text: string,
	enableCorner: boolean
): QuoteSegment[] {
	const segments: QuoteSegment[] = [];
	let i = 0;

	while (i < text.length) {
		const char = text[i];

		if (char === "\u201c") {
			const closeIdx = findMatchingClose(text, i, "\u201c", "\u201d");
			if (closeIdx !== -1) {
				let current = i;
				let innerStart = i + 1;
				while (innerStart < closeIdx - 1) {
					if (enableCorner && text[innerStart] === "\u300c") {
						const innerClose = findMatchingClose(
							text,
							innerStart,
							"\u300c",
							"\u300d"
						);
						if (innerClose !== -1 && innerClose <= closeIdx) {
							if (innerStart > current) {
								segments.push({
									from: current,
									to: innerStart,
									className: "chinese-quote-highlight",
								});
							}
							segments.push({
								from: innerStart,
								to: innerClose,
								className: "corner-quote-highlight",
							});
							current = innerClose;
							innerStart = innerClose;
							continue;
						}
					}
					innerStart++;
				}
				if (current < closeIdx) {
					segments.push({
						from: current,
						to: closeIdx,
						className: "chinese-quote-highlight",
					});
				}
				i = closeIdx;
				continue;
			}
		} else if (enableCorner && char === "\u300c") {
			const closeIdx = findMatchingClose(text, i, "\u300c", "\u300d");
			if (closeIdx !== -1) {
				let current = i;
				let innerStart = i + 1;
				while (innerStart < closeIdx - 1) {
					if (text[innerStart] === "\u201c") {
						const innerClose = findMatchingClose(
							text,
							innerStart,
							"\u201c",
							"\u201d"
						);
						if (innerClose !== -1 && innerClose <= closeIdx) {
							if (innerStart > current) {
								segments.push({
									from: current,
									to: innerStart,
									className: "corner-quote-highlight",
								});
							}
							segments.push({
								from: innerStart,
								to: innerClose,
								className: "chinese-quote-highlight",
							});
							current = innerClose;
							innerStart = innerClose;
							continue;
						}
					}
					innerStart++;
				}
				if (current < closeIdx) {
					segments.push({
						from: current,
						to: closeIdx,
						className: "corner-quote-highlight",
					});
				}
				i = closeIdx;
				continue;
			}
		}

		i++;
	}

	return segments;
}

let cornerQuotesEnabled = false;

export function setCornerQuotesEnabled(enabled: boolean) {
	cornerQuotesEnabled = enabled;
}

export const quoteViewPlugin = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;
		constructor(view: EditorView) {
			this.decorations = this.buildDecorations(view);
		}
		update(update: ViewUpdate) {
			this.decorations = this.buildDecorations(update.view);
		}
		buildDecorations(view: EditorView): DecorationSet {
			const builder = new RangeSetBuilder<Decoration>();
			for (const { from, to } of view.visibleRanges) {
				const text = view.state.doc.sliceString(from, to);
				const segments = parseQuoteHighlights(text, cornerQuotesEnabled);
				for (const seg of segments) {
					builder.add(
						from + seg.from,
						from + seg.to,
						Decoration.mark({ class: seg.className })
					);
				}
			}
			return builder.finish();
		}
	},
	{
		decorations: (v) => v.decorations,
	}
);
