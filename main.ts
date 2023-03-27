import { Plugin, MarkdownRenderer, TFile } from "obsidian";
import * as fs from "fs/promises";

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

				let file = vault.getAbstractFileByPath(filename) as TFile;
				let fileContents;
				let fileExt;
				
				if (!file) {
					fileContents = await this.extPath(filename);
					if (fileContents) fileExt = "ext"
				}
				if (!fileContents) {
					fileContents = file
						? await vault.cachedRead(file)
						: "Couldn't find: " + filename;
				}
				if (!file && !fileExt) language = "blank"; // to stabilize error-block when editing
				let markdown = "```" + language;
				markdown += "\r\n";
				markdown += fileContents;

				if (fileContents.endsWith("\n")) { // if the file doesn't end with \n
					markdown += "```";
				} else {
					markdown += "\n```";
				}

				MarkdownRenderer.renderMarkdown(markdown, el, "", this);
			}
		);
	}

	async extPath(filename: string): Promise<string> {
		try {
			return await fs.readFile(filename, "utf8");
		} catch (err) {
			// console.error(err);
			return "";
		}
	}
}
