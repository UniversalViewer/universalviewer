let puppeteer;
const { BASE_URL } = require("../../scripts/tests/testBaseUrl");
const { viewerUrl } = require("../../scripts/tests/testViewer");

// Where and from when the AV component plays a clip, as its painting
// annotation says: the part of the canvas its target gives (#xywh=), and the
// part of its file its body gives (#t=), to the fraction of a second.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

describe("Clips in the AV component", () => {
  let browser;
  let context;
  let page;
  let dialogs;

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

  // Loads the manifest as a new visitor, recording (and dismissing) any
  // alert, which would otherwise hold the page up.
  const load = async (manifest) => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    dialogs = [];
    page.on("dialog", async (dialog) => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });
    await page.goto(viewerUrl(fixture(manifest)), {
      waitUntil: "domcontentloaded",
    });
  };

  it("is placed in the part of the canvas its target gives", async () => {
    await load("ranges-positioned-video-manifest.json");
    // The auto-advance timeline's player, shown in the index view.
    await page.waitForSelector(".leftPanel .index.tab", { visible: true });
    await page.click(".leftPanel .index.tab");
    const video = ".iiif-av-component .player.virtual video";
    await page.waitForSelector(video);
    // #xywh=240,0,240,180 of a 480 by 360 canvas: the top right quarter.
    const placed = await page.$eval(video, (media) => ({
      top: media.style.top,
      left: media.style.left,
      width: media.style.width,
      height: media.style.height,
    }));
    expect(placed).toEqual({
      top: "0%",
      left: "50%",
      width: "50%",
      height: "50%",
    });
    expect(dialogs).toEqual([]);
  }, 60000);

  it("starts from the fraction of a second its body gives", async () => {
    await load("ranges-fractional-offset-video-manifest.json");
    const video = ".iiif-av-component .player:not(.virtual) video";
    // Moved to the start of the canvas once the file's length is known.
    await page.waitForFunction(
      (selector) =>
        Array.from(document.querySelectorAll(selector)).some(
          (media) => media.currentTime > 0
        ),
      { timeout: 30000 },
      video
    );
    const start = await page.$$eval(video, (media) =>
      media.map((m) => m.currentTime).find((time) => time > 0)
    );
    // #t=1.5,21.5 on the body: the canvas' 0:00 is 1.5 seconds into it.
    expect(start).toBeCloseTo(1.5, 2);
    expect(dialogs).toEqual([]);
  }, 60000);
});
