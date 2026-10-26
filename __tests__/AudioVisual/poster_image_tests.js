const puppeteer = require("puppeteer");
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl } = require("../../scripts/testViewer");

// The image accompanying audio in the AV component (manifests with ranges):
// it starts collapsed in the corner of the player, or expanded to fill it
// when avCenterPanel's posterImageExpanded option is set, and its button
// expands and collapses it.
const MANIFEST = `${BASE_URL}/test-fixtures/ranges-accompanying-image-audio-manifest.json`;
const POSTER = ".iiif-av-component .poster-image";

describe("AV component poster image", () => {
  let browser;
  let context;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  // Loads the manifest as a new visitor, with config applied through the
  // examples page's Configuration tab (which starts the viewer again with
  // it), and waits for the poster image.
  const load = async (config) => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(viewerUrl(MANIFEST), { waitUntil: "domcontentloaded" });
    if (config) {
      await page.waitForSelector(POSTER, { visible: true });
      await page.evaluate(
        (config, selector) => {
          document.querySelector(selector).classList.add("unconfigured");
          document.getElementById("customConfig").value =
            JSON.stringify(config);
          document.getElementById("setConfigButton").click();
        },
        config,
        POSTER
      );
      await page.waitForSelector(`${POSTER}:not(.unconfigured)`);
    }
    await page.waitForSelector(POSTER, { visible: true });
    // Gives the image time to be sized for the player.
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  // Whether the image fills the player, and its button's accessible name.
  const poster = async () => {
    const fills = await page.evaluate((selector) => {
      const image = document.querySelector(selector).getBoundingClientRect();
      const player = document
        .querySelector(".iiif-av-component")
        .getBoundingClientRect();
      return Math.round(image.width) >= Math.round(player.width) - 1;
    }, POSTER);
    const button = await page.$(`${POSTER} button`);
    const { name } = await page.accessibility.snapshot({ root: button });
    return { fills, button: name };
  };

  it("starts collapsed", async () => {
    await load();
    expect(await poster()).toEqual({
      fills: false,
      button: "Expand poster image",
    });
  });

  it("starts expanded when configured to", async () => {
    await load({
      modules: { avCenterPanel: { options: { posterImageExpanded: true } } },
    });
    expect(await poster()).toEqual({
      fills: true,
      button: "Collapse poster image",
    });
  });

  it("collapses with its button when it started expanded", async () => {
    await load({
      modules: { avCenterPanel: { options: { posterImageExpanded: true } } },
    });
    await page.click(POSTER);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(await poster()).toEqual({
      fills: false,
      button: "Expand poster image",
    });
  });
});
