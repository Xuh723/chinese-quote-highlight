export function createChineseQuotePostProcessor() {
	return (element: HTMLElement) => {
		const walker = document.createTreeWalker(
			element,
			NodeFilter.SHOW_TEXT
		);
		const nodes: Text[] = [];
		let node;
		while ((node = walker.nextNode())) {
			nodes.push(node as Text);
		}

		for (const textNode of nodes) {
			const text = textNode.textContent || "";
			if (!text.includes("\u201c")) continue;

			const regex = /\u201c[^\u201d]*?\u201d/g;
			let match;
			const parts: { type: "text" | "highlight"; content: string }[] = [];
			let lastIndex = 0;

			while ((match = regex.exec(text)) !== null) {
				if (match.index > lastIndex) {
					parts.push({
						type: "text",
						content: text.slice(lastIndex, match.index),
					});
				}
				parts.push({ type: "highlight", content: match[0] });
				lastIndex = match.index + match[0].length;
			}

			if (parts.length === 0) continue;

			if (lastIndex < text.length) {
				parts.push({ type: "text", content: text.slice(lastIndex) });
			}

			const fragment = document.createDocumentFragment();
			for (const part of parts) {
				if (part.type === "text") {
					fragment.appendChild(document.createTextNode(part.content));
				} else {
					const span = document.createElement("span");
					span.className = "chinese-quote-highlight";
					span.textContent = part.content;
					fragment.appendChild(span);
				}
			}

			textNode.parentNode?.replaceChild(fragment, textNode);
		}
	};
}
