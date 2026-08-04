const puppeteer = require("puppeteer");
const { BASE_URL } = require("../scripts/testBaseUrl");

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

// AV manifests with a transcription. UV surfaces transcriptions/captions in
// the mediaelement player when the canvas provides them as a text/vtt (or
// text/srt) rendering, as an additional body on the painting annotation, or
// as a supplementing annotation per IIIF cookbook recipe 0219 (inline or in
// an externally referenced annotation page). The AV extension used for
// manifests with ranges has no caption support.
//
// The player fetches the VTT with XHR, so cross-origin transcriptions work
// only when every response hop (including any redirect) carries an
// Access-Control-Allow-Origin header. The same-origin fixture below is
// immune to that; the cross-origin fixture points at fixtures.iiif.io,
// which serves CORS headers on a direct https URL.
const AV_CAPTIONED_MANIFEST = `${BASE_URL}/test-fixtures/captioned-video-manifest.json`;
const AV_CROSS_ORIGIN_CAPTIONED_MANIFEST = `${BASE_URL}/test-fixtures/cross-origin-captioned-video-manifest.json`;

// This fixture references the VTT through http://dlib.indiana.edu, whose 301
// upgrade redirect carries no CORS headers, so the URL is unreadable as-is.
// UV resolves such captions to their https destination before wiring the
// track (MediaElementCenterPanel.resolveCaptionSource).
const AV_REDIRECTED_CAPTIONED_MANIFEST = `${BASE_URL}/test-fixtures/redirected-captioned-video-manifest.json`;

// The IIIF cookbook's own example of a captioned video: the VTT is a
// supplementing annotation in an inline annotation page on the canvas.
const AV_COOKBOOK_CAPTION_MANIFEST =
  "https://iiif.io/api/cookbook/recipe/0219-using-caption-file/manifest.json";

