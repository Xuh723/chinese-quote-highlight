import { Plugin } from "obsidian";
import type { EditorView } from "@codemirror/view";
import {
	chineseQuoteViewPlugin,
	cornerQuoteViewPlugin,
	setCornerQuotesEnabled,
} from "./chineseQuoteHighlight";
import { createChineseQuotePostProcessor } from "./postProcessor";
import {
	ChineseQuoteSettings,
	DEFAULT_SETTINGS,
	ChineseQuoteSettingTab,
} from "./settings";

export default class ChineseQuotePlugin extends Plugin {
	settings: ChineseQuoteSettings;

	async onload() {
		await this.loadSettings();
		setCornerQuotesEnabled(this.settings.enableCornerQuotes);
		this.applyHighlightColor();
		this.registerEditorExtension([
			chineseQuoteViewPlugin,
			cornerQuoteViewPlugin,
		]);
		this.registerMarkdownPostProcessor(
			createChineseQuotePostProcessor(this)
		);
		this.addSettingTab(new ChineseQuoteSettingTab(this.app, this));
	}

	onunload() {
		document.documentElement.style.removeProperty("--chinese-quote-color");
		document.documentElement.style.removeProperty("--corner-quote-color");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData() as Partial<ChineseQuoteSettings>
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	applyHighlightColor() {
		document.documentElement.style.setProperty(
			"--chinese-quote-color",
			this.settings.highlightColor
		);
		document.documentElement.style.setProperty(
			"--corner-quote-color",
			this.settings.cornerQuoteColor
		);
	}

	applyCornerQuoteConfig() {
		setCornerQuotesEnabled(this.settings.enableCornerQuotes);
		this.app.workspace.getLeavesOfType("markdown").forEach((leaf) => {
			const cmView = (leaf.view as unknown as { editor?: { cm?: EditorView } })
				.editor?.cm;
			if (cmView) {
				cmView.dispatch({});
			}
		});
	}
}
