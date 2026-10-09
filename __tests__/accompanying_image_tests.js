const puppeteer = require("puppeteer");
const { BASE_URL } = require("../scripts/testBaseUrl");
const { viewerUrl } = require("../scripts/testViewer");

// Audio with an accompanying image (IIIF Cookbook recipe 0014): the image is
// shown while the audio plays, not only before.
const MANIFEST = `${BASE_URL}/test-fixtures/accompanying-image-audio-manifest.json`;
const IMAGE = "image-fixture-1-euclid-page.jpg";

describe("Audio with an accompanying image", () => {
  let browser;
  let page;

  // Loading the viewer can be slow while other tests run, so it has 60s.
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
    await page.goto(viewerUrl(MANIFEST), { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".mejs__playpause-button button", {
      visible: true,
    });
  }, 60000);

  afterAll(async () => {
    await browser.close();
  });

  // Whether the accompanying image is what's seen in the middle of the
  // player.
  const imageShown = () =>
    page.evaluate((image) => {
      const poster = document.querySelector(".mejs__container .mejs__poster");
      if (!poster || getComputedStyle(poster).display === "none") {
        return false;
      }
      const { x, y, width, height } = poster.getBoundingClientRect();
      const seen = document.elementFromPoint(x + width / 2, y + height / 2);
      return (
        getComputedStyle(poster).backgroundImage.includes(image) &&
        (seen === poster || poster.contains(seen))
      );
    }, IMAGE);

  it("shows the image before the audio plays", async () => {
    await page.waitForSelector(".mejs__container .mejs__poster", {
      visible: true,
    });
    expect(await imageShown()).toBe(true);
  });

  it("keeps showing the image while the audio plays", async () => {
    await page.click(".mejs__playpause-button button");
    await page.waitForFunction(
      () => document.querySelector(".mejs__container audio").currentTime > 0.5
    );
    expect(await imageShown()).toBe(true);
  });
});
