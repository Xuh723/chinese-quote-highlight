import {
	ViewPlugin,
	MatchDecorator,
	Decoration,
	EditorView,
	ViewUpdate,
	DecorationSet,
} from "@codemirror/view";

const chineseQuoteDecorator = new MatchDecorator({
	regexp: /“[^”]*?”/g,
	decoration: Decoration.mark({
		class: "chinese-quote-highlight",
	}),
});

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
