let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl } = require("../../scripts/testViewer");

// A host's own caption colours (captionStyles) hold: captions are shown in
// them, and they're named in the user's language:
// a "$key" label is read from the locale files (src/locales) once the host's
// config is merged in, as UV's own "$key" content is. These use UV's own
// keys for the nearest of its names, as a host would add its own keys to the
// locale files. The config is applied through the examples page's
// Configuration tab, which starts the viewer again with it, as a host's
// uv.on("configure") would.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

const PLAYERS = [
  [
    "the mediaelement player",
    {
      manifest: fixture("multiple-language-captions-video-manifest.json"),
      panel: "mediaElementCenterPanel",
    },
  ],
  [
    "the AV component",
    {
      manifest: fixture("ranges-captioned-video-manifest.json"),
      panel: "avCenterPanel",
    },
  ],
];

// The host's colours, named by locale keys, for a center panel.
const config = (panel) => ({
  modules: {
    [panel]: {
      options: {
        captionStyles: [
          {
            label: "$captionDarkPurpleOnYellow",
            color: "#36096e",
            background: "#faefcd",
          },
          {
            label: "$captionWhiteOnBlack",
            color: "#f2f2f0",
            background: "#24241e",
          },
        ],
      },
    },
  },
});

describe.each(PLAYERS)("Custom caption colours in %s", (_, player) => {
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

  // Loads the manifest as a new visitor in the given locales, applies the
  // host's config, and returns the visible player once its captions button
  // has stopped moving (the AV component lays its players out again as they
  // load, and a click aimed at where the button was can miss it).
  const load = async (locales) => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    await page.goto(viewerUrl(player.manifest, locales), {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(".captions-button", { visible: true });
    await page.evaluate((config) => {
      document.querySelector(".centerPanel").classList.add("unconfigured");
      document.getElementById("customConfig").value = JSON.stringify(config);
      document.getElementById("setConfigButton").click();
    }, config(player.panel));
    await page.waitForSelector(".centerPanel:not(.unconfigured)");
    const shown = (
      await page.waitForFunction(() =>
        [
          ...document.querySelectorAll(
            ".mejs__container, .iiif-av-component .player"
          ),
        ].find((player) => player.offsetParent !== null)
      )
    ).asElement();
    await shown.waitForSelector(".captions-button", { visible: true });
    await page.waitForFunction(
      (player) => {
        const { x, y } = player
          .querySelector(".captions-button")
          .getBoundingClientRect();
        const still = player.__lastButtonAt === `${x},${y}`;
        player.__lastButtonAt = `${x},${y}`;
        return still;
      },
      { polling: 250 },
      shown
    );
    return shown;
  };

  // The colour names the captions menu offers.
  const colourNames = (shown) =>
    shown.$$eval(".captions-colours [role=menuitemradio]", (items) =>
      items.map((item) => item.textContent)
    );

  // Opens the captions menu and chooses an item from one of its groups
  // (".captions-languages" or ".captions-colours"), by name or position.
  const choose = async (shown, group, item) => {
    await (await shown.$(".captions-button")).click();
    await shown.waitForSelector(".captions-menu", { visible: true });
    const items = await shown.$$(`${group} [role=menuitemradio]`);
    const names = await Promise.all(
      items.map((i) => i.evaluate((i) => i.textContent))
    );
    await items[typeof item === "number" ? item : names.indexOf(item)].click();
  };

  // The overlay's colours, as rgb() values.
  const overlayColours = (shown) =>
    shown.$eval(".captions-overlay", (overlay) => {
      const style = getComputedStyle(overlay);
      return { background: style.backgroundColor, color: style.color };
    });

  it("names the host's colours from the English locale", async () => {
    expect(await colourNames(await load("en-GB"))).toEqual([
      "Dark purple on yellow",
      "White on black",
    ]);
  }, 60000);

  it("names the host's colours from the Welsh locale", async () => {
    expect(await colourNames(await load("cy-GB"))).toEqual([
      "Porffor tywyll ar felyn",
      "Gwyn ar ddu",
    ]);
  }, 60000);

  // Naming the colours from the locale leaves the host's colours as they
  // configured them: the overlay shows the first until another is chosen.
  it("shows captions in the host's own colours", async () => {
    const shown = await load("cy-GB");

    // The first caption track (after "Off").
    await choose(shown, ".captions-languages", 1);
    expect(await overlayColours(shown)).toEqual({
      background: "rgb(250, 239, 205)",
      color: "rgb(54, 9, 110)",
    });

    await choose(shown, ".captions-colours", "Gwyn ar ddu");
    expect(await overlayColours(shown)).toEqual({
      background: "rgb(36, 36, 30)",
      color: "rgb(242, 242, 240)",
    });
  }, 60000);
});
