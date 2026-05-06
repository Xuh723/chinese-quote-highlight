import { App, PluginSettingTab, Setting } from "obsidian";
import type ChineseQuotePlugin from "./main";

export interface ChineseQuoteSettings {
	highlightColor: string;
}

export const DEFAULT_SETTINGS: ChineseQuoteSettings = {
	highlightColor: "#66ccff",
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
	}
}
