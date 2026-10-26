const puppeteer = require("puppeteer");
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl } = require("../../scripts/testViewer");

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

  // Loads a manifest as a new visitor and presses play.
  const play = async (manifest) => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    await page.goto(viewerUrl(fixture(manifest)), {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(PLAY, { visible: true });
    await waitUntilStill(PLAY);
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
    // Past the end of the first clip, into the second.
    await page.waitForFunction(
      () => {
        const time = document.querySelector(
          ".iiif-av-component .player:not([style*='none']) .canvas-time"
        );
        const [minutes, seconds] = time.textContent.split(":").map(Number);
        return minutes * 60 + seconds >= 11;
      },
      { timeout: 30000 }
    );
    expect(await canvasTime()).toBeGreaterThanOrEqual(11);
    expect(await messageShown()).toBe(false);
  }, 60000);
});

describe("MediaElement playback", () => {
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

  it("plays media from another origin whose server doesn't allow CORS", async () => {
    page = await browser.newPage();
    await page.goto(viewerUrl(fixture("cross-origin-audio-manifest.json")), {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(".mejs__playpause-button button", {
      visible: true,
    });
    await page.click(".mejs__playpause-button button");
    await page.waitForFunction(
      () => document.querySelector(".mejs__container audio").currentTime > 0.5,
      { timeout: 20000 }
    );
    expect(
      await page.$eval(".genericDialogue", (dialogue) => !!dialogue.offsetParent)
    ).toBe(false);
  }, 60000);
});
