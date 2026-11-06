let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const {
  viewerUrl,
  closeAttribution,
  waitUntilStill,
} = require("../../scripts/testViewer");

// Audio with an accompanying image (IIIF Cookbook recipe 0014): the image is
// shown while the audio plays, not only before, in each player.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;
const IMAGE = "image-fixture-1-euclid-page.jpg";

const PLAYERS = [
  {
    player: "mediaelement (manifests without ranges)",
    manifest: "accompanying-image-audio-manifest.json",
    play: ".mejs__playpause-button button",
    // mediaelement's poster, over the media.
    poster: ".mejs__container .mejs__poster",
    media: ".mejs__container audio",
  },
  {
    player: "the AV component (manifests with ranges)",
    manifest: "ranges-accompanying-image-audio-manifest.json",
    play: ".iiif-av-component .controls-container button:has(.av-icon-play)",
    // The AV component's poster image, in the corner of the player.
    poster: ".iiif-av-component .poster-image",
    media: ".iiif-av-component audio",
  },
];

describe.each(PLAYERS)(
  "Audio with an accompanying image in $player",
  (player) => {
    let browser;
    let page;

    beforeAll(async () => {
      puppeteer = (await import("puppeteer")).default;
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    });

    // Each test has its own page, as the tests run in random order, and one
    // that's played the audio would leave it playing for the next (which would
    // then not be testing the image before it plays). Loading the viewer can
    // be slow while other tests run, so it has 60s.
    beforeEach(async () => {
      page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.goto(viewerUrl(fixture(player.manifest)), {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector(player.play, { visible: true });
      // The manifest's attribution can cover the play button and the image.
      await closeAttribution(page);
    }, 60000);

    afterEach(async () => {
      await page.close();
    });

    afterAll(async () => {
      await browser.close();
    });

    // Whether the accompanying image is what's seen where the player shows it.
    const imageShown = () =>
      page.evaluate(
        (selector, image) => {
          const poster = document.querySelector(selector);
          if (!poster || getComputedStyle(poster).display === "none") {
            return false;
          }
          const { x, y, width, height } = poster.getBoundingClientRect();
          const seen = document.elementFromPoint(x + width / 2, y + height / 2);
          return (
            getComputedStyle(poster).backgroundImage.includes(image) &&
            (seen === poster || poster.contains(seen))
          );
        },
        player.poster,
        IMAGE
      );

    it("shows the image before the audio plays", async () => {
      await page.waitForSelector(player.poster, { visible: true });
      expect(
        await page.$$eval(player.media, (media) =>
          media.every((audio) => audio.paused)
        )
      ).toBe(true);
      expect(await imageShown()).toBe(true);
    });

    it("keeps showing the image while the audio plays", async () => {
      // The AV component loads its media's metadata straight away, so it's
      // played once that's loaded (mediaelement loads media on play).
      if (player.media.startsWith(".iiif-av-component")) {
        await page.waitForFunction(
          (media) =>
            Array.from(document.querySelectorAll(media)).some(
              (audio) => audio.readyState >= 1
            ),
          {},
          player.media
        );
      }
      await waitUntilStill(page, player.play);
      await page.click(player.play);
      await page.waitForFunction(
        (media) =>
          Array.from(document.querySelectorAll(media)).some(
            (audio) => audio.currentTime > 0.5
          ),
        { timeout: 20000 },
        player.media
      );
      await expect(imageShown()).resolves.toBe(true);
    }, 60000);
  }
);
