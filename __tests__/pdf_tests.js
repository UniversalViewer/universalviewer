let puppeteer;
const { BASE_URL } = require("../scripts/tests/testBaseUrl");
const { viewerUrl } = require("../scripts/tests/testViewerUrl");

// Local multi-file PDF manifest (three single-page PDFs) for PDF-specific
// behaviour, modelled on the Villanova manifest vudl:294631.
const PDF_MULTI_FILE_MANIFEST = `${BASE_URL}/test-fixtures/pdf-multi-file-manifest.json`;

describe("Universal Viewer", () => {
  let browser;
  let page;

  beforeAll(async () => {
    puppeteer = (await import("puppeteer")).default;
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  // PDF MANIFEST TEST
  describe("PDF manifest", () => {
    beforeEach(async () => {
      await page.goto(viewerUrl(PDF_MULTI_FILE_MANIFEST), {
        waitUntil: "domcontentloaded",
      });
    });

    it("loads PDF manifest successfully", async () => {
      expect(page.url()).toContain(encodeURIComponent(PDF_MULTI_FILE_MANIFEST));

      await page.waitForSelector(".uv", { visible: true });

      await page.waitForFunction(() => {
        return document.querySelectorAll("iframe").length > 0;
      });

      const viewerFrame = page.frames().find((f) => {
        const url = f.url();

        return (
          url.includes("uv.html") ||
          url.includes("viewer") ||
          url.includes("manifest")
        );
      });

      expect(viewerFrame).toBeTruthy();

      await viewerFrame.waitForSelector("canvas", { visible: true });

      const canvasInfo = await viewerFrame.evaluate(() => {
        const canvas = document.querySelector("canvas");

        if (!canvas) return null;
        return {
          width: canvas.width,
          height: canvas.height,
        };
      });
      expect(canvasInfo).not.toBeNull();
      expect(canvasInfo.width).toBeGreaterThan(0);
      expect(canvasInfo.height).toBeGreaterThan(0);

      const pageText = await viewerFrame.evaluate(
        () => document.body.innerText
      );

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
      await thumbs[1].click();

      await page.waitForFunction(() => window.location.href.includes("cv=1"));

      expect(page.url()).toContain("cv=1");
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
