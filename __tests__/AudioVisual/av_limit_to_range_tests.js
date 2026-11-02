let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl, applyConfig } = require("../../scripts/testViewer");

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
      await applyConfig(page, config);
      await page.waitForSelector(".leftPanel .index.tab", { visible: true });
    }
    await page.click(".leftPanel .index.tab");
    await page.waitForSelector(TIMELINE, { visible: true });
  };

  // The timeline's length, and where its handle is, in seconds.
  const timeline = () =>
    page.$eval(TIMELINE, (handle) => ({
      length: Math.round(Number(handle.getAttribute("aria-valuemax"))),
      at: Number(handle.getAttribute("aria-valuenow")),
    }));

  // Plays a range, as chosen from the index view's table of contents, and
  // returns the timeline once it's the length expected (and has stayed it
  // for a quarter of a second), or as it is after 10 seconds.
  const timelineFor = async (label, length) => {
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
    let last = await timeline();
    for (let waited = 0; waited < 10000; waited += 250) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const now = await timeline();
      if (now.length === length && last.length === length) {
        return now;
      }
      last = now;
    }
    return last;
  };

  // The whole timeline is 1716 seconds before a range is chosen, too, so the
  // handle having moved into the range chosen (572 to 1144 seconds in) shows
  // the range was applied.
  it("shows every canvas on the timeline by default", async () => {
    await load();
    const { length, at } = await timelineFor("Part two", 1716);
    expect(length).toBe(1716);
    expect(at).toBeGreaterThanOrEqual(572);
    expect(at).toBeLessThan(1144);
  }, 60000);

  it("limits the timeline to the range chosen when set", async () => {
    await load({
      modules: { avCenterPanel: { options: { limitToRange: true } } },
    });
    const { length, at } = await timelineFor("Part two", 572);
    expect(length).toBe(572);
    expect(at).toBeGreaterThanOrEqual(0);
    expect(at).toBeLessThan(572);
  }, 60000);
});
