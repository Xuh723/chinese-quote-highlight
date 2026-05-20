import { App, PluginSettingTab, Setting } from "obsidian";
import type ChineseQuotePlugin from "./main";

export interface ChineseQuoteSettings {
	highlightColor: string;
	enableCornerQuotes: boolean;
	cornerQuoteColor: string;
}

export const DEFAULT_SETTINGS: ChineseQuoteSettings = {
	highlightColor: "#BFDBFE",
	enableCornerQuotes: false,
	cornerQuoteColor: "#FECACA",
};

export class ChineseQuoteSettingTab extends PluginSettingTab {
	plugin: ChineseQuotePlugin;

	constructor(app: App, plugin: ChineseQuotePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Highlight color")
			.setDesc("Select the highlight color for quoted text.")
			.addColorPicker((color) =>
				color
					.setValue(this.plugin.settings.highlightColor)
					.onChange(async (value) => {
						this.plugin.settings.highlightColor = value;
						this.plugin.applyHighlightColor();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Highlight corner quotes")
			.setDesc("Highlight text wrapped in corner quotes (\u300c...\u300d).")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableCornerQuotes)
					.onChange(async (value) => {
						this.plugin.settings.enableCornerQuotes = value;
						this.plugin.applyCornerQuoteConfig();
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Corner quotes highlight color")
			.setDesc("Select the highlight color for corner quotes.")
			.addColorPicker((color) =>
				color
					.setValue(this.plugin.settings.cornerQuoteColor)
					.onChange(async (value) => {
						this.plugin.settings.cornerQuoteColor = value;
						this.plugin.applyHighlightColor();
						await this.plugin.saveSettings();
					})
			);
	}
}
