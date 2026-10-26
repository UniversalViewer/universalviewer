const puppeteer = require("puppeteer");
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl } = require("../../scripts/testViewer");

// The image shown with audio and video, before and while it plays (see
// choosePosterImages, which poster_images_tests.ts covers rule by rule), in
// each player.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

const PLAYERS = [
  {
    player: "mediaelement (manifests without ranges)",
    prefix: "",
    play: ".mejs__playpause-button button",
    // mediaelement's poster, over the media.
    poster: ".mejs__container .mejs__poster",
  },
  {
    player: "the AV component (manifests with ranges)",
    prefix: "ranges-",
    play: ".iiif-av-component .controls-container button:has(.av-icon-play)",
    // The AV component's poster image, in the corner of the player.
    poster: ".iiif-av-component .poster-image",
  },
];

const CASES = [
  {
    name: "a placeholder image before video plays, then the video (recipe 0013)",
    manifest: "placeholder-video-manifest.json",
    beforePlay: "image-fixture-2-euclid-papyrus.jpg",
    whilePlaying: null,
  },
  {
    name: "a placeholder image before audio plays, then the accompanying image",
    manifest: "placeholder-accompanying-audio-manifest.json",
    beforePlay: "image-fixture-2-euclid-papyrus.jpg",
    whilePlaying: "image-fixture-3-fayum-page.jpg",
  },
  {
    name: "the canvas' IIIF v3 thumbnail before and while audio plays",
    manifest: "canvas-thumbnail-audio-manifest.json",
    beforePlay: "image-fixture-4-fayum-portrait.jpg",
    whilePlaying: "image-fixture-4-fayum-portrait.jpg",
  },
  {
    name: "a manifest's posterCanvas before and while audio plays",
    manifest: "poster-canvas-audio-manifest.json",
    beforePlay: "image-fixture-5-weighing-of-the-heart-page.jpg",
    whilePlaying: "image-fixture-5-weighing-of-the-heart-page.jpg",
  },
];

describe.each(PLAYERS)("The image shown with media in $player", (player) => {
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

  // The file name of the image the player shows, or null for none.
  const shownImage = (selector) => {
    const poster = document.querySelector(selector);
    if (!poster || !poster.offsetParent) {
      return null;
    }
    const { width, height } = poster.getBoundingClientRect();
    const match =
      getComputedStyle(poster).backgroundImage.match(/([^/"]+)"?\)$/);
    return width > 0 && height > 0 && match ? match[1] : null;
  };

  // Waits for an element to stop moving: the AV component's controls move
  // down once its player is sized for the media, and a click before then
  // lands where they were.
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

  // Expects the player to show an image (or none), giving it up to 10s to.
  const expectShown = async (expected) => {
    let shown = await page.evaluate(shownImage, player.poster);
    for (let waited = 0; shown !== expected && waited < 10000; waited += 250) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      shown = await page.evaluate(shownImage, player.poster);
    }
    expect(shown).toBe(expected);
  };

  it.each(CASES)(
    "shows $name",
    async ({ manifest, beforePlay, whilePlaying }) => {
      if (page) {
        await page.close();
      }
      page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.goto(viewerUrl(fixture(player.prefix + manifest)), {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector(player.play, { visible: true });
      await expectShown(beforePlay);

      // The AV component loads its media's metadata straight away, so it's
      // played once that's loaded (mediaelement loads media on play).
      if (player.prefix) {
        await page.waitForFunction(() =>
          Array.from(
            document.querySelectorAll(".centerPanel audio, .centerPanel video")
          ).some((media) => media.readyState >= 1)
        );
      }
      await waitUntilStill(player.play);
      await page.click(player.play);
      // Playback has started (whether or not the media has buffered enough
      // to move on), which is when the players change images.
      await page.waitForFunction(() =>
        Array.from(
          document.querySelectorAll(".centerPanel audio, .centerPanel video")
        ).some((media) => !media.paused)
      );
      await expectShown(whilePlaying);
    },
    60000
  );
});
