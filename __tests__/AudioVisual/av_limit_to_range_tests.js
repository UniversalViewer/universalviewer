let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl } = require("../../scripts/testViewer");

// avCenterPanel's limitToRange option limits the AV component's timeline to
// the range chosen, including on the timeline that plays a manifest's
// canvases as one (auto-advance), shown in the index view. Each of this
// manifest's three ranges is one whole canvas, 572 seconds long; together
// they're 1716 seconds.
const MANIFEST = `${BASE_URL}/test-fixtures/ranges-multi-canvas-captioned-video-manifest.json`;
// The handle of the timeline that plays the canvases as one.
const TIMELINE =
  ".iiif-av-component .player.virtual .canvas-timeline-container .ui-slider-handle";

describe("The AV component's limitToRange option", () => {
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

  // Loads the manifest as a new visitor, with config applied through the
  // examples page's Configuration tab (which starts the viewer again with
  // it), and opens the index view.
  const load = async (config) => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(viewerUrl(MANIFEST), { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".leftPanel .index.tab", { visible: true });
    if (config) {
      await page.evaluate((config) => {
        document.querySelector(".leftPanel").classList.add("unconfigured");
        document.getElementById("customConfig").value = JSON.stringify(config);
        document.getElementById("setConfigButton").click();
      }, config);
      await page.waitForSelector(".leftPanel:not(.unconfigured) .index.tab", {
        visible: true,
      });
    }
    await page.click(".leftPanel .index.tab");
    await page.waitForSelector(TIMELINE, { visible: true });
  };

  // Plays a range, as chosen from the index view's table of contents, and
  // returns the timeline's length in seconds once it's shown the range.
  const timelineLengthFor = async (label) => {
    const link = await page.waitForFunction(
      (label) =>
        [...document.querySelectorAll(".leftPanel a")].find(
          (a) => a.offsetParent !== null && a.textContent.trim() === label
        ),
      {},
      label
    );
    await link.asElement().click();
    await page.waitForFunction(
      (label) =>
        document.querySelector(".centerPanel h1.title").textContent.trim() ===
        label,
      {},
      label
    );
    // Gives the timeline time to be laid out for the range.
    await new Promise((resolve) => setTimeout(resolve, 500));
    return page.$eval(TIMELINE, (handle) =>
      Math.round(Number(handle.getAttribute("aria-valuemax")))
    );
  };

  it("shows every canvas on the timeline by default", async () => {
    await load();
    expect(await timelineLengthFor("Part two")).toBe(1716);
  }, 60000);

  it("limits the timeline to the range chosen when set", async () => {
    await load({
      modules: { avCenterPanel: { options: { limitToRange: true } } },
    });
    expect(await timelineLengthFor("Part two")).toBe(572);
  }, 60000);
});
