let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl } = require("../../scripts/testViewer");

// The MediaElement player's volume controls on touch devices
// (mediaElementCenterPanel's hideVolumeOnTouchDevices): shown by default, on
// an Android phone, which lets pages set the volume; and left out, mute
// included, when a host configures it so, as mediaelement itself does by
// default. For the video player and the audio player alike. The config is
// applied through the examples page's Configuration tab, which starts the
// viewer again with it, as a host's uv.on("configure") would.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

const PLAYERS = [
  ["the video player", fixture("captioned-video-manifest.json")],
  ["the audio player", fixture("captioned-audio-manifest.json")],
];

const ANDROID_PHONE = {
  viewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
  userAgent:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36",
};

describe.each(PLAYERS)("Volume controls in %s on touch devices", (_, manifest) => {
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

  // Loads the manifest as a new visitor on an Android phone, applies the
  // host's config, if any, and returns which volume controls are shown.
  const volumeControls = async (config) => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    await page.setUserAgent(ANDROID_PHONE.userAgent);
    await page.setViewport({ deviceScaleFactor: 1, ...ANDROID_PHONE.viewport });
    await page.goto(viewerUrl(manifest), { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".mejs__controls .captions-button", {
      visible: true,
    });
    if (config) {
      await page.evaluate((config) => {
        document.querySelector(".centerPanel").classList.add("unconfigured");
        document.getElementById("customConfig").value = JSON.stringify(config);
        document.getElementById("setConfigButton").click();
      }, config);
      await page.waitForSelector(".centerPanel:not(.unconfigured)");
      await page.waitForSelector(".mejs__controls .captions-button", {
        visible: true,
      });
    }
    return page.evaluate(() => {
      const shown = (selector) => {
        const el = document.querySelector(selector);
        const box = el && el.getBoundingClientRect();
        return !!box && box.width > 0 && box.height > 0;
      };
      return {
        mute: shown(".mejs__volume-button button"),
        volume: shown(".mejs__horizontal-volume-slider"),
      };
    });
  };

  it("shows them by default", async () => {
    expect(await volumeControls()).toEqual({ mute: true, volume: true });
  }, 60000);

  it("leaves them out when configured to", async () => {
    expect(
      await volumeControls({
        modules: {
          mediaElementCenterPanel: {
            options: { hideVolumeOnTouchDevices: true },
          },
        },
      })
    ).toEqual({ mute: false, volume: false });
  }, 60000);
});
