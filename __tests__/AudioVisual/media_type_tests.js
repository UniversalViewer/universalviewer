let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const {
  viewerUrl,
  closeAttribution,
  waitUntilStill,
} = require("../../scripts/testViewer");

// Both players play audio as audio and video as video, as mediaKind and
// isVideoCanvas decide (media_kind_tests.ts covers their rules, which the
// players share):
// - the MediaElement extension (manifests without ranges) builds an audio or
//   a video player, for IIIF v3 manifests and IIIF v2 manifests whose media
//   is in a media sequence (IxIF), as Wellcome Collection's are;
// - the AV component (manifests with ranges) creates an audio or a video
//   element, for a canvas played on its own and for canvases played as one
//   timeline (auto-advance). Its media doesn't exist: only the element
//   created is tested.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

const MEDIAELEMENT_CASES = [
  {
    name: "IIIF v3 audio in an MP4 file (recipe 0014)",
    manifest: "accompanying-image-audio-manifest.json",
    player: "audio",
  },
  {
    name: "IIIF v3 video",
    manifest: "placeholder-video-manifest.json",
    player: "video",
  },
  {
    name: "video in a draft IIIF Presentation 3 manifest",
    manifest: "draft-content-video-manifest.json",
    player: "video",
  },
  {
    name: "IIIF v2 IxIF audio",
    manifest: "ixif-audio-manifest.json",
    player: "audio",
    // Its thumbnail, given as a URL.
    image: "image-fixture-5-weighing-of-the-heart-page.jpg",
  },
  {
    name: "IIIF v2 IxIF video",
    manifest: "ixif-video-manifest.json",
    player: "video",
    image: "image-fixture-6-weighing-of-the-heart-scene.jpg",
  },
  {
    // As Villanova's manifests give it: the player's media come from the
    // canvas' renderings, whose type ("rendering") isn't a media type.
    name: "video offered as canvas renderings typed rendering",
    manifest: "rendering-typed-rendering-video-manifest.json",
    player: "video",
  },
];

const AV_COMPONENT_CASES = [
  {
    name: "media with no type, on a canvas with only a duration",
    manifest: "ranges-typeless-dash-audio-manifest.json",
    element: "audio",
  },
  {
    name: "media with no type, on a canvas with a size",
    manifest: "ranges-typeless-dash-video-manifest.json",
    element: "video",
  },
  {
    name: "media whose type is dctypes:MovingImage",
    manifest: "ranges-movingimage-video-manifest.json",
    element: "video",
  },
  {
    name: "media with no type, on canvases with a size played as one timeline",
    manifest: "ranges-auto-advance-typeless-dash-video-manifest.json",
    element: "video",
  },
];

describe("The MediaElement extension's player", () => {
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

  it.each(MEDIAELEMENT_CASES)(
    "plays $name in a $player player",
    async ({ manifest, player, image }) => {
      if (page) {
        await page.close();
      }
      page = await browser.newPage();
      await page.goto(viewerUrl(fixture(manifest)), {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector(".mejs__container", { visible: true });
      expect(
        await page.$eval(
          ".mejs__container audio, .mejs__container video",
          (m) => m.tagName.toLowerCase()
        )
      ).toBe(player);

      if (image) {
        expect(
          await page.$eval(
            ".mejs__container .mejs__poster",
            (poster) => getComputedStyle(poster).backgroundImage
          )
        ).toContain(image);
      }

      // And it plays: half a second in after play is pressed. (The manifest's
      // attribution can cover the play button.)
      const play = ".mejs__playpause-button button";
      await closeAttribution(page);
      await waitUntilStill(page, play);
      await page.click(play);
      await page.waitForFunction(
        () => {
          const media = document.querySelector(
            ".mejs__container audio, .mejs__container video"
          );
          return !media.paused && media.currentTime > 0.5;
        },
        { timeout: 20000 }
      );
    },
    60000
  );
});

describe("The AV component's media element", () => {
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

  it.each(AV_COMPONENT_CASES)(
    "is $element for $name",
    async ({ manifest, element }) => {
      if (page) {
        await page.close();
      }
      page = await browser.newPage();
      await page.goto(viewerUrl(fixture(manifest)), {
        waitUntil: "domcontentloaded",
      });
      // The player stays hidden, as the media can't load.
      await page.waitForSelector(
        ".iiif-av-component audio, .iiif-av-component video"
      );
      expect(
        await page.$$eval(
          ".iiif-av-component audio, .iiif-av-component video",
          (media) =>
            Array.from(new Set(media.map((m) => m.tagName.toLowerCase())))
        )
      ).toEqual([element]);
    },
    60000
  );
});
