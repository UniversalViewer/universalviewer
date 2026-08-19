const puppeteer = require("puppeteer");
const { BASE_URL } = require("../scripts/testBaseUrl");

// PDF manifest for PDF-specific behaviour
const PDF_MULTI_FILE_MANIFEST =
  "https://digital.library.villanova.edu/Item/vudl:294631/Manifest";

const viewerUrl = (manifestUrl) => {
  //const separator = BASE_URL.includes("#?") ? "&" : "#?";
  return `${BASE_URL}#?manifest=${encodeURIComponent(manifestUrl)}`;
};

describe("Universal Viewer", () => {
  let browser;
  let page;

  beforeAll(async () => {
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
  });
});
