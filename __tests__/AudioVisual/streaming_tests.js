const puppeteer = require("puppeteer");
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl } = require("../../scripts/testViewer");

// HLS and MPEG-DASH play in both players in browsers without native support
// for them (as Chrome, the test browser, has none for HLS), with UV's own
// hls.js and dash.js, loaded only when needed: never from a CDN. They play
// public test streams.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

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
  { name: "HLS", manifest: "hls-video-stream-manifest.json" },
  { name: "MPEG-DASH", manifest: "dash-video-stream-manifest.json" },
];

describe.each(PLAYERS)("Streams in $player", (player) => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  // Waits for an element to stop moving (the AV component's controls move
  // once its player is sized for the media).
  const waitUntilStill = async (selector) => {
    const position = async () =>
      JSON.stringify(await (await page.$(selector)).boundingBox());
    let last = await position();
    for (let waited = 0; waited < 10000; waited += 250) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const now = await position();
      if (now === last) {
        return;
      }
      last = now;
    }
  };

  it.each(STREAMS)(
    "plays $name, without a CDN",
    async ({ manifest }) => {
      if (page) {
        await page.close();
      }
      page = await browser.newPage();
      const cdnRequests = [];
      page.on("request", (request) => {
        // e.g. mediaelement's default, cdn.jsdelivr.net/npm/hls.js@latest
        if (/(jsdelivr|unpkg|cdnjs).*(hls|dash)/i.test(request.url())) {
          cdnRequests.push(request.url());
        }
      });
      await page.goto(viewerUrl(fixture(player.prefix + manifest)), {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector(player.play, { visible: true });
      await page.evaluate(() =>
        document
          .querySelectorAll(".centerPanel video")
          .forEach((video) => (video.muted = true))
      );
      await waitUntilStill(player.play);
      await page.click(player.play);
      // The stream plays: its time moves on.
      await page.waitForFunction(
        () =>
          Array.from(document.querySelectorAll(".centerPanel video")).some(
            (video) => video.currentTime > 0.5
          ),
        { timeout: 30000 }
      );
      expect(cdnRequests).toEqual([]);
    },
    90000
  );

  it("doesn't load hls.js or dash.js for other media", async () => {
    if (page) {
      await page.close();
    }
    page = await browser.newPage();
    const loaded = [];
    page.on("request", (request) => {
      if (/\/(hls|dashjs)\.[0-9a-f]+\.js$/.test(request.url())) {
        loaded.push(request.url());
      }
    });
    await page.goto(viewerUrl(fixture(MP4[player.prefix])), {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(player.play, { visible: true });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(loaded).toEqual([]);
  }, 60000);
});
