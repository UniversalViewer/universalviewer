const puppeteer = require("puppeteer");
const { BASE_URL } = require("../scripts/testBaseUrl");
const { viewerUrl } = require("../scripts/testViewer");

// The AV component (manifests with ranges) creates an audio or a video
// element for media as mediaKind decides (media_kind_tests.ts covers its
// rules), for a canvas played on its own and for canvases played as one
// timeline (auto-advance). The media doesn't exist: only the element created
// is tested.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

const CASES = [
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

describe("The AV component's media element", () => {
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
