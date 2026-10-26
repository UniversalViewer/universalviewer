let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl } = require("../../scripts/testViewer");

// The thumbnails of audio and video canvases, in each player: the image
// shown with the media (see mediaThumbnail), or an icon for the kind of
// media when there's none, rather than an image that can't load. Choosing
// one plays that canvas, and titles the player for it. The first of these two canvases has a thumbnail
// image; the second has no image at all.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;
const IMAGE = "image-fixture-1-euclid-page-thumb.jpg";

const PLAYERS = [
  {
    player: "mediaelement (manifests without ranges)",
    manifest: "two-canvas-audio-manifest.json",
    // The manifest's label, whichever canvas plays.
    titles: [
      "Audio on two canvases (e2e test fixture)",
      "Audio on two canvases (e2e test fixture)",
    ],
  },
  {
    player: "the AV component (manifests with ranges)",
    manifest: "ranges-two-canvas-audio-manifest.json",
    // The label of the range playing: each canvas is one.
    titles: ["Side 1", "Side 2"],
  },
];

describe.each(PLAYERS)("Thumbnails in $player", ({ manifest, titles }) => {
  let browser;
  let context;
  let page;
  let errors;
  let brokenImages;

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

  // Loads the manifest as a new visitor and shows its thumbnails.
  beforeEach(async () => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    errors = [];
    brokenImages = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400 && /\.(jpg|png)$/.test(response.url())) {
        brokenImages.push(response.url());
      }
    });
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(viewerUrl(fixture(manifest)), {
      waitUntil: "domcontentloaded",
    });
    // The AV extension's left panel has a tab for its thumbnails (and one
    // for its index); the MediaElement extension's shows them without one.
    await page.waitForSelector(".leftPanel .thumb");
    const tab = await page.$(".leftPanel .thumbs.tab");
    if (tab && (await tab.isVisible())) {
      await tab.click();
    }
    await page.waitForSelector(".leftPanel .thumb", { visible: true });
  }, 60000);

  // What each thumbnail shows: its image, once loaded, or the icon for its
  // kind of media.
  const shown = () =>
    page.$$eval(".leftPanel .thumb", (thumbs) =>
      thumbs.map((thumb) => {
        const wrap = thumb.querySelector(".wrap");
        const image = wrap.querySelector("img");
        if (image) {
          return image.naturalWidth > 0
            ? image.getAttribute("src").split("/").pop()
            : "an image that didn't load";
        }
        const icon = getComputedStyle(wrap).backgroundImage;
        if (icon === "none") {
          return "nothing";
        }
        return thumb.classList.contains("audio") ? "audio icon" : "icon";
      })
    );

  it("shows each canvas' image, or an icon for its media", async () => {
    await page.waitForFunction(
      () => {
        const image = document.querySelector(".leftPanel .thumb img");
        return image && image.complete;
      },
      { timeout: 10000 }
    );
    expect(await shown()).toEqual([IMAGE, "audio icon"]);
    expect(brokenImages).toEqual([]);
  }, 60000);

  it("plays the canvas chosen", async () => {
    const thumbs = await page.$$(".leftPanel .thumb");
    await thumbs[1].click();
    await page.waitForFunction(
      () =>
        Array.from(document.querySelectorAll(".centerPanel audio")).some(
          (audio) =>
            /side=2/.test(
              audio.currentSrc ||
                audio.getAttribute("src") ||
                (audio.querySelector("source") || {}).src
            )
        ),
      { timeout: 10000 }
    );
    expect(errors).toEqual([]);
  }, 60000);

  it("titles the player for the canvas chosen", async () => {
    const title = () =>
      page.$eval(".centerPanel h1.title", (h1) => h1.textContent.trim());
    await page.waitForFunction(
      (expected) =>
        document.querySelector(".centerPanel h1.title").textContent.trim() ===
        expected,
      { timeout: 10000 },
      titles[0]
    );
    const thumbs = await page.$$(".leftPanel .thumb");
    await thumbs[1].click();
    await page
      .waitForFunction(
        (expected) =>
          document.querySelector(".centerPanel h1.title").textContent.trim() ===
          expected,
        { timeout: 10000 },
        titles[1]
      )
      .catch(() => {});
    expect(await title()).toBe(titles[1]);
  }, 60000);
});
