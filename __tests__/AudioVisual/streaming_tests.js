let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const {
  viewerUrl,
  closeAttribution,
  waitUntilStill,
} = require("../../scripts/testViewer");
const {
  asFirefox,
  asSafari,
  playsHlsNatively,
  requestKinds,
  requesters,
} = require("../../scripts/testHls");

// HLS and MPEG-DASH play in both players. HLS plays with UV's own hls.js
// where it can (Chrome, the test browser, and Firefox, mocked here in
// Chrome), without the browser's own player also loading it, and with the
// browser's own player in Safari (mocked here in Chrome), without loading
// hls.js at all. A stream whose server sends no CORS headers, which hls.js
// can't load, plays with the browser's own player where it has one (e.g.
// Chrome). MPEG-DASH, which no browser plays itself, plays with UV's own
// dash.js. hls.js and dash.js are loaded only when needed, and never from a
// CDN. They play public test streams, and our own.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

// UV's own hls.js, as webpack names it.
const HLS_JS = /\/hls\.[0-9a-f]+\.js$/;

// The players' media elements (an audio element for a Sound).
const MEDIA = ".centerPanel audio, .centerPanel video";

const PLAYERS = [
  {
    player: "mediaelement (manifests without ranges)",
    prefix: "",
    play: ".mejs__playpause-button button",
  },
  {
    player: "the AV component (manifests with ranges)",
    prefix: "ranges-",
    play: ".iiif-av-component .controls-container button:has(.av-icon-play)",
  },
];

// Media that needs neither, which the players load only for HLS and DASH.
const MP4 = {
  "": "captioned-video-manifest.json",
  "ranges-": "ranges-captioned-video-manifest.json",
};

const STREAMS = [
  {
    name: "HLS with hls.js, as in Firefox",
    manifest: "hls-video-stream-manifest.json",
    playlist: "x36xhzz.m3u8",
    asFirefox: true,
    requestedBy: ["hls.js"],
    hlsJs: true,
  },
  {
    name: "HLS with hls.js, in Chrome",
    manifest: "hls-video-stream-manifest.json",
    playlist: "x36xhzz.m3u8",
    requestedBy: ["hls.js"],
    hlsJs: true,
  },
  {
    // Not the public stream: Chrome's own player, standing in for Safari's,
    // can't play its segments from another site (served as
    // application/octet-stream, which Chrome's Opaque Response Blocking
    // blocks).
    name: "HLS with the browser's own player, as in Safari",
    manifest: "hls-raven-manifest.json",
    playlist: "black-sand-raven.m3u8",
    asSafari: true,
    requestedBy: ["the browser's own player"],
    hlsJs: false,
  },
  {
    name: "HLS whose server sends no CORS headers, with the browser's own player once hls.js can't load it, in Chrome",
    manifest: "cross-origin-hls-raven-manifest.json",
    playlist: "black-sand-raven.m3u8",
    requestedBy: ["hls.js", "the browser's own player"],
    hlsJs: true,
  },
  { name: "MPEG-DASH", manifest: "dash-video-stream-manifest.json" },
];

describe.each(PLAYERS)("Streams in $player", (player) => {
  let browser;
  let context;
  let page;

  // Each test gets its own browser context, so connections a stream leaves
  // open can't hold up the next test's requests.
  const newPage = async () => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
  };

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

  it.each(STREAMS)(
    "plays $name, without a CDN",
    async (stream) => {
      await newPage();
      const cdnRequests = [];
      const hlsJsLoaded = [];
      page.on("request", (request) => {
        // e.g. mediaelement's default, cdn.jsdelivr.net/npm/hls.js@latest
        if (/(jsdelivr|unpkg|cdnjs).*(hls|dash)/i.test(request.url())) {
          cdnRequests.push(request.url());
        }
        if (HLS_JS.test(request.url())) {
          hlsJsLoaded.push(request.url());
        }
      });
      const playlistRequests = stream.playlist
        ? requestKinds(page, stream.playlist)
        : [];
      if (stream.asFirefox) {
        await asFirefox(page);
      }
      if (stream.asSafari) {
        await asSafari(page);
      }
      await page.goto(viewerUrl(fixture(player.prefix + stream.manifest)), {
        waitUntil: "domcontentloaded",
      });
      if (stream.playlist) {
        expect(await playsHlsNatively(page)).toBe(!stream.asFirefox);
      }
      await page.waitForSelector(player.play, { visible: true });
      await page.evaluate(
        (selector) =>
          document
            .querySelectorAll(selector)
            .forEach((media) => (media.muted = true)),
        MEDIA
      );
      // Every stream's manifest has an attribution, which can cover the
      // play button.
      await closeAttribution(page);
      await waitUntilStill(page, player.play);
      await page.click(player.play);
      // The stream plays: its time moves on.
      await page.waitForFunction(
        (selector) =>
          Array.from(document.querySelectorAll(selector)).some(
            (media) => media.currentTime > 0.5
          ),
        { timeout: 30000 },
        MEDIA
      );
      expect(cdnRequests).toEqual([]);
      if (stream.playlist) {
        // Played the way it's meant to, for the browser, in turn: by hls.js
        // (UV's own), or by the browser's own player, loading hls.js only
        // if it's tried.
        expect(requesters(playlistRequests)).toEqual(stream.requestedBy);
        expect(hlsJsLoaded.length > 0).toBe(stream.hlsJs);
      }
    },
    90000
  );

  it("doesn't load hls.js or dash.js for other media", async () => {
    await newPage();
    const loaded = [];
    page.on("request", (request) => {
      if (
        HLS_JS.test(request.url()) ||
        /\/dashjs\.[0-9a-f]+\.js$/.test(request.url())
      ) {
        loaded.push(request.url());
      }
    });
    await page.goto(viewerUrl(fixture(MP4[player.prefix])), {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(player.play, { visible: true });
    // Played, as either library could be loaded when the player is set up
    // or when it's played.
    await page.evaluate(
      (selector) =>
        document
          .querySelectorAll(selector)
          .forEach((media) => (media.muted = true)),
      MEDIA
    );
    await closeAttribution(page);
    await waitUntilStill(page, player.play);
    await page.click(player.play);
    await page.waitForFunction(
      (selector) =>
        Array.from(document.querySelectorAll(selector)).some(
          (media) => media.currentTime > 0.5
        ),
      { timeout: 30000 },
      MEDIA
    );
    expect(loaded).toEqual([]);
  }, 60000);
});
