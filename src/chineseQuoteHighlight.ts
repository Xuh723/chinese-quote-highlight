import {
	ViewPlugin,
	MatchDecorator,
	Decoration,
	EditorView,
	ViewUpdate,
	DecorationSet,
} from "@codemirror/view";

const chineseQuoteDecorator = new MatchDecorator({
	regexp: /\u201c[^\u201d]*?\u201d/g,
	decoration: Decoration.mark({
		class: "chinese-quote-highlight",
	}),
});

const cornerQuoteDecorator = new MatchDecorator({
	regexp: /\u300c[^\u300d]*?\u300d/g,
	decoration: Decoration.mark({
		class: "corner-quote-highlight",
	}),
});

let cornerQuotesEnabled = false;

export function setCornerQuotesEnabled(enabled: boolean) {
	cornerQuotesEnabled = enabled;
}

export const chineseQuoteViewPlugin = ViewPlugin.fromClass(
	class {
		placeholders: DecorationSet;
		constructor(view: EditorView) {
			this.placeholders = chineseQuoteDecorator.createDeco(view);
		}
		update(update: ViewUpdate) {
			this.placeholders = chineseQuoteDecorator.updateDeco(
				update,
				this.placeholders
			);
		}
	},
	{
		decorations: (v) => v.placeholders,
	}
);

export const cornerQuoteViewPlugin = ViewPlugin.fromClass(
	class {
		placeholders: DecorationSet;
		constructor(view: EditorView) {
			this.placeholders = cornerQuotesEnabled
				? cornerQuoteDecorator.createDeco(view)
				: Decoration.none;
		}
		update(update: ViewUpdate) {
			if (cornerQuotesEnabled) {
				this.placeholders = cornerQuoteDecorator.updateDeco(
					update,
					this.placeholders
				);
			} else {
				this.placeholders = Decoration.none;
			}
		}
	},
	{
		decorations: (v) => v.placeholders,
	}
);
