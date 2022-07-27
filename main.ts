import { Plugin, MarkdownRenderer } from 'obsidian';

export default class CodeEmbed extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor("codefile", async (source, el, ctx) => {
			const { vault } = this.app;
			const rows = source.split("\n").filter((row) => row.length > 0);
			
			if (rows.length == 0) {
				return;
			};

			const tokens = rows[0].split(":");
			let filename = ""
			let language = ""

			if (tokens.length == 1) {
				filename = tokens[0];
			} else if(tokens.length == 2) {
				language = tokens[0];
				filename = tokens[1];
			}
			
			const file = vault.getAbstractFileByPath(filename);

			if (file != null) {
				const fileContents = await vault.cachedRead(file);

				let markdown = "```" + language;
				markdown += "\r\n";
				markdown += fileContents;
				markdown += "```";

				MarkdownRenderer.renderMarkdown(markdown, el, "", null);
				//code.innerText = fileContents;
			} else {
				el.innerText = "Could not load file " + filename;
			}
		  });
	}
}
