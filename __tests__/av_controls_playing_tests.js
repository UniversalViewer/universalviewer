const puppeteer = require("puppeteer");
const { BASE_URL } = require("../scripts/testBaseUrl");
const { viewerUrl } = require("../scripts/testViewer");

// The AV component's controls stay in view while it plays. When the canvas
// has no label (as in IIIF Cookbook recipe 0026), the panel has no title
// until a range plays, whose label then takes up room above the player.
const MANIFEST = `${BASE_URL}/test-fixtures/ranges-unlabelled-canvas-video-manifest.json`;
const PLAY = ".iiif-av-component .controls-container button:has(.av-icon-play)";

describe("AV component controls while playing", () => {
  let browser;
  let page;

  // Loading the viewer can be slow while other tests run, so it has 60s.
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(viewerUrl(MANIFEST), { waitUntil: "domcontentloaded" });
    await page.waitForSelector(PLAY, { visible: true });
  }, 60000);

  afterAll(async () => {
    await browser.close();
  });

  // The controls that could be hidden, cut off by the panel, or covered, by class.
  const controlsOutOfView = () =>
    page.evaluate(() => {
      const panel = document
        .querySelector(".centerPanel .content")
        .getBoundingClientRect();
      return Array.from(
        document.querySelectorAll(
          ".iiif-av-component .controls-container button"
        )
      )
        .filter((button) => button.offsetParent)
        .filter((button) => {
          const { x, y, width, height, top, bottom } =
            button.getBoundingClientRect();
          const seen = document.elementFromPoint(x + width / 2, y + height / 2);
          return (
            top < panel.top ||
            bottom > panel.bottom ||
            !(seen === button || button.contains(seen))
          );
        })
        .map((button) => button.className || button.innerHTML);
    });

  it("shows every control before playing", async () => {
    expect(await controlsOutOfView()).toEqual([]);
  });

  it("keeps every control in view once playing shows the range's title", async () => {
    await page.click(PLAY);
    await page.waitForFunction(
      () =>
        document.querySelector(".centerPanel h1.title").textContent.trim() ===
        "The puppet show"
    );
    // Gives the panel time to lay out with its title.
    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(await controlsOutOfView()).toEqual([]);
  });
});
