let puppeteer;
const { viewerUrl, expectPanelTitle } = require("../../scripts/testViewer");

// AV (audiovisual) manifest for AV-specific behaviour. A simple single-file
// AV manifest (no ranges) is rendered by the mediaelement extension.
const AV_VIDEO_MANIFEST =
  "https://iiif.io/api/cookbook/recipe/0003-mvm-video/manifest.json";

// AV manifest WITH a table of contents (structures/ranges). When an AV manifest
// has ranges and preferMediaElementExtension is false (the default), the viewer
// uses uv-av-extension -> AVCenterPanel (iiif-av-component) instead of the
// mediaelement player.
const AV_TOC_MANIFEST =
  "https://iiif.io/api/cookbook/recipe/0064-opera-one-canvas/manifest.json";

// The first section of that manifest's table of contents. The AV center panel
// titles the player with the current range's label (AVCenterPanel._setTitle),
// so a range has to be selected for a title to appear: on a plain load there
// is no current range and the opera's single canvas carries no label.
const AV_TOC_RANGE =
  "https://iiif.io/api/cookbook/recipe/0064-opera-one-canvas/range/3";
const AV_TOC_RANGE_LABEL =
  "Preludio e Coro d'introduzione – Bel conforto al mietitore";

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

  // AV MANIFEST TEST
  describe("AV manifest", () => {
    // Use a dedicated page so the AV tests are isolated from whatever state
    // (e.g. in-flight iframe loads) earlier suites left on the shared page.
    let avPage;

    beforeAll(async () => {
      avPage = await browser.newPage();
    });

    afterAll(async () => {
      await avPage.close();
    });

    beforeEach(async () => {
      // The example page reads the manifest from the URL only on the initial
      // document load, so force a full reload (a hash-only change would not
      // re-initialise the viewer).
      await avPage.goto("about:blank");
      await avPage.goto(viewerUrl(AV_VIDEO_MANIFEST), {
        waitUntil: "domcontentloaded",
      });
    }, 60000);

    it("loads the AV manifest into the mediaelement player", async () => {
      expect(avPage.url()).toContain(encodeURIComponent(AV_VIDEO_MANIFEST));

      await avPage.waitForSelector(".uv", { visible: true });

      // The AV manifest is handled by the mediaelement extension, which adds
      // this class to the extension host element.
      await avPage.waitForSelector(".uv-mediaelement-extension", {
        visible: true,
      });

      // The MediaElement.js player renders into a .mejs__container. For a
      // video canvas it also carries the .mejs__video class.
      await avPage.waitForSelector(".mejs__container.mejs__video", {
        visible: true,
      });

      // The underlying media element points at the canvas' video resource.
      const videoSrc = await avPage.$eval(
        ".mejs__mediaelement video",
        (el) => el.src || el.querySelector("source")?.src || ""
      );
      expect(videoSrc).toMatch(/\.mp4($|\?)/);

      const pageText = await avPage.evaluate(() => document.body.innerText);
      expect(pageText).not.toContain("Unable to load");
      expect(pageText).not.toContain("Error loading");

      await expectPanelTitle(
        avPage,
        "Simplest Video Example (IIIF Presentation 3)"
      );
    }, 60000);

    it("displays the correct title", async () => {
      const titleSelector = "#uv .mainPanel .centerPanel h1";

      await avPage.waitForFunction(
        (selector) => {
          const el = document.querySelector(selector);
          return el && el.textContent.trim().length > 0;
        },
        {},
        titleSelector
      );

      const title = await avPage.$eval(titleSelector, (el) =>
        el.textContent.trim()
      );
      expect(title).toBe("Simplest Video Example (IIIF Presentation 3)");
    }, 60000);

    it("renders AV playback controls", async () => {
      await avPage.waitForSelector(".mejs__controls", { visible: true });

      // Play / pause button.
      const playButton = await avPage.$(".mejs__playpause-button");
      expect(playButton).toBeTruthy();

      // Current time readout.
      const currentTime = await avPage.$eval(".mejs__currenttime", (el) =>
        el.textContent.trim()
      );
      expect(currentTime).toMatch(/^\d{2}:\d{2}/);
    }, 60000);

    it("can play/pause the video", async () => {
      const playPauseButton = ".mejs__playpause-button button";

      await avPage.waitForSelector(playPauseButton, { visible: true });

      await avPage.click(playPauseButton);

      await avPage.waitForFunction(() => {
        const video = document.querySelector("video");
        return video && !video.paused;
      });

      const startTime = await avPage.$eval(
        "video",
        (video) => video.currentTime
      );

      // Let the video play for approximately 3 seconds
      await avPage.waitForFunction(
        (start) => {
          const video = document.querySelector("video");
          return video && video.currentTime > start + 3;
        },
        { timeout: 30000 },
        startTime
      );

      // Pause playback
      await avPage.click(playPauseButton);

      await avPage.waitForFunction(() => {
        const video = document.querySelector("video");
        return video && video.paused;
      });

      const pausedTime = await avPage.$eval(
        "video",
        (video) => video.currentTime
      );

      expect(pausedTime).toBeGreaterThan(startTime + 3);
    }, 60000);
  });

  // AV MANIFEST WITH TABLE OF CONTENTS TEST
  // An AV manifest that defines ranges/structures is routed to the AV extension
  // (AVCenterPanel / iiif-av-component) rather than the mediaelement player.
  describe("AV manifest with table of contents", () => {
    // Use a dedicated page so the AV tests are isolated from whatever state
    // (e.g. in-flight iframe loads) earlier suites left on the shared page.
    let avPage;

    beforeAll(async () => {
      avPage = await browser.newPage();
    });

    afterAll(async () => {
      await avPage.close();
    });

    beforeEach(async () => {
      // Force a full reload so the viewer re-initialises on this manifest
      // (a hash-only change would keep the previously loaded manifest).
      await avPage.goto("about:blank");
      await avPage.goto(viewerUrl(AV_TOC_MANIFEST), {
        waitUntil: "domcontentloaded",
      });
    }, 60000);

    it("loads the AV manifest into the AV center panel", async () => {
      expect(avPage.url()).toContain(encodeURIComponent(AV_TOC_MANIFEST));

      await avPage.waitForSelector(".uv", { visible: true });

      // The AV extension mounts the AVComponent into a .iiif-av-component
      // wrapper inside the center panel.
      await avPage.waitForSelector(".iiif-av-component .player", {
        visible: true,
      });

      // This path must NOT fall back to the mediaelement player.
      const mejsCount = await avPage.$$eval(
        ".mejs__container",
        (els) => els.length
      );
      expect(mejsCount).toBe(0);

      // The media element is created as video.anno / audio.anno.
      await avPage.waitForSelector(
        ".iiif-av-component video.anno, .iiif-av-component audio.anno"
      );

      const pageText = await avPage.evaluate(() => document.body.innerText);
      expect(pageText).not.toContain("Unable to load");
      expect(pageText).not.toContain("Error loading");
    }, 60000);

    it("titles the player with the selected range's label", async () => {
      // Re-navigate: the beforeEach loads the manifest with no range selected,
      // and the title is only rendered for a current range. The about:blank
      // hop forces a full reload — this URL differs from the beforeEach's only
      // in the hash, and without it the test races the viewer's teardown and
      // re-initialisation on the still-mounted previous load.
      await avPage.goto("about:blank");
      await avPage.goto(
        `${viewerUrl(AV_TOC_MANIFEST)}&rid=${encodeURIComponent(AV_TOC_RANGE)}`,
        { waitUntil: "domcontentloaded" }
      );

      await avPage.waitForSelector(".iiif-av-component .player", {
        visible: true,
      });

      await expectPanelTitle(avPage, AV_TOC_RANGE_LABEL);
    }, 60000);

    it("renders AV component playback controls", async () => {
      await avPage.waitForSelector(".iiif-av-component .controls-container", {
        visible: true,
      });

      // Play/pause button.
      const playButton = await avPage.$(
        ".iiif-av-component .controls-container .av-icon-play"
      );
      expect(playButton).toBeTruthy();

      // Duration display.
      const duration = await avPage.$(
        ".iiif-av-component .time-display .canvas-duration"
      );
      expect(duration).toBeTruthy();
    }, 60000);
  });
});
