import * as fs from "fs";
import * as path from "path";
import { BUILT_IN_CAPTION_STYLES } from "../../src/content-handlers/iiif/modules/uv-captions-module/CaptionStyle";

// The AV component, MediaElement player (its controls' names, in place of
// mediaelement's own English), gallery and metadata components have no
// built-in text: everything they show comes from their panel's content in each
// extension's
// config, which refers to the locales ("$key"). So every content key a
// component reads must be in every config panel that gives it content, and
// every locale must translate it.
const IIIF = path.join(__dirname, "../../src/content-handlers/iiif");
const LOCALES = path.join(__dirname, "../../src/locales");

const unique = <T>(items: T[]): T[] => Array.from(new Set(items));

// The TypeScript source files in some directories (or the files given).
const sources = (...paths: string[]): string[] =>
  paths.flatMap((relative) => {
    const full = path.join(IIIF, relative);
    return fs.statSync(full).isDirectory()
      ? fs
          .readdirSync(full, { recursive: true })
          .map(String)
          .filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts"))
          .map((file) => path.join(full, file))
      : [full];
  });

// The content keys read in some source files, as `content.key`. Not
// `$content.key`: that's a panel's element (e.g. `this.$content.width()`).
const contentKeysIn = (files: string[]): string[] =>
  unique(
    files.flatMap((file) =>
      (
        fs.readFileSync(file, "utf8").match(/(?<![\w$])content\??\.\w+/g) || []
      ).map((read) => read.replace(/^content\??\./, ""))
    )
  );

const COMPONENTS = [
  {
    name: "the AV component",
    files: sources(
      "modules/iiif-av-component-module",
      "modules/uv-captions-module"
    ),
    // The names of UV's own caption colours, looked up by style.
    variableKeys: BUILT_IN_CAPTION_STYLES.map((style) => style.nameKey),
    panels: ["avCenterPanel"],
  },
  {
    name: "the MediaElement player",
    files: sources(
      "modules/uv-mediaelementcenterpanel-module",
      "modules/uv-captions-module"
    ),
    // The names of UV's own caption colours, looked up by style.
    variableKeys: BUILT_IN_CAPTION_STYLES.map((style) => style.nameKey),
    panels: ["mediaElementCenterPanel"],
  },
  {
    name: "the gallery",
    files: sources("modules/uv-shared-module/GalleryComponent.ts"),
    variableKeys: [],
    panels: ["contentLeftPanel", "multiSelectDialogue"],
  },
  {
    name: "the metadata panel",
    files: sources("modules/uv-shared-module/MetadataComponent.ts"),
    variableKeys: [],
    panels: ["moreInfoRightPanel"],
  },
].map((component) => ({
  ...component,
  keys: [...contentKeysIn(component.files), ...component.variableKeys],
}));

// Every extension config panel, of those given, that gives a component
// content.
const panelContents = (panels: string[]) =>
  fs
    .readdirSync(path.join(IIIF, "extensions"))
    .filter((extension) => extension.startsWith("uv-"))
    .flatMap((extension) => {
      const config = JSON.parse(
        fs.readFileSync(
          path.join(IIIF, "extensions", extension, "config/config.json"),
          "utf8"
        )
      );
      return panels
        .filter((panel) => config.modules && config.modules[panel])
        .map((panel) => ({
          where: `${extension} ${panel}`,
          content: config.modules[panel].content || {},
        }));
    });

// The source files that read content keys given in a variable, as
// `content[key]`, which contentKeysIn can't see. Each must have its keys
// added to its component's by hand: CaptionStyle's are the colours' names
// (BUILT_IN_CAPTION_STYLES' nameKeys).
const VARIABLE_CONTENT_READS = ["modules/uv-captions-module/CaptionStyle.ts"];

const variableContentReadsIn = (files: string[]): string[] =>
  files
    .filter((file) =>
      /(?<![\w$.])content\??\.?\[/.test(fs.readFileSync(file, "utf8"))
    )
    .map((file) => path.relative(IIIF, file));

// Strings each locale writes the same as en-GB because they're the same word
// in that language, not because they're untranslated.
const SAME_AS_ENGLISH: Record<string, string[]> = {
  "cy-GB": ["$logo"],
  "fr-FR": [
    "$attribution",
    "$audioVolume",
    "$date",
    "$description",
    "$index",
    "$logo",
    "$page",
    "$pause",
    "$volume",
  ],
  "pl-PL": ["$logo"],
  "sv-SE": ["$index"],
};

const locales = fs
  .readdirSync(LOCALES)
  .filter((file) => file.endsWith(".json"))
  .map((file) => ({
    locale: file.replace(".json", ""),
    strings: JSON.parse(fs.readFileSync(path.join(LOCALES, file), "utf8")),
  }));

describe.each(COMPONENTS)("$name", ({ files, keys, panels }) => {
  it("is given content by at least one panel", () => {
    expect(keys.length).toBeGreaterThan(0);
    expect(panelContents(panels).length).toBeGreaterThan(0);
  });

  it("reads content keys given in a variable only where they're listed", () => {
    expect(variableContentReadsIn(files)).toEqual(
      VARIABLE_CONTENT_READS.filter((file) =>
        files.includes(path.join(IIIF, file))
      )
    );
  });

  it("has every content key it reads in each panel that gives it content", () => {
    const missing = panelContents(panels).flatMap(({ where, content }) =>
      keys.filter((key) => !(key in content)).map((key) => `${where}: ${key}`)
    );
    expect(missing).toEqual([]);
  });

  it("refers to the locales for every content key, rather than writing English", () => {
    const written = panelContents(panels).flatMap(({ where, content }) =>
      keys
        .filter(
          (key) => key in content && !String(content[key]).startsWith("$")
        )
        .map((key) => `${where}: ${key} = ${JSON.stringify(content[key])}`)
    );
    expect(written).toEqual([]);
  });

  it("has every content key translated in every locale", () => {
    const references = unique(
      panelContents(panels).flatMap(({ content }) =>
        keys
          .map((key) => content[key])
          .filter((value) => typeof value === "string" && value.startsWith("$"))
      )
    );
    const untranslated = locales.flatMap(({ locale, strings }) =>
      references
        .filter((reference) => !(reference in strings))
        .map((reference) => `${locale}: ${reference}`)
    );
    expect(untranslated).toEqual([]);

    // Not left in English: other than en-GB's own, each language's string
    // differs from en-GB's, unless it's listed as the same word.
    const english = locales.find(({ locale }) => locale === "en-GB")!.strings;
    const leftInEnglish = locales
      .filter(({ locale }) => !locale.startsWith("en"))
      .flatMap(({ locale, strings }) =>
        references
          .filter(
            (reference) =>
              strings[reference] === english[reference] &&
              !(SAME_AS_ENGLISH[locale] || []).includes(reference)
          )
          .map((reference) => `${locale}: ${reference}`)
      );
    expect(leftInEnglish).toEqual([]);
  });
});
