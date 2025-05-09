const fs = require("node:fs");
const JSONtoTS = require("json-to-ts");

class UVTranslationTypePlugin {
	// Define `apply` as its prototype method which is supplied with compiler as its argument
	apply(compiler) {
		// Specify the event hook to attach to
		compiler.hooks.beforeCompile.tapAsync(
			"UVTranslationTypePlugin",
			(params, callback) => {
				console.log("UVTranslationTypePlugin: loading en-GB.json");
				const enJSONStr = fs
					.readFileSync("./src/locales/en-GB.json")
					.toString();
				const enJSON = JSON.parse(enJSONStr.replace(/"\$/g, '"'));

				console.log("UVTranslationTypePlugin: building types");
				const defs = JSONtoTS(enJSON);

				console.log("UVTranslationTypePlugin: writing ./translations.d.ts");
				fs.writeFileSync(
					"./translations.d.ts",
					defs.join("\n\n").replace("RootObject", "Translations"),
				);

				callback();
				console.log("UVTranslationTypePlugin: done.");
			},
		);
	}
}

module.exports = {
	UVTranslationTypePlugin,
};
