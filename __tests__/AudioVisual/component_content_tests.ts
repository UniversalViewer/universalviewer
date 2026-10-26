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
        fs.readFileSync(file, "utf8").match(/(?<![\w$])content\??\.\w+/g) ||
        []
      ).map((read) => read.replace(/^content\??\./, ""))
    )
  );

const COMPONENTS = [
  {
    name: "the AV component",
    keys: [
      ...contentKeysIn(
        sources(
          "modules/iiif-av-component-module",
          "modules/uv-captions-module"
        )
      ),
      // The names of UV's own caption colours, looked up by style.
      ...BUILT_IN_CAPTION_STYLES.map((style) => style.nameKey),
    ],
    panels: ["avCenterPanel"],
  },
  {
    name: "the MediaElement player",
    keys: [
      ...contentKeysIn(
        sources(
          "modules/uv-mediaelementcenterpanel-module",
          "modules/uv-captions-module"
        )
      ),
      // The names of UV's own caption colours, looked up by style.
      ...BUILT_IN_CAPTION_STYLES.map((style) => style.nameKey),
    ],
    panels: ["mediaElementCenterPanel"],
  },
  {
    name: "the gallery",
    keys: contentKeysIn(
      sources("modules/uv-shared-module/GalleryComponent.ts")
    ),
    panels: ["contentLeftPanel", "multiSelectDialogue"],
  },
  {
    name: "the metadata panel",
    keys: contentKeysIn(
      sources("modules/uv-shared-module/MetadataComponent.ts")
    ),
    panels: ["moreInfoRightPanel"],
  },
];

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

const locales = fs
  .readdirSync(LOCALES)
  .filter((file) => file.endsWith(".json"))
  .map((file) => ({
    locale: file.replace(".json", ""),
    strings: JSON.parse(fs.readFileSync(path.join(LOCALES, file), "utf8")),
  }));

describe.each(COMPONENTS)("$name", ({ keys, panels }) => {
  it("is given content by at least one panel", () => {
    expect(keys.length).toBeGreaterThan(0);
    expect(panelContents(panels).length).toBeGreaterThan(0);
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
  });
});
