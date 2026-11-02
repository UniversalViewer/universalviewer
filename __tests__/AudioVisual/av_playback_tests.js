let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const {
  viewerUrl,
  closeAttribution,
  waitUntilStill,
} = require("../../scripts/testViewer");
const { slowNetwork } = require("../../scripts/testTiming");

// The AV component plays:
// - media from another origin whose server doesn't send CORS headers, as
//   many media servers don't (the AV component doesn't need them, and
//   requesting media with CORS would fail there);
// - clips on one canvas in turn (as in the iiif-av-component's gapless
//   playback examples), including in a manifest without ranges, which the
//   MediaElement extension would otherwise play only the first clip of.
// The MediaElement extension plays media from another origin without CORS
// headers too: it doesn't request media with CORS either.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;
const PLAY =
  ".iiif-av-component .player:not([style*='none']) .controls-container button:has(.av-icon-play)";

describe("AV component playback", () => {
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

  // Loads a manifest as a new visitor.
  const load = async (manifest) => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    await page.goto(viewerUrl(fixture(manifest)), {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(PLAY, { visible: true });
    await closeAttribution(page);
    await waitUntilStill(page, PLAY);
  };

  // Loads a manifest as a new visitor and presses play.
  const play = async (manifest) => {
    await load(manifest);
    await page.click(PLAY);
  };

  // The time shown on the playing player, in seconds.
  const canvasTime = () =>
    page.$eval(
      ".iiif-av-component .player:not([style*='none']) .canvas-time",
      (time) => {
        const [minutes, seconds] = time.textContent.split(":").map(Number);
        return minutes * 60 + seconds;
      }
    );

  const messageShown = () =>
    page.$eval(".genericDialogue", (dialogue) => !!dialogue.offsetParent);

  it("plays media from another origin whose server doesn't allow CORS", async () => {
    await play("ranges-cross-origin-audio-manifest.json");
    await page.waitForFunction(
      () =>
        Array.from(document.querySelectorAll(".iiif-av-component audio")).some(
          (audio) => audio.currentTime > 0.5
        ),
      { timeout: 20000 }
    );
    expect(await messageShown()).toBe(false);
  }, 60000);

  it("plays the clips on one canvas in turn, without ranges", async () => {
    await play("two-clips-audio-manifest.json");
    expect(
      await page.$$eval(
        ".iiif-av-component .player:not([style*='none']) audio",
        (audio) => audio.length
      )
    ).toBe(2);
    // Past the end of the first clip (the canvas' first 10 seconds), the
    // second clip's own audio plays (not just the canvas' clock moving on),
    // and the first's has stopped.
    await page.waitForFunction(
      () => {
        const [first, second] = document.querySelectorAll(
          ".iiif-av-component .player:not([style*='none']) audio"
        );
        return first.paused && !second.paused && second.currentTime > 0.5;
      },
      { timeout: 30000 }
    );
    expect(await canvasTime()).toBeGreaterThanOrEqual(10);
    expect(await messageShown()).toBe(false);
  }, 60000);

  // Played from a part of the video not yet downloaded, over a network
  // slower than its bitrate (blackbird-feeding.mp4 is about 8 KB a second),
  // playback has to wait for it. The time shown should wait with it, and the
  // video carry on from where it waited, rather than jump on by however long
  // that was (skipping what's between, which isn't downloaded either).
  it("carries on from where it waited for the media to download", async () => {
    await load("ranges-captioned-video-manifest.json");
    const player = ".iiif-av-component .player:not([style*='none'])";
    await slowNetwork(page, 5000);

    // 5:00 in, well past what's downloaded before playing (about 2:30).
    await (
      await page.$(`${player} .canvas-timeline-container .ui-slider-handle`)
    ).focus();
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("PageUp");
    }
    await page.waitForFunction(
      (player) =>
        document.querySelector(`${player} .canvas-time`).textContent ===
        "05:00",
      {},
      player
    );

    // Notes from now each time the video waits to download more, and each
    // time it's moved more than a second on from where it was.
    await page.evaluate(() => {
      window.waits = 0;
      window.skips = [];
      const video = document.querySelector(
        ".iiif-av-component .player:not([style*='none']) video"
      );
      let playedTo = video.currentTime;
      video.addEventListener("waiting", () => window.waits++);
      video.addEventListener(
        "timeupdate",
        () => (playedTo = video.currentTime)
      );
      video.addEventListener("seeking", () => {
        if (video.currentTime > playedTo + 1) {
          window.skips.push({ from: playedTo, to: video.currentTime });
        }
      });
    });

    await page.click(PLAY);
    await new Promise((resolve) => setTimeout(resolve, 15000));

    const { waits, skips, videoTime } = await page.evaluate((player) => {
      const video = document.querySelector(`${player} video`);
      return {
        waits: window.waits,
        skips: window.skips,
        videoTime: video.currentTime,
      };
    }, player);
    // It did have to wait (or the test would show nothing).
    expect(waits).toBeGreaterThan(0);
    expect(skips).toEqual([]);
    // The canvas has just the one video, from its start, so the time shown is
    // the video's (rounded up, as it's shown).
    expect(Math.abs((await canvasTime()) - videoTime)).toBeLessThan(2);
    expect(await messageShown()).toBe(false);
  }, 60000);
});

describe("MediaElement playback", () => {
  let browser;
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

  it("plays media from another origin whose server doesn't allow CORS", async () => {
    page = await browser.newPage();
    await page.goto(viewerUrl(fixture("cross-origin-audio-manifest.json")), {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(".mejs__playpause-button button", {
      visible: true,
    });
    // As in load: the attribution can cover the button, and the player is
    // laid out again as it loads, moving it.
    await closeAttribution(page);
    await waitUntilStill(page, ".mejs__playpause-button button");
    await page.click(".mejs__playpause-button button");
    await page.waitForFunction(
      () => document.querySelector(".mejs__container audio").currentTime > 0.5,
      { timeout: 20000 }
    );
    expect(
      await page.$eval(
        ".genericDialogue",
        (dialogue) => !!dialogue.offsetParent
      )
    ).toBe(false);
  }, 60000);
});
