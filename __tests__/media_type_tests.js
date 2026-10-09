const puppeteer = require("puppeteer");
const { BASE_URL } = require("../scripts/testBaseUrl");
const { viewerUrl } = require("../scripts/testViewer");

// The MediaElement extension plays audio in an audio player and video in a
// video player, as isVideoCanvas decides (poster_images_tests.ts covers its
// rules), for IIIF v3 manifests and IIIF v2 manifests whose media is in a
// media sequence (IxIF), as Wellcome Collection's are.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

const CASES = [
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
];

describe("The MediaElement extension's player", () => {
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

  it.each(CASES)(
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
    },
    60000
  );
});
