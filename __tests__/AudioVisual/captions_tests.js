let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl, expectPanelTitle } = require("../../scripts/testViewer");

// Captions in UV's two audio/video players: the mediaelement player, for
// manifests without ranges, and the AV component, for manifests with ranges.
// Both show the same captions control (a button and menu) and overlay, from
// uv-captions-module. UV finds captions wherever a manifest declares them: a
// text/vtt or text/srt rendering of the canvas, a body of the painting
// annotation, or a supplementing annotation (IIIF cookbook recipe 0219),
// inline or in an annotation page referenced by id, whose body may be a
// Choice of languages (recipe 0074).
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

// English, Welsh and French captions, in that order, as a Choice (recipe
// 0074), for each player. Their labels are in English, Welsh and French. The
// AV component's has ranges, with a second range starting inside the second
// cue.
const PLAYERS = [
  [
    "the mediaelement player",
    {
      manifest: fixture("multiple-language-captions-video-manifest.json"),
      title: "Video with captions in multiple languages (e2e test fixture)",
      panel: "mediaElementCenterPanel",
    },
  ],
  [
    "the AV component",
    {
      manifest: fixture("ranges-captioned-video-manifest.json"),
      title: "Lunchroom Manners",
      panel: "avCenterPanel",
    },
  ],
];

// The caption file is fetched by the browser, so a cross-origin one is only
// readable when every response hop (including any redirect) carries an
// Access-Control-Allow-Origin header. fixtures.iiif.io serves CORS headers on
// a direct https URL; the redirected fixture references the VTT through
// http://dlib.indiana.edu, whose 301 upgrade redirect carries none, so UV
// resolves it to its https destination (resolveCaptionSource).
const CAPTIONED_MANIFEST = fixture("captioned-video-manifest.json");
const SRT_CAPTIONED_MANIFEST = fixture("srt-captioned-video-manifest.json");
const CROSS_ORIGIN_CAPTIONED_MANIFEST = fixture(
  "cross-origin-captioned-video-manifest.json"
);
const REDIRECTED_CAPTIONED_MANIFEST = fixture(
  "redirected-captioned-video-manifest.json"
);
// The IIIF cookbook's own example of a captioned video: the VTT is a
// supplementing annotation in an inline annotation page on the canvas.
const COOKBOOK_CAPTION_MANIFEST =
  "https://iiif.io/api/cookbook/recipe/0219-using-caption-file/manifest.json";
const SUPPLEMENTING_EXTERNAL_MANIFEST = fixture(
  "supplementing-external-captioned-video-manifest.json"
);
const CAPTIONED_AUDIO_MANIFEST = fixture("captioned-audio-manifest.json");

// The Welsh SRT with a label that's a language map, English first and Welsh
// second, so honouring the user's locale means choosing a value other than
// the first. One fixture per way a manifest can supply captions.
const MULTILINGUAL_LABEL_MANIFESTS = [
  [
    "a supplementing annotation",
    fixture("multilingual-label-captioned-video-manifest.json"),
  ],
  [
    "the painting annotation",
    fixture("multilingual-label-painting-captioned-video-manifest.json"),
  ],
  [
    "a canvas rendering",
    fixture("multilingual-label-rendering-captioned-video-manifest.json"),
  ],
];

// Manifests with ranges, for the AV component. Each canvas plays on its own
// unless the manifest has the auto-advance behavior, which joins its canvases
// into one timeline (shown in the index view).
// - Three canvases on one timeline: the first has English and Welsh
//   captions, the second English captions and a caption file that can't be
//   read, the third none.
// - Captions that target #t=30,60 of the canvas, with ranges before, during
//   and after them; once played on its own, once as a timeline.
// - Audio, whose captions only the overlay can show.
// - Two three-second canvases on one timeline, each with English captions,
//   so playback moves from one canvas' captions to the other's in seconds.
const RANGES_MULTI_CANVAS_MANIFEST = fixture(
  "ranges-multi-canvas-captioned-video-manifest.json"
);
const RANGES_OFFSET_MANIFEST = fixture(
  "ranges-offset-captioned-video-manifest.json"
);
const RANGES_OFFSET_TIMELINE_MANIFEST = fixture(
  "ranges-offset-timeline-captioned-video-manifest.json"
);
const RANGES_AUDIO_MANIFEST = fixture("ranges-captioned-audio-manifest.json");
const RANGES_SHORT_CANVASES_MANIFEST = fixture(
  "ranges-short-canvases-captioned-video-manifest.json"
);

