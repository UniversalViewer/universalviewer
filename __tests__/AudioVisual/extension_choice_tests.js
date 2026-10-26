let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl } = require("../../scripts/testViewer");

// The extension IIIFContentHandler chooses: by the first painting annotation
// body's format, else its type (or, for a canvas without content, as in IIIF
// v2 IxIF manifests, by the canvas' type, else its format). Audio and video
// formats choose the AV extension for manifests with ranges or with more than
// one clip on a canvas, and the MediaElement extension for others, or where
// the host prefers it
// (preferMediaElementExtension). Only the extension chosen is configured
// (the configure event), apart from when the host's preference is needed. The
// media doesn't exist: only the extension chosen is tested.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

// The extensions configured, in order, each named by its center panel.
const AV = "avCenterPanel";
const MEDIAELEMENT = "mediaElementCenterPanel";

const CASES = [
  {
    name: "audio and video without ranges",
    manifest: "accompanying-image-audio-manifest.json",
    extension: "uv-mediaelement-extension",
    configured: [MEDIAELEMENT],
  },
  {
    name: "audio and video with ranges",
    manifest: "ranges-accompanying-image-audio-manifest.json",
    extension: "uv-av-extension",
    configured: [AV],
  },
  {
    name: "clips on one canvas, played in turn, without ranges",
    manifest: "two-clips-audio-manifest.json",
    extension: "uv-av-extension",
    configured: [AV],
  },
  {
    name: "HLS with ranges",
    manifest: "ranges-hls-audio-manifest.json",
    extension: "uv-av-extension",
    configured: [AV],
  },
  {
    name: "HLS without ranges",
    manifest: "hls-audio-manifest.json",
    extension: "uv-mediaelement-extension",
    configured: [MEDIAELEMENT],
  },
  {
    name: "media given only by the type Audio",
    manifest: "audio-type-manifest.json",
    extension: "uv-mediaelement-extension",
    configured: [MEDIAELEMENT],
  },
  {
    name: "media given only by the type Video",
    manifest: "video-type-manifest.json",
    extension: "uv-mediaelement-extension",
    configured: [MEDIAELEMENT],
  },
  {
    name: "media in a format not listed, by its type",
    manifest: "unlisted-format-audio-manifest.json",
    extension: "uv-mediaelement-extension",
    configured: [MEDIAELEMENT],
  },
  {
    name: "IIIF v2 IxIF media of a type not listed, by its format",
    manifest: "ixif-unlisted-type-audio-manifest.json",
    extension: "uv-mediaelement-extension",
    configured: [MEDIAELEMENT],
  },
];

describe("The extension chosen for audio and video", () => {
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

  // Loads a manifest as a new visitor, recording the extensions configured:
  // each viewer the page creates (UV.init) has its configure events recorded
  // in window.configured.
  const load = async (manifest) => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    await page.evaluateOnNewDocument(() => {
      window.configured = [];
      let UV;
      Object.defineProperty(window, "UV", {
        configurable: true,
        get: () => UV,
        set: (value) => {
          UV = new Proxy(value, {
            get: (target, property) =>
              property !== "init"
                ? target[property]
                : (...args) => {
                    const uv = target.init(...args);
                    uv.on("configure", ({ config }) =>
                      window.configured.push(
                        Object.keys(config.modules).find((module) =>
                          /^(av|mediaElement)CenterPanel$/.test(module)
                        ) || "other"
                      )
                    );
                    return uv;
                  },
          });
        },
      });
    });
    await page.goto(viewerUrl(fixture(manifest)), {
      waitUntil: "domcontentloaded",
    });
    return waitForExtension();
  };

  const waitForExtension = async () => {
    await page.waitForFunction(() =>
      /uv-[a-z-]+-extension\b/.test(
        (document.querySelector(".uv-iiif-extension-host") || {}).className ||
          ""
      )
    );
    return page.$eval(
      ".uv-iiif-extension-host",
      (host) =>
        host.className.match(
          /uv-(av|mediaelement|default|openseadragon)-extension/
        )[0]
    );
  };

  const configured = () => page.evaluate(() => window.configured);

  it.each(CASES)(
    "is $extension for $name",
    async ({ manifest, extension, configured: expected }) => {
      expect(await load(manifest)).toBe(extension);
      expect(await configured()).toEqual(expected);
    },
    60000
  );

  it("is the MediaElement extension for media with ranges where the host prefers it", async () => {
    await load("ranges-accompanying-image-audio-manifest.json");
    // The host's preference, applied through the examples page's
    // Configuration tab, which starts the viewer again with it.
    await page.evaluate(() => {
      window.configured = [];
      document
        .querySelector(".uv-iiif-extension-host")
        .classList.add("unconfigured");
      document.getElementById("customConfig").value = JSON.stringify({
        options: { preferMediaElementExtension: true },
      });
      document.getElementById("setConfigButton").click();
    });
    await page.waitForSelector(
      ".uv-iiif-extension-host:not(.unconfigured).uv-mediaelement-extension"
    );
    expect(await waitForExtension()).toBe("uv-mediaelement-extension");
    // The host's preference is only known once the AV extension is
    // configured.
    expect(await configured()).toEqual([AV, MEDIAELEMENT]);
  }, 60000);
});
