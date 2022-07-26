import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface CodeEmbedSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: CodeEmbedSettings = {
	mySetting: 'default'
}

export default class CodeEmbed extends Plugin {
	settings: CodeEmbedSettings;

	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor("code", async (source, el, ctx) => {
			const { vault } = this.app;

			const rows = source.split("\n").filter((row) => row.length > 0);

			if (rows.length > 0 ) {
				const filename = rows[0];

				const pre = el.createEl("pre");
				const code = pre.createEl("code");

				const file = vault.getAbstractFileByPath(filename);

				if (file != null) {
					const fileContents = await vault.cachedRead(file);
					code.innerText = fileContents;
				} else {
					new Notice('code-embed: could not read file ' + filename);
				}
			}
		  });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: CodeEmbed;

	constructor(app: App, plugin: CodeEmbed) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