const WELSH_CUE_1 =
  "Cafwyd sioe bypedau ei pherfformio yn yr ysgol, ychydig cyn cinio.";
const ENGLISH_CUE_1 =
  "Just before lunch one day, a puppet show was put on at school.";
const ENGLISH_CUE_2 = 'It was called "Mister Bungle Goes to Lunch".';
const FRENCH_CUE_1 =
  "Un jour, juste avant le déjeuner, un spectacle de marionnettes a été présenté à l'école.";

describe("Captions", () => {
  let browser;
  let context;
  let page;

  beforeAll(async () => {
    puppeteer = (await import("puppeteer")).default;
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  // The visible player: the mediaelement player's container, or one of the
  // AV component's players. The AV component keeps a player per canvas, plus
  // one for the timeline of an auto-advance manifest; only the one in use is
  // visible. Pass `virtual` to wait for the timeline's player (true) or a
  // canvas' (false).
  const visiblePlayer = async ({ virtual } = {}) =>
    (
      await page.waitForFunction(
        (virtual) =>
          [
            ...document.querySelectorAll(
              ".mejs__container, .iiif-av-component .player"
            ),
          ].find(
            (player) =>
              player.offsetParent !== null &&
              (virtual === undefined ||
                player.classList.contains("virtual") === virtual)
          ),
        {},
        virtual
      )
    ).asElement();

  // Loads a manifest and waits for its player to offer captions. Captions
  // choices are remembered in the browser, so each load is a new visitor's,
  // with nothing remembered, unless it's a `revisit`. A host's `config` is
  // applied through the examples page's Configuration tab, which starts the
  // viewer again with it.
  const load = async (
    manifestUrl,
    { locales, virtual, revisit, config } = {}
  ) => {
    if (!revisit) {
      if (context) {
        await context.close();
      }
      context = await browser.createBrowserContext();
      page = await context.newPage();
    }
    // Force a full reload so the viewer re-initialises on this manifest.
    await page.goto("about:blank");
    await page.goto(viewerUrl(manifestUrl, locales), {
      waitUntil: "domcontentloaded",
    });
    if (config) {
      await page.waitForSelector(".captions-button", { visible: true });
      await page.evaluate((config) => {
        document.querySelector(".centerPanel").classList.add("unconfigured");
        document.getElementById("customConfig").value = JSON.stringify(config);
        document.getElementById("setConfigButton").click();
      }, config);
      await page.waitForSelector(".centerPanel:not(.unconfigured)");
    }
    const player = await visiblePlayer({ virtual });
    await player.waitForSelector(".captions-button", { visible: true });
    await waitForStillButton(player);
    return player;
  };

  // Waits for the captions button to stop moving: the AV component lays its
  // players out again as they load, and a click aimed at where the button
  // was can miss it, especially when the machine is busy.
  const waitForStillButton = (player) =>
    page.waitForFunction(
      (player) => {
        const { x, y } = player
          .querySelector(".captions-button")
          .getBoundingClientRect();
        const still = player.__lastButtonAt === `${x},${y}`;
        player.__lastButtonAt = `${x},${y}`;
        return still;
      },
      { polling: 250 },
      player
    );

  // Plays the media (muted, so headless autoplay is allowed).
  const play = (player) =>
    player.$eval("video, audio", (media) => {
      media.muted = true;
      return media.play();
    });

  // The captions menu's language items, and its colour items.
  const menuLabels = (player) =>
    player.$$eval(".captions-languages [role=menuitemradio]", (items) =>
      items.map((item) => item.textContent)
    );

  const checkedLabel = (player) =>
    player.$eval(
      ".captions-languages [aria-checked=true]",
      (item) => item.textContent
    );

  const colourLabels = (player) =>
    player.$$eval(".captions-colours [role=menuitemradio]", (items) =>
      items.map((item) => item.textContent)
    );

  const checkedColour = (player) =>
    player.$eval(
      ".captions-colours [aria-checked=true]",
      (item) => item.textContent
    );

  // The overlay's colours, as rgb() values.
  const captionColours = (player) =>
    player.$eval(".captions-overlay", (overlay) => {
      const style = getComputedStyle(overlay);
      return { background: style.backgroundColor, color: style.color };
    });

  const menuItem = async (player, label) =>
    (
      await player.evaluateHandle(
        (player, label) =>
          [
            ...player.querySelectorAll(".captions-menu [role=menuitemradio]"),
          ].find((item) => item.textContent === label),
        label
      )
    ).asElement();

  const chooseCaptions = async (player, label) => {
    await (await player.$(".captions-button")).click();
    await player.waitForSelector(".captions-menu", { visible: true });
    await (await menuItem(player, label)).click();
  };

  const isMenuOpen = (player) =>
    player.$eval(".captions-menu", (menu) => menu.offsetParent !== null);

  const isButtonOn = (player) =>
    player.$eval(".captions-button", (b) => b.classList.contains("on"));

  const focusedText = () =>
    page.evaluate(() =>
      document.activeElement.classList.contains("captions-button")
        ? "(captions button)"
        : document.activeElement.textContent
    );

  // The captions control as the browser presents it to screen readers.
  const accessibleName = async (element) =>
    (await page.accessibility.snapshot({ root: element })).name;

  // The menu's groups, separator and items, as screen readers are given
  // them: the full accessibility tree, without the text nodes within names.
  const accessibleMenu = async (player) => {
    const menu = await page.accessibility.snapshot({
      root: await player.$(".captions-menu"),
      interestingOnly: false,
    });
    const roles = ["group", "separator", "menuitemradio"];
    const describe = ({ role, name, checked, children = [] }) => {
      const node =
        role === "menuitemradio" ? { role, name, checked } : { role, name };
      const items = children.filter((child) => roles.includes(child.role));
      return items.length ? { ...node, items: items.map(describe) } : node;
    };
    return describe(menu).items;
  };

  // Waits up to 15s for the overlay to show `expected` (null: no caption),
  // then checks it, so a failure reports what was shown instead.
  const expectCaption = async (player, expected) => {
    const shown = () =>
      player.$eval(".captions-overlay", (overlay) =>
        overlay.offsetParent === null ? null : overlay.textContent
      );
    for (let i = 0; i < 75 && (await shown()) !== expected; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    expect(await shown()).toBe(expected);
  };

  // THE SAME IN EVERY PLAYER
  describe.each(PLAYERS)("in %s", (_, { manifest, title, panel }) => {
    it("offers each caption track, starting with captions off", async () => {
      const player = await load(manifest);
      const button = await player.$(".captions-button");

      expect(
        await button.evaluate((b) => ({
          haspopup: b.getAttribute("aria-haspopup"),
          expanded: b.getAttribute("aria-expanded"),
        }))
      ).toEqual({ haspopup: "menu", expanded: "false" });
      expect(await isButtonOn(player)).toBe(false);
      expect(await isMenuOpen(player)).toBe(false);

      // UV's default locale is en-GB: English first, then the rest
      // alphabetically.
      expect(await menuLabels(player)).toEqual([
        "Off",
        "English captions",
        "French captions",
        "Welsh captions",
      ]);
      expect(await checkedLabel(player)).toBe("Off");
      await expectCaption(player, null);

      await expectPanelTitle(page, title);
    }, 60000);

    it("shows the chosen captions over the media", async () => {
      const player = await load(manifest);

      await chooseCaptions(player, "Welsh captions");

      await expectCaption(player, WELSH_CUE_1);
      expect(await checkedLabel(player)).toBe("Welsh captions");
      expect(await isMenuOpen(player)).toBe(false);
      expect(await isButtonOn(player)).toBe(true);
    }, 60000);

    it("shows the captions just above the player's controls", async () => {
      const player = await load(manifest);
      await chooseCaptions(player, "Welsh captions");
      await expectCaption(player, WELSH_CUE_1);

      const box = (selector) =>
        page.$eval(selector, (el) => {
          const { top, bottom, left, right } = el.getBoundingClientRect();
          return { top, bottom, left, right };
        });
      const overlay = await box(".captions-overlay");
      const panel = await box(".centerPanel");
      const controls = await player.$eval(
        ".mejs__controls, .options-container",
        (el) => el.getBoundingClientRect().top
      );

      // Wholly within the center panel, below its title, and ending within
      // 60px above the controls.
      expect(overlay.top).toBeGreaterThan(panel.top + 40);
      expect(overlay.left).toBeGreaterThanOrEqual(panel.left);
      expect(overlay.right).toBeLessThanOrEqual(panel.right);
      expect(overlay.bottom).toBeLessThanOrEqual(controls);
      expect(controls - overlay.bottom).toBeLessThan(60);
    }, 60000);

    it("can switch between languages and turn captions off", async () => {
      const player = await load(manifest);

      await chooseCaptions(player, "Welsh captions");
      await expectCaption(player, WELSH_CUE_1);

      await chooseCaptions(player, "English captions");
      await expectCaption(player, ENGLISH_CUE_1);

      await chooseCaptions(player, "Off");
      await expectCaption(player, null);
      expect(await checkedLabel(player)).toBe("Off");
      expect(await isButtonOn(player)).toBe(false);
    }, 60000);

    it("can be operated with the keyboard", async () => {
      const player = await load(manifest);
      const button = await player.$(".captions-button");
      const expanded = () =>
        button.evaluate((b) => b.getAttribute("aria-expanded"));

      // Arrow keys on the button open the menu on the checked item.
      await button.focus();
      await page.keyboard.press("ArrowDown");
      expect(await isMenuOpen(player)).toBe(true);
      expect(await expanded()).toBe("true");
      expect(await focusedText()).toBe("Off");

      // Arrow keys move through the items, on from the languages to the
      // colours, wrapping at either end.
      await page.keyboard.press("ArrowDown");
      expect(await focusedText()).toBe("English captions");
      await page.keyboard.press("ArrowDown");
      expect(await focusedText()).toBe("French captions");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      expect(await focusedText()).toBe("White on black");
      await page.keyboard.press("Home");
      expect(await focusedText()).toBe("Off");
      await page.keyboard.press("ArrowUp");
      expect(await focusedText()).toBe("Dark purple on yellow");
      await page.keyboard.press("End");
      expect(await focusedText()).toBe("Dark purple on yellow");

      // Enter chooses the item, closes the menu and returns focus.
      await page.keyboard.press("Home");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      expect(await focusedText()).toBe("Welsh captions");
      await page.keyboard.press("Enter");
      await expectCaption(player, WELSH_CUE_1);
      expect(await isMenuOpen(player)).toBe(false);
      expect(await expanded()).toBe("false");
      expect(await focusedText()).toBe("(captions button)");

      // Escape closes the menu without changing the captions.
      await page.keyboard.press("Enter");
      expect(await focusedText()).toBe("Welsh captions");
      await page.keyboard.press("Escape");
      expect(await isMenuOpen(player)).toBe(false);
      expect(await focusedText()).toBe("(captions button)");
      expect(await checkedLabel(player)).toBe("Welsh captions");

      // Space chooses too.
      await page.keyboard.press("Enter");
      await page.keyboard.press("Home");
      await page.keyboard.press(" ");
      await expectCaption(player, null);
      expect(await checkedLabel(player)).toBe("Off");

      // Tab moves on, closing the menu.
      await page.keyboard.press("Enter");
      await page.keyboard.press("Tab");
      expect(await isMenuOpen(player)).toBe(false);
      expect(await expanded()).toBe("false");
    }, 60000);

    it("tells screen readers which captions are showing", async () => {
      const player = await load(manifest);
      const button = await player.$(".captions-button");

      expect(await accessibleName(button)).toBe("Captions: Off");

      await chooseCaptions(player, "Welsh captions");
      expect(await accessibleName(button)).toBe("Captions: Welsh captions");
      expect(await button.evaluate((b) => b.title)).toBe(
        "Captions: Welsh captions"
      );

      await chooseCaptions(player, "Off");
      expect(await accessibleName(button)).toBe("Captions: Off");
    }, 60000);

    it("presents the menu items to screen readers by name, with their checked state", async () => {
      const player = await load(manifest);

      await chooseCaptions(player, "Welsh captions");
      await (await player.$(".captions-button")).click();

      // The check mark and colour samples are drawn, not written, so they
      // aren't read out as part of an item's name.
      const item = (name, checked = false) => ({
        role: "menuitemradio",
        name,
        checked,
      });
      expect(await accessibleMenu(player)).toEqual([
        {
          role: "group",
          name: "Languages",
          items: [
            item("Off"),
            item("English captions"),
            item("French captions"),
            item("Welsh captions", true),
          ],
        },
        { role: "separator", name: "" },
        {
          role: "group",
          name: "Colours",
          items: [
            item("White on black", true),
            item("Black on white"),
            item("Dark blue on peach"),
            item("Dark red on mint"),
            item("Dark purple on yellow"),
          ],
        },
      ]);
    }, 60000);

    it("fits the whole menu in a short player, scrolling it if it must", async () => {
      const player = await load(manifest);
      await page.setViewport({ width: 800, height: 520 });
      await waitForStillButton(player);

      await (await player.$(".captions-button")).focus();
      await page.keyboard.press("ArrowDown");

      // Each item, reached by keyboard, is the topmost element at its centre:
      // shown, not clipped or covered, so it can also be clicked.
      const items = (await menuLabels(player)).length + 5;
      const reachable = [];
      for (let i = 0; i < items; i++) {
        reachable.push(
          await page.evaluate(() => {
            const item = document.activeElement;
            const box = item.getBoundingClientRect();
            const top = document.elementFromPoint(
              box.left + box.width / 2,
              box.top + box.height / 2
            );
            return `${item.textContent}: ${
              top === item || item.contains(top) ? "reachable" : "hidden"
            }`;
          })
        );
        await page.keyboard.press("ArrowDown");
      }
      expect(reachable.filter((item) => item.endsWith("hidden"))).toEqual([]);
    }, 60000);

    it("closes the menu when focus moves elsewhere", async () => {
      const player = await load(manifest);
      const button = await player.$(".captions-button");

      await button.focus();
      await page.keyboard.press("ArrowDown");
      expect(await isMenuOpen(player)).toBe(true);

      // e.g. a screen reader moving focus to the play button
      await (
        await player.$(
          ".mejs__playpause-button button, .controls-container button:has(.av-icon-play)"
        )
      ).focus();
      expect(await isMenuOpen(player)).toBe(false);
      expect(
        await button.evaluate((b) => b.getAttribute("aria-expanded"))
      ).toBe("false");
    }, 60000);

    it("closes the menu when clicking elsewhere", async () => {
      const player = await load(manifest);

      await (await player.$(".captions-button")).click();
      expect(await isMenuOpen(player)).toBe(true);

      await page.click(".centerPanel h1.title");
      expect(await isMenuOpen(player)).toBe(false);
      expect(await checkedLabel(player)).toBe("Off");
    }, 60000);

    it("labels the captions control in the user's language", async () => {
      const player = await load(manifest, { locales: "cy-GB" });

      expect(
        await player.$eval(".captions-button", (b) => ({
          title: b.title,
          text: b.querySelector(".sr-only").textContent,
        }))
      ).toEqual({
        title: "Capsiynau: I ffwrdd",
        text: "Capsiynau: I ffwrdd",
      });
      expect(
        await player.$eval(".captions-menu", (menu) =>
          menu.getAttribute("aria-label")
        )
      ).toBe("Capsiynau");
      // Welsh first, then the rest alphabetically by their Welsh labels.
      expect(await menuLabels(player)).toEqual([
        "I ffwrdd",
        "Capsiynau Cymraeg",
        "Capsiynau Ffrangeg",
        "Capsiynau Saesneg",
      ]);
    }, 60000);

    it("lists a French user's captions in French first, and shows them", async () => {
      const player = await load(manifest, { locales: "fr-FR" });

      expect(await menuLabels(player)).toEqual([
        "Désactivé",
        "Sous-titres français",
        "Sous-titres anglais",
        "Sous-titres gallois",
      ]);

      await chooseCaptions(player, "Sous-titres français");
      await expectCaption(player, FRENCH_CUE_1);
    }, 60000);

    it("offers five caption colours, starting with white on black", async () => {
      const player = await load(manifest);

      expect(await colourLabels(player)).toEqual([
        "White on black",
        "Black on white",
        "Dark blue on peach",
        "Dark red on mint",
        "Dark purple on yellow",
      ]);
      expect(await checkedColour(player)).toBe("White on black");

      await chooseCaptions(player, "Welsh captions");
      expect(await captionColours(player)).toEqual({
        background: "rgb(0, 0, 0)",
        color: "rgb(255, 255, 255)",
      });
    }, 60000);

    it("shows captions in the chosen colours", async () => {
      const player = await load(manifest);

      await chooseCaptions(player, "Welsh captions");
      await chooseCaptions(player, "Dark blue on peach");

      // The colours change; the captions stay on.
      await expectCaption(player, WELSH_CUE_1);
      expect(await captionColours(player)).toEqual({
        background: "rgb(255, 229, 208)",
        color: "rgb(11, 42, 91)",
      });
      expect(await checkedColour(player)).toBe("Dark blue on peach");
      expect(await checkedLabel(player)).toBe("Welsh captions");
    }, 60000);

    it("remembers the chosen captions and colours on the next visit", async () => {
      const player = await load(manifest);
      await chooseCaptions(player, "Welsh captions");
      await chooseCaptions(player, "Dark red on mint");

      // Captions are on, in the same language and colours, without choosing.
      const nextVisit = await load(manifest, { revisit: true });
      await expectCaption(nextVisit, WELSH_CUE_1);
      expect(await checkedLabel(nextVisit)).toBe("Welsh captions");
      expect(await checkedColour(nextVisit)).toBe("Dark red on mint");
      expect(await captionColours(nextVisit)).toEqual({
        background: "rgb(212, 245, 228)",
        color: "rgb(92, 15, 46)",
      });

      // Turning captions off is remembered too.
      await chooseCaptions(nextVisit, "Off");
      const visitAfter = await load(manifest, { revisit: true });
      await expectCaption(visitAfter, null);
      expect(await checkedLabel(visitAfter)).toBe("Off");
      expect(await checkedColour(visitAfter)).toBe("Dark red on mint");
    }, 90000);

    it("offers the colours, and their names, the host configures", async () => {
      const player = await load(manifest, {
        config: {
          modules: {
            [panel]: {
              options: {
                captionStyles: [
                  {
                    label: "Indigo on sand",
                    color: "#36096e",
                    background: "#faefcd",
                  },
                  {
                    label: "Smoke on soot",
                    color: "#f2f2f0",
                    background: "#24241e",
                  },
                ],
              },
            },
          },
        },
      });

      expect(await colourLabels(player)).toEqual([
        "Indigo on sand",
        "Smoke on soot",
      ]);
      expect(await checkedColour(player)).toBe("Indigo on sand");

      await chooseCaptions(player, "Welsh captions");
      expect(await captionColours(player)).toEqual({
        background: "rgb(250, 239, 205)",
        color: "rgb(54, 9, 110)",
      });

      await chooseCaptions(player, "Smoke on soot");
      await expectCaption(player, WELSH_CUE_1);
      expect(await captionColours(player)).toEqual({
        background: "rgb(36, 36, 30)",
        color: "rgb(242, 242, 240)",
      });
    }, 60000);

    it("labels the colours in the user's language", async () => {
      const player = await load(manifest, { locales: "cy-GB" });

      expect(await colourLabels(player)).toEqual([
        "Gwyn ar ddu",
        "Du ar wyn",
        "Glas tywyll ar eirin gwlanog",
        "Coch tywyll ar fintys",
        "Porffor tywyll ar felyn",
      ]);
    }, 60000);

    it("lists every language alphabetically when none is the user's", async () => {
      // UV ships a Swedish locale, but there are no Swedish captions, and
      // the labels have no Swedish, so their first (English) value is used.
      const player = await load(manifest, { locales: "sv-SE" });

      expect(await menuLabels(player)).toEqual([
        "Av",
        "English captions",
        "French captions",
        "Welsh captions",
      ]);
    }, 60000);
  });

  it("remembers the chosen captions and colours from one player to the other", async () => {
    const mediaelement = await load(PLAYERS[0][1].manifest);
    await chooseCaptions(mediaelement, "Welsh captions");
    await chooseCaptions(mediaelement, "Dark purple on yellow");

    const avComponent = await load(PLAYERS[1][1].manifest, { revisit: true });
    await expectCaption(avComponent, WELSH_CUE_1);
    expect(await checkedColour(avComponent)).toBe("Dark purple on yellow");
  }, 90000);

  // WHEREVER THE MANIFEST DECLARES THEM (MEDIAELEMENT PLAYER)
  describe("found in the manifest", () => {
    it("shows captions from a body of the painting annotation", async () => {
      const player = await load(CAPTIONED_MANIFEST);

      await chooseCaptions(player, "English captions");
      await expectCaption(player, ENGLISH_CUE_1);

      await expectPanelTitle(page, "Video with captions (e2e test fixture)");
    }, 60000);

    it("shows captions from an SRT file", async () => {
      const player = await load(SRT_CAPTIONED_MANIFEST);

      await chooseCaptions(player, "Welsh SRT captions");
      await expectCaption(player, WELSH_CUE_1);
    }, 60000);

    it("shows cross-origin captions served with CORS headers", async () => {
      const player = await load(CROSS_ORIGIN_CAPTIONED_MANIFEST);

      // The first cue ("[music]") starts 1.2s in.
      await chooseCaptions(player, "English captions");
      await play(player);
      await expectCaption(player, "[music]");

      await expectPanelTitle(
        page,
        "Video with cross-origin captions (e2e test fixture)"
      );
    }, 60000);

    it("shows captions behind an institutional redirect", async () => {
      const player = await load(REDIRECTED_CAPTIONED_MANIFEST);

      await chooseCaptions(player, "English captions");
      await play(player);
      await expectCaption(player, "[music]");

      await expectPanelTitle(
        page,
        "Video with captions behind a redirect (e2e test fixture)"
      );
    }, 60000);

    it("shows captions from a supplementing annotation (cookbook 0219)", async () => {
      const player = await load(COOKBOOK_CAPTION_MANIFEST);

      await chooseCaptions(player, "Captions in WebVTT format");
      await play(player);
      await expectCaption(player, "[music]");

      await expectPanelTitle(page, "Lunchroom Manners");
    }, 60000);

    it("shows captions from an annotation page referenced by id", async () => {
      const player = await load(SUPPLEMENTING_EXTERNAL_MANIFEST);

      await chooseCaptions(player, "English captions");
      await expectCaption(player, ENGLISH_CUE_1);

      await expectPanelTitle(
        page,
        "Video with captions in an external annotation page (e2e test fixture)"
      );
    }, 60000);

    it("shows captions for audio in the overlay, just above the controls", async () => {
      const player = await load(CAPTIONED_AUDIO_MANIFEST);

      await chooseCaptions(player, "English captions");
      await expectCaption(player, "[Orchestra playing]");

      const overlay = await player.$eval(".captions-overlay", (el) =>
        el.getBoundingClientRect().toJSON()
      );
      const controls = await player.$eval(".mejs__controls", (el) =>
        el.getBoundingClientRect().toJSON()
      );
      expect(overlay.height).toBeGreaterThan(0);
      expect(overlay.bottom).toBeLessThanOrEqual(controls.top);
      expect(controls.top - overlay.bottom).toBeLessThan(60);
    }, 60000);

    describe.each(MULTILINGUAL_LABEL_MANIFESTS)(
      "with a multilingual label on %s",
      (_, manifest) => {
        it("labels the captions in the user's language when the label has a match", async () => {
          // cy-GB matches the label's "cy" entry, which is not the first one.
          const player = await load(manifest, { locales: "cy-GB" });
          expect(await menuLabels(player)).toEqual([
            "I ffwrdd",
            "Capsiynau Cymraeg",
          ]);
        }, 60000);

        it("falls back to the label's first language when there is no match", async () => {
          // UV ships a Swedish locale, but the label has no "sv" entry.
          const player = await load(manifest, { locales: "sv-SE" });
          expect(await menuLabels(player)).toEqual(["Av", "Welsh captions"]);
        }, 60000);
      }
    );
  });

  // ACROSS RANGES, CANVASES AND VIEWS (AV COMPONENT)
  describe("with ranges", () => {
    // Switches the contents panel to the index (tree) view or the thumbnails
    // view. An auto-advance manifest plays as one timeline in the index view
    // (pass `virtual: true` to wait for its player) and per canvas in the
    // thumbnails view.
    const showView = async (view, { virtual } = {}) => {
      await page.click(`.leftPanel .${view}.tab`);
      const player = await visiblePlayer({ virtual });
      await player.waitForSelector(".captions-button", { visible: true });
      await waitForStillButton(player);
      return player;
    };

    // Plays a range, as chosen from the index view's table of contents.
    const goToRange = async (label) => {
      const link = await page.evaluateHandle(
        (label) =>
          [...document.querySelectorAll(".leftPanel a")].find(
            (a) => a.offsetParent !== null && a.textContent.trim() === label
          ),
        label
      );
      await link.asElement().click();
      await expectPanelTitle(page, label);
    };

    // Shows a canvas, as chosen from the thumbnails view.
    const goToThumbnail = async (index) => {
      await page.click(`.leftPanel #thumb-${index}`);
      const player = await visiblePlayer({ virtual: false });
      await player.waitForSelector(".captions-button", { visible: true });
      await waitForStillButton(player);
      return player;
    };

    it("shows the cue for the current time as playback moves", async () => {
      await load(PLAYERS[1][1].manifest);
      const player = await showView("index");

      await chooseCaptions(player, "English captions");
      await expectCaption(player, ENGLISH_CUE_1);

      // The second range starts 25s in, during the second cue.
      await goToRange("Mister Bungle");
      await expectCaption(player, ENGLISH_CUE_2);

      await goToRange("The puppet show");
      await expectCaption(player, ENGLISH_CUE_1);
    }, 60000);

    it("keeps the menu open as playback moves to another canvas", async () => {
      await load(RANGES_SHORT_CANVASES_MANIFEST);
      const player = await showView("index", { virtual: true });

      await (
        await player.$(".controls-container button:has(.av-icon-play)")
      ).click();
      await (await player.$(".captions-button")).focus();
      await page.keyboard.press("ArrowDown");
      expect(await menuLabels(player)).toEqual(["Off", "English captions"]);

      // Part two's captions replace part one's in the open menu, with focus
      // kept in it.
      await page.waitForFunction(
        (player) =>
          player
            .querySelector(".captions-menu")
            .textContent.includes("part two"),
        { timeout: 15000 },
        player
      );
      expect(await menuLabels(player)).toEqual([
        "Off",
        "English captions (part two)",
      ]);
      expect(await isMenuOpen(player)).toBe(true);
      expect(await focusedText()).toBe("Off");
    }, 60000);

    it("keeps the chosen language as the timeline moves between canvases", async () => {
      await load(RANGES_MULTI_CANVAS_MANIFEST);
      const player = await showView("index", { virtual: true });

      await chooseCaptions(player, "Welsh captions");
      await expectCaption(player, WELSH_CUE_1);

      // Part two has no Welsh captions, so none show, and its unreadable
      // French caption file isn't offered.
      await goToRange("Part two");
      await expectCaption(player, null);
      expect(await menuLabels(player)).toEqual([
        "Off",
        "English captions (part two)",
      ]);
      expect(await checkedLabel(player)).toBe("Off");

      // Part three has no captions at all, so no captions control.
      await goToRange("Part three");
      await player.waitForSelector(".captions", { hidden: true });

      // Back on part one, the Welsh captions return.
      await goToRange("Part one");
      await player.waitForSelector(".captions", { visible: true });
      await expectCaption(player, WELSH_CUE_1);
      expect(await checkedLabel(player)).toBe("Welsh captions");
    }, 90000);

    it("shows another canvas' captions in the chosen language", async () => {
      await load(RANGES_MULTI_CANVAS_MANIFEST);
      const player = await showView("index", { virtual: true });

      await chooseCaptions(player, "English captions");
      await expectCaption(player, ENGLISH_CUE_1);

      await goToRange("Part two");
      await expectCaption(player, "Part two begins.");
      expect(await checkedLabel(player)).toBe("English captions (part two)");
    }, 90000);

    it("keeps the chosen language from canvas to canvas", async () => {
      const partOne = await load(RANGES_MULTI_CANVAS_MANIFEST, {
        virtual: false,
      });

      await chooseCaptions(partOne, "Welsh captions");
      await expectCaption(partOne, WELSH_CUE_1);

      const partTwo = await goToThumbnail(1);
      await partTwo.waitForSelector(".captions-button", { visible: true });
      await expectCaption(partTwo, null);
      expect(await checkedLabel(partTwo)).toBe("Off");

      const partOneAgain = await goToThumbnail(0);
      await expectCaption(partOneAgain, WELSH_CUE_1);
      expect(await checkedLabel(partOneAgain)).toBe("Welsh captions");
    }, 90000);

    it("keeps the chosen captions when switching views", async () => {
      await load(RANGES_MULTI_CANVAS_MANIFEST);
      const timeline = await showView("index", { virtual: true });

      await chooseCaptions(timeline, "Welsh captions");
      await expectCaption(timeline, WELSH_CUE_1);

      const canvas = await showView("thumbs", { virtual: false });
      await expectCaption(canvas, WELSH_CUE_1);
      expect(await checkedLabel(canvas)).toBe("Welsh captions");
    }, 90000);

    it.each([
      ["played on its own", RANGES_OFFSET_MANIFEST, false],
      ["played as a timeline", RANGES_OFFSET_TIMELINE_MANIFEST, true],
    ])(
      "places captions that target part of a canvas (%s)",
      async (_, manifest, virtual) => {
        await load(manifest);
        const player = await showView("index", { virtual });

        // The captions start 30s into the canvas, after the first range.
        await chooseCaptions(player, "English captions");
        await expectCaption(player, null);

        await goToRange("Captioned");
        await expectCaption(player, ENGLISH_CUE_1);

        // They end 60s in, where the third range starts.
        await goToRange("After the captions");
        await expectCaption(player, null);
      },
      90000
    );

    it("shows captions for audio in the overlay", async () => {
      await load(RANGES_AUDIO_MANIFEST);
      const player = await showView("index");

      await chooseCaptions(player, "English captions");
      await expectCaption(player, "[Orchestra playing]");

      await goToRange("Continued");
      await expectCaption(player, "[Horns]");
    }, 60000);
  });
});