// Same supplementing pattern, but the canvas references the annotation page
// by id only, so the viewer has to fetch it.
const AV_SUPPLEMENTING_EXTERNAL_MANIFEST = `${BASE_URL}/test-fixtures/supplementing-external-captioned-video-manifest.json`;

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
      expect(title).toBe("Video Example 3");
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

      // Let the video play for approximately 10 seconds
      await avPage.waitForFunction(
        (start) => {
          const video = document.querySelector("video");
          return video && video.currentTime > start + 10;
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

      expect(pausedTime).toBeGreaterThan(startTime + 10);
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

  // AV MANIFEST WITH A TRANSCRIPTION TEST
  describe("AV manifest with a transcription", () => {
    let avPage;

    beforeAll(async () => {
      avPage = await browser.newPage();
    });

    afterAll(async () => {
      await avPage.close();
    });

    beforeEach(async () => {
      // Force a full reload so the viewer re-initialises on this manifest.
      await avPage.goto("about:blank");
      await avPage.goto(viewerUrl(AV_CAPTIONED_MANIFEST), {
        waitUntil: "domcontentloaded",
      });
    }, 60000);

    it("surfaces the transcription as a caption track in the player", async () => {
      await avPage.waitForSelector(".mejs__container.mejs__video", {
        visible: true,
      });

      // The captions button only renders when a caption track was wired up.
      await avPage.waitForSelector(".mejs__captions-button", {
        visible: true,
      });

      // The <track> points at the manifest's VTT transcription.
      const track = await avPage.$eval("track[src*='captions.vtt']", (t) => ({
        kind: t.kind,
        srclang: t.srclang,
        label: t.label,
      }));
      expect(track.kind).toBe("subtitles");
      expect(track.srclang).toBe("en");
      expect(track.label).toBe("English captions");

      // The transcription appears as a selectable option, and becomes
      // enabled once the player has loaded the VTT file.
      await avPage.waitForFunction(() => {
        const input = document.querySelector(
          ".mejs__captions-selector input:not([value='none'])"
        );
        return input && !input.disabled;
      });
    }, 60000);

    it("displays the transcription text during playback", async () => {
      await avPage.waitForSelector(".mejs__captions-button", {
        visible: true,
      });

      // Wait for the player to finish loading the VTT.
      await avPage.waitForFunction(() => {
        const input = document.querySelector(
          ".mejs__captions-selector input:not([value='none'])"
        );
        return input && !input.disabled;
      });

      // Turn captions on through the player UI.
      await avPage.evaluate(() => {
        document
          .querySelector(".mejs__captions-selector input:not([value='none'])")
          .click();
      });

      // Play (muted, so headless autoplay is allowed) to reach the first cue.
      await avPage.evaluate(() => {
        const video = document.querySelector(".mejs__mediaelement video");
        video.muted = true;
        return video.play();
      });

      await avPage.waitForFunction(() => {
        const el = document.querySelector(".mejs__captions-text");
        return el && el.textContent.trim().length > 0;
      });

      const captionText = await avPage.$eval(".mejs__captions-text", (el) =>
        el.textContent.trim()
      );
      expect(captionText).toBe(
        "Just before lunch one day, a puppet show was put on at school."
      );
    }, 60000);

    it("displays a cross-origin transcription served with CORS headers", async () => {
      await avPage.goto("about:blank");
      await avPage.goto(viewerUrl(AV_CROSS_ORIGIN_CAPTIONED_MANIFEST), {
        waitUntil: "domcontentloaded",
      });

      await avPage.waitForSelector(".mejs__captions-button", {
        visible: true,
      });

      // The <track> points at the cross-origin VTT.
      const trackSrc = await avPage.$eval(
        "track[src*='lunchroom_manners.vtt']",
        (t) => t.src
      );
      expect(trackSrc).toBe(
        "https://fixtures.iiif.io/video/indiana/lunchroom_manners/lunchroom_manners.vtt"
      );

      // The caption option only becomes enabled once the player has
      // successfully fetched the cross-origin VTT.
      await avPage.waitForFunction(() => {
        const input = document.querySelector(
          ".mejs__captions-selector input:not([value='none'])"
        );
        return input && !input.disabled;
      });

      // Turn captions on and play; the first cue ("[music]") starts 1.2s in.
      await avPage.evaluate(() => {
        document
          .querySelector(".mejs__captions-selector input:not([value='none'])")
          .click();
        const video = document.querySelector(".mejs__mediaelement video");
        video.muted = true;
        return video.play();
      });

      await avPage.waitForFunction(() => {
        const el = document.querySelector(".mejs__captions-text");
        return el && el.textContent.trim().length > 0;
      });

      const captionText = await avPage.$eval(".mejs__captions-text", (el) =>
        el.textContent.trim()
      );
      expect(captionText).toBe("[music]");
    }, 60000);

    it("resolves a transcription behind an institutional redirect", async () => {
      await avPage.goto("about:blank");
      await avPage.goto(viewerUrl(AV_REDIRECTED_CAPTIONED_MANIFEST), {
        waitUntil: "domcontentloaded",
      });

      await avPage.waitForSelector(".mejs__captions-button", {
        visible: true,
      });

      // The manifest's http:// URL is unreadable (its redirect hop has no
      // CORS headers), so UV must have resolved the track to the readable
      // https destination.
      const trackSrc = await avPage.$eval(
        "track[src*='lunchroom_manners.vtt']",
        (t) => t.src
      );
      expect(trackSrc).toBe(
        "https://dlib.indiana.edu/iiif_av/lunchroom_manners/lunchroom_manners.vtt"
      );

      await avPage.waitForFunction(() => {
        const input = document.querySelector(
          ".mejs__captions-selector input:not([value='none'])"
        );
        return input && !input.disabled;
      });

      await avPage.evaluate(() => {
        document
          .querySelector(".mejs__captions-selector input:not([value='none'])")
          .click();
        const video = document.querySelector(".mejs__mediaelement video");
        video.muted = true;
        return video.play();
      });

      await avPage.waitForFunction(() => {
        const el = document.querySelector(".mejs__captions-text");
        return el && el.textContent.trim().length > 0;
      });

      const captionText = await avPage.$eval(".mejs__captions-text", (el) =>
        el.textContent.trim()
      );
      expect(captionText).toBe("[music]");
    }, 60000);

    it("displays a transcription supplied as a supplementing annotation (cookbook 0219)", async () => {
      await avPage.goto("about:blank");
      await avPage.goto(viewerUrl(AV_COOKBOOK_CAPTION_MANIFEST), {
        waitUntil: "domcontentloaded",
      });

      await avPage.waitForSelector(".mejs__captions-button", {
        visible: true,
      });

      // The track carries the annotation body's label and language.
      const track = await avPage.$eval(
        "track[src*='lunchroom_manners.vtt']",
        (t) => ({ label: t.label, srclang: t.srclang })
      );
      expect(track.label).toBe("Captions in WebVTT format");
      expect(track.srclang).toBe("en");

      await avPage.waitForFunction(() => {
        const input = document.querySelector(
          ".mejs__captions-selector input:not([value='none'])"
        );
        return input && !input.disabled;
      });

      await avPage.evaluate(() => {
        document
          .querySelector(".mejs__captions-selector input:not([value='none'])")
          .click();
        const video = document.querySelector(".mejs__mediaelement video");
        video.muted = true;
        return video.play();
      });

      await avPage.waitForFunction(() => {
        const el = document.querySelector(".mejs__captions-text");
        return el && el.textContent.trim().length > 0;
      });

      const captionText = await avPage.$eval(".mejs__captions-text", (el) =>
        el.textContent.trim()
      );
      expect(captionText).toBe("[music]");
    }, 60000);

    it("displays a transcription from an externally referenced annotation page", async () => {
      await avPage.goto("about:blank");
      await avPage.goto(viewerUrl(AV_SUPPLEMENTING_EXTERNAL_MANIFEST), {
        waitUntil: "domcontentloaded",
      });

      await avPage.waitForSelector(".mejs__captions-button", {
        visible: true,
      });

      await avPage.waitForFunction(() => {
        const input = document.querySelector(
          ".mejs__captions-selector input:not([value='none'])"
        );
        return input && !input.disabled;
      });

      await avPage.evaluate(() => {
        document
          .querySelector(".mejs__captions-selector input:not([value='none'])")
          .click();
        const video = document.querySelector(".mejs__mediaelement video");
        video.muted = true;
        return video.play();
      });

      await avPage.waitForFunction(() => {
        const el = document.querySelector(".mejs__captions-text");
        return el && el.textContent.trim().length > 0;
      });

      const captionText = await avPage.$eval(".mejs__captions-text", (el) =>
        el.textContent.trim()
      );
      expect(captionText).toBe(
        "Just before lunch one day, a puppet show was put on at school."
      );
    }, 60000);
  });
});
