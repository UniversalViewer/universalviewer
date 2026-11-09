let puppeteer;
const { BASE_URL } = require("../scripts/tests/testBaseUrl");

const FIRST_THUMB_SRC =
  "https://iiif.wellcomecollection.org/image/b18035723_0001.JP2/full/90,/0/default.jpg";

// Local paged book of static images; see image_tests.js for its IIIF
// Cookbook recipes.
const IMAGE_BOOK_MANIFEST = `${BASE_URL}/test-fixtures/image-paged-book-manifest.json`;

let browser;
let page;

// Applies custom config through the examples page's Configuration tab:
// the #customConfig JSON is merged into the viewer config by a
// uv.on("configure") handler when the Apply Configurations button
// re-initialises the viewer.
const applyCustomConfig = async (config) => {
  await page.evaluate((cfg) => {
    document.getElementById("customConfig").value = cfg;
    document.getElementById("clearStorageCheckbox").checked = true;
    document.getElementById("setConfigButton").click();
  }, JSON.stringify(config));
};

describe("Configuration options", () => {
  beforeAll(async () => {
    puppeteer = (await import("puppeteer")).default;
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("thumb cache invalidation", () => {
    beforeEach(async () => {
      await page.goto(BASE_URL);
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

  // The examples page turns on doubleClickAnnotationEnabled and adds each
  // published double-click target to #iiif_annotations. Custom config is
  // merged after the page's own, so it can turn the option off again.
  describe("double-click annotation", () => {
    const oneUpButton = ".btn.imageBtn.one-up";

    const waitForOneUp = () =>
      page.waitForFunction(
        (sel) =>
          document.querySelector(sel)?.getAttribute("aria-pressed") === "true",
        {},
        oneUpButton
      );

    const doubleClickViewer = async () => {
      await page.waitForSelector(".openseadragon-canvas", { visible: true });
      const box = await (await page.$(".openseadragon-canvas")).boundingBox();
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, {
        count: 2,
      });
    };

    const annotationTargets = () =>
      page.$eval("#iiif_annotations", (el) =>
        el.value ? JSON.parse(el.value).map(({ target }) => target) : []
      );

    const waitForAnnotationOn = (canvas) =>
      page.waitForFunction(
        (path) =>
          document.querySelector("#iiif_annotations").value.includes(path),
        {},
        `/canvas/${canvas}#`
      );

    // Changing only the #hash doesn't reload the page, so start each test on
    // a fresh one. The header hides the paging buttons below 1280px.
    beforeEach(async () => {
      await page.close();
      page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(
        `${BASE_URL}#?manifest=${encodeURIComponent(IMAGE_BOOK_MANIFEST)}`
      );
      await page.waitForSelector("#thumb-0 img");
    });

    it("starts in one-up and publishes when pagingEnabled is false", async () => {
      await applyCustomConfig({ options: { pagingEnabled: false } });
      await waitForOneUp();
      await doubleClickViewer();
      await waitForAnnotationOn("p1");

      const targets = await annotationTargets();
      expect(targets).toHaveLength(1);
      expect(targets[0]).toMatch(/\/canvas\/p1#xywh=\d+,\d+,1,1$/);
    });

    it("publishes nothing when doubleClickAnnotationEnabled is false", async () => {
      // One-up on p1 with the option off: publishes nothing.
      await applyCustomConfig({
        options: { pagingEnabled: false },
        modules: {
          openSeadragonCenterPanel: {
            options: { doubleClickAnnotationEnabled: false },
          },
        },
      });
      await waitForOneUp();
      await doubleClickViewer();

      // With the option back on, one-up on p2 publishes p2's target. A target
      // for p1 would mean the first double-click published too. Re-applying
      // config loads the manifest named in the URL, which no longer has it,
      // so put it back first.
      await page.evaluate(
        (hash) => history.replaceState(null, "", hash),
        `#?manifest=${encodeURIComponent(IMAGE_BOOK_MANIFEST)}`
      );
      await applyCustomConfig({ options: { pagingEnabled: false } });
      await waitForOneUp();
      await page.click(".btn.imageBtn.next");
      await page.waitForFunction(() => /[?&#]cv=1(&|$)/.test(location.href));
      await doubleClickViewer();
      await waitForAnnotationOn("p2");

      const targets = await annotationTargets();
      expect(targets).toHaveLength(1);
      expect(targets[0]).toMatch(/\/canvas\/p2#xywh=\d+,\d+,1,1$/);
    });
  });
});
