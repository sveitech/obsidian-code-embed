import { Plugin, MarkdownRenderer, TFile } from "obsidian";

export default class CodeEmbed extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor(
			"codefile",
			async (source, el, ctx) => {
				const { vault } = this.app;
				const rows = source.split("\n").filter((row) => row.length > 0);

				if (rows.length == 0) {
					return;
				}

				const filename = rows[0].trim();
				let language = filename.split(".").pop()?.trim();
				const file = vault.getAbstractFileByPath(filename) as TFile;

				const fileContents = file
					? await vault.cachedRead(file)
					: "Couldn't find: " + filename;
				if (!file) language = "blank"; // to stabilize error-block when editing
				let markdown = "```" + language;
				markdown += "\r\n";
				markdown += fileContents;

				if (fileContents.endsWith("\n")) {
					// if the file doesn't end with \n
					markdown += "```";
				} else {
					markdown += "\n```";
				}

				MarkdownRenderer.renderMarkdown(markdown, el, "", this);
			}
		);
	}
}
