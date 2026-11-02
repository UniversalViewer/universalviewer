let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl, applyConfig } = require("../../scripts/testViewer");

const MANIFEST = `${BASE_URL}/test-fixtures/image-paged-book-manifest.json`;
// Its first canvas' thumbnail, as the manifest gives it.
const FIRST_THUMB_SRC = `${BASE_URL}/test-fixtures/image-fixture-1-euclid-page-thumb.jpg`;

let browser;
let context;
let page;

// Applies custom config through the examples page's Configuration tab:
// the #customConfig JSON is merged into the viewer config by a
// uv.on("configure") handler when the Apply Configurations button
// re-initialises the viewer, which this waits for.
const applyCustomConfig = (config) =>
  applyConfig(page, config, { clearStorage: true });

describe("Configuration options", () => {
  beforeAll(async () => {
    puppeteer = (await import("puppeteer")).default;
    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("thumb cache invalidation", () => {
    // Each test opens the viewer as a new visitor, in a new browser context,
    // whatever order they run in.
    beforeEach(async () => {
      if (context) {
        await context.close();
      }
      context = await browser.createBrowserContext();
      page = await context.newPage();
      await page.goto(viewerUrl(MANIFEST), { waitUntil: "domcontentloaded" });
      await page.waitForSelector("#thumb-0 img");
    });

    it("when set to false does not provide timestamp", async () => {
      await applyCustomConfig({
        modules: {
          contentLeftPanel: {
            options: { thumbsCacheInvalidation: { enabled: false } },
          },
        },
      });

      // wait for the viewer to re-render thumbs without the timestamp
      await page.waitForFunction(
        (src) => {
          const img = document.querySelector("#thumb-0 img");
          return img && img.src === src;
        },
        {},
        FIRST_THUMB_SRC
      );

      const imageSrc = await page.$eval("#thumb-0 img", (e) => e.src);
      expect(imageSrc).toEqual(FIRST_THUMB_SRC);
    });

    it("has a configurable parameter type", async () => {
      await applyCustomConfig({
        modules: {
          contentLeftPanel: {
            options: { thumbsCacheInvalidation: { paramType: "#" } },
          },
        },
      });

      // wait for the viewer to re-render thumbs with a #t= timestamp
      await page.waitForFunction(
        (src) => {
          const img = document.querySelector("#thumb-0 img");
          return img && img.src.startsWith(`${src}#t=`);
        },
        {},
        FIRST_THUMB_SRC
      );

      const imageSrc = await page.$eval("#thumb-0 img", (e) => e.src);
      expect(imageSrc).toEqual(
        expect.stringContaining(`${FIRST_THUMB_SRC}#t=`)
      );
    });
  });
});
