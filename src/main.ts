import { Plugin } from "obsidian";
import { chineseQuoteViewPlugin } from "./chineseQuoteHighlight";
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
		this.applyHighlightColor();
		this.registerEditorExtension(chineseQuoteViewPlugin);
		this.registerMarkdownPostProcessor(createChineseQuotePostProcessor());
		this.addSettingTab(new ChineseQuoteSettingTab(this.app, this));
	}

	onunload() {
		document.documentElement.style.removeProperty("--chinese-quote-color");
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
	}
}
