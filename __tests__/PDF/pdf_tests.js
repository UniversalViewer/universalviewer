let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");

// Local multi-file PDF manifest (three single-page PDFs) for PDF-specific
// behaviour, modelled on the Villanova manifest vudl:294631.
const PDF_MULTI_FILE_MANIFEST = `${BASE_URL}/test-fixtures/pdf-multi-file-manifest.json`;

const viewerUrl = (manifestUrl) => {
  //const separator = BASE_URL.includes("#?") ? "&" : "#?";
  return `${BASE_URL}#?manifest=${encodeURIComponent(manifestUrl)}`;
};

// The canvas the viewer draws the PDF's page on.
const PDF_CANVAS = ".pdfContainer canvas";

// A hash of the canvas's size and pixels, or null while nothing is drawn on
// it: until a page is drawn the canvas is transparent; a drawn page is opaque.
const drawnPage = (page) =>
  page.evaluate((selector) => {
    const canvas = document.querySelector(selector);
    if (!canvas || !canvas.width || !canvas.height) return null;
    const context = canvas.getContext("2d");
    const [, , , alpha] = context.getImageData(
      canvas.width / 2,
      canvas.height / 2,
      1,
      1
    ).data;
    if (alpha === 0) return null;
    // FNV-1a over every pixel.
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let hash = 0x811c9dc5;
    for (let i = 0; i < data.length; i++) {
      hash = Math.imul(hash ^ data[i], 0x01000193);
    }
    return `${canvas.width}x${canvas.height}:${hash >>> 0}`;
  }, PDF_CANVAS);

// Waits until a page is drawn on the canvas, other than the one that hashed to
// `notHash` (if given), and returns its hash. The drawing must be the same on
// two reads 250 ms apart, so a page part way through being drawn isn't taken
// for a finished one.
const waitForDrawnPage = async (page, notHash = null) => {
  const deadline = Date.now() + 10000;
  let previous = null;
  while (Date.now() < deadline) {
    const drawn = await drawnPage(page);
    if (drawn && drawn !== notHash && drawn === previous) return drawn;
    previous = drawn;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(
    notHash
      ? "No other page was drawn within 10 s"
      : "No page was drawn within 10 s"
  );
};

describe("Universal Viewer", () => {
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

  // PDF MANIFEST TEST
  describe("PDF manifest", () => {
    // Each test opens the viewer as a new visitor: in a new browser context,
    // so nothing a test does (the canvas it moved to, the panel it closed,
    // what the viewer remembers in localStorage) carries over to another,
    // whatever order they run in. (Going to the same page with only its hash
    // changed wouldn't start the viewer again.)
    beforeEach(async () => {
      if (context) await context.close();
      context = await browser.createBrowserContext();
      page = await context.newPage();
      await page.goto(viewerUrl(PDF_MULTI_FILE_MANIFEST), {
        waitUntil: "domcontentloaded",
      });
    });

    it("loads PDF manifest successfully", async () => {
      expect(page.url()).toContain(encodeURIComponent(PDF_MULTI_FILE_MANIFEST));

      await page.waitForSelector(".uv", { visible: true });

      // The viewer draws the PDF's page on a canvas in the page itself.
      await page.waitForSelector(PDF_CANVAS, { visible: true });
      await waitForDrawnPage(page);

      // Drawn, without an error said meanwhile.
      const pageText = await page.evaluate(() => document.body.innerText);
      expect(pageText).not.toContain("Unable to load");
      expect(pageText).not.toContain("Error loading");
    });

    it("shows multiple PDF files in the sidebar and allows navigation", async () => {
      // In a fresh browser session the left panel opens automatically
      // (panelOpen defaults to true), so wait for it rather than clicking
      // the expand button, which is only visible while the panel is closed.
      await page.waitForSelector(".leftPanel.open", { visible: true });

      await page.waitForSelector(".thumb", { visible: true });

      const thumbs = await page.$$(".thumb");

      expect(thumbs.length).toBeGreaterThan(1);

      // The first file's page is drawn before moving on, so a change can
      // only come from the navigation.
      const firstPage = await waitForDrawnPage(page);
      await thumbs[1].click();

      await page.waitForFunction(() => window.location.href.includes("cv=1"));
      expect(page.url()).toContain("cv=1");

      // The second file's page, not the first's, is drawn.
      const secondPage = await waitForDrawnPage(page, firstPage);
      expect(secondPage).not.toBe(firstPage);
    });

    it("can collapse and re-expand the sidebar with the expand button", async () => {
      // The sidebar opens automatically, so collapse it first to make the
      // expand button available. The open-finished class is toggled once
      // the panel animation completes.
      await page.waitForSelector(".leftPanel.open-finished", {
        visible: true,
      });
      await page.click(".leftPanel button.collapseButton");

      // Collapsed: the panel content hides and the expand button appears.
      await page.waitForFunction(() => {
        const panel = document.querySelector(".leftPanel");
        return panel && !panel.classList.contains("open-finished");
      });
      await page.waitForSelector(".leftPanel button.expandButton", {
        visible: true,
      });
      await page.waitForSelector(".leftPanel .tabs", { hidden: true });

      expect(
        await page.$eval(".leftPanel button.expandButton", (btn) =>
          btn.getAttribute("aria-expanded")
        )
      ).toBe("false");

      await page.click(".leftPanel button.expandButton");

      // Expanded again: the panel reopens and the thumbnails are visible.
      await page.waitForSelector(".leftPanel.open-finished", {
        visible: true,
      });
      await page.waitForSelector(".thumb", { visible: true });

      expect(
        await page.$eval(".leftPanel", (el) => el.classList.contains("open"))
      ).toBe(true);
      expect(
        await page.$eval(".leftPanel button.expandButton", (btn) =>
          btn.getAttribute("aria-expanded")
        )
      ).toBe("true");
    });
  });
});
