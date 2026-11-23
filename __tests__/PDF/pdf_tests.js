let puppeteer;
const { BASE_URL } = require("../../scripts/tests/testBaseUrl");
const { viewerUrl } = require("../../scripts/tests/testViewer");

// Local multi-file PDF manifest (three single-page PDFs) for PDF-specific
// behaviour, modelled on the Villanova manifest vudl:294631.
const PDF_MULTI_FILE_MANIFEST = `${BASE_URL}/test-fixtures/pdf-multi-file-manifest.json`;

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

    // The paging buttons are icons named by a .sr-only label
    // (scaffolding.less), which must be hidden on screen but not from
    // assistive technology.
    it("hides the paging button labels visually but keeps them as names", async () => {
      const button = await page.waitForSelector("button.paging.next", {
        visible: true,
      });
      const label = await button.$eval(".sr-only", (el) => {
        const box = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return {
          text: el.textContent.trim(),
          width: box.width,
          height: box.height,
          display: style.display,
          clipPath: style.clipPath,
        };
      });

      expect(label.width).toBeLessThanOrEqual(1);
      expect(label.height).toBeLessThanOrEqual(1);
      expect(label.display).not.toBe("none");
      expect(label.clipPath).toBe("inset(50%)");
      const { name } = await page.accessibility.snapshot({ root: button });
      expect(name).toBe(label.text);
    });
  });

  // UV loads pdf.js from cdnjs at runtime (usePdfJs defaults to true).
  describe("pdf.js", () => {
    const PDFJS_CDN = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174";
    let pdfPage;
    let requests;

    beforeEach(async () => {
      pdfPage = await browser.newPage();
      requests = [];
      pdfPage.on("request", (request) => requests.push(request.url()));
      // pdf.js assigns its exports to this global; wrap them so every
      // getDocument call's parameters are recorded.
      await pdfPage.evaluateOnNewDocument(() => {
        window.getDocumentCalls = [];
        let pdfjsLib;
        Object.defineProperty(window, "pdfjs-dist/build/pdf", {
          configurable: true,
          get: () => pdfjsLib,
          set: (exports) => {
            pdfjsLib = new Proxy(exports, {
              get: (target, key) =>
                key === "getDocument"
                  ? (params) => {
                      window.getDocumentCalls.push(params);
                      return target.getDocument(params);
                    }
                  : Reflect.get(target, key),
            });
          },
        });
      });
      await pdfPage.goto(viewerUrl(PDF_MULTI_FILE_MANIFEST), {
        waitUntil: "domcontentloaded",
      });
      await pdfPage.waitForFunction(() => window.getDocumentCalls.length > 0);
    });

    afterEach(async () => {
      await pdfPage.close();
    });

    // CVE-2024-4367 (GHSA-wgrm-67xf-hhpq): pdf.js <= 4.1.392 can run
    // JavaScript from a malicious PDF unless isEvalSupported is false.
    it("opens PDFs with eval disabled", async () => {
      const isEvalSupported = await pdfPage.evaluate(() =>
        window.getDocumentCalls.map((params) => params.isEvalSupported)
      );

      expect(isEvalSupported).toEqual([false]);
    });

    it("loads pdf.js 3.11.174 and its worker from cdnjs", async () => {
      expect(requests).toContainEqual(
        expect.stringContaining(`${PDFJS_CDN}/pdf.min.js`)
      );

      const workerSrc = await pdfPage.evaluate(
        () => window["pdfjs-dist/build/pdf"].GlobalWorkerOptions.workerSrc
      );
      expect(workerSrc).toBe(`${PDFJS_CDN}/pdf.worker.min.js`);
    });
  });
});
