import type ChineseQuotePlugin from "./main";

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

type QuotePart = {
	type: "text" | "chinese" | "corner";
	content: string;
};

function parseQuoteParts(text: string, enableCorner: boolean): QuotePart[] {
	const parts: QuotePart[] = [];
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
								parts.push({
									type: "chinese",
									content: text.slice(current, innerStart),
								});
							}
							parts.push({
								type: "corner",
								content: text.slice(innerStart, innerClose),
							});
							current = innerClose;
							innerStart = innerClose;
							continue;
						}
					}
					innerStart++;
				}
				if (current < closeIdx) {
					parts.push({
						type: "chinese",
						content: text.slice(current, closeIdx),
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
								parts.push({
									type: "corner",
									content: text.slice(current, innerStart),
								});
							}
							parts.push({
								type: "chinese",
								content: text.slice(innerStart, innerClose),
							});
							current = innerClose;
							innerStart = innerClose;
							continue;
						}
					}
					innerStart++;
				}
				if (current < closeIdx) {
					parts.push({
						type: "corner",
						content: text.slice(current, closeIdx),
					});
				}
				i = closeIdx;
				continue;
			}
		}

		let textStart = i;
		i++;
		while (
			i < text.length &&
			text[i] !== "\u201c" &&
			!(enableCorner && text[i] === "\u300c")
		) {
			i++;
		}
		parts.push({ type: "text", content: text.slice(textStart, i) });
	}

	return parts;
}

function highlightNode(textNode: Text, enableCorner: boolean) {
	const text = textNode.textContent || "";
	const parts = parseQuoteParts(text, enableCorner);

	const hasHighlight = parts.some((p) => p.type !== "text");
	if (!hasHighlight) return;

	const fragment = document.createDocumentFragment();
	for (const part of parts) {
		if (part.type === "text") {
			fragment.appendChild(document.createTextNode(part.content));
		} else {
			const span = document.createElement("span");
			span.className =
				part.type === "chinese"
					? "chinese-quote-highlight"
					: "corner-quote-highlight";
			span.textContent = part.content;
			fragment.appendChild(span);
		}
	}

	textNode.parentNode?.replaceChild(fragment, textNode);
}

export function createChineseQuotePostProcessor(plugin: ChineseQuotePlugin) {
	return (element: HTMLElement) => {
		const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
		const nodes: Text[] = [];
		let node;
		while ((node = walker.nextNode())) {
			nodes.push(node as Text);
		}

		for (const textNode of nodes) {
			const text = textNode.textContent || "";
			if (
				!text.includes("\u201c") &&
				!(plugin.settings.enableCornerQuotes && text.includes("\u300c"))
			) {
				continue;
			}
			highlightNode(textNode, plugin.settings.enableCornerQuotes);
		}
	};
}
