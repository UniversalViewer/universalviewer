const puppeteer = require("puppeteer");
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl } = require("../../scripts/testViewer");

// When a manifest's media can't be played, the user is told so in a message
// (unless the player is configured not to: hideMediaError), and the page
// doesn't throw an error. The media can't be played because:
// - its file returns 404 Not Found, as the old Florence Nightingale
//   manifest's does;
// - it's an HLS or MPEG-DASH stream served from another origin without CORS
//   headers, as the British Library's early AV streams are, which hls.js and
//   dash.js can't load (they report the failure themselves, rather than the
//   media element).
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

const PLAYERS = [
  {
    player: "mediaelement (manifests without ranges)",
    prefix: "",
    panel: "mediaElementCenterPanel",
    // It doesn't load most media until it's played.
    play: ".mejs__playpause-button button",
  },
  {
    player: "the AV component (manifests with ranges)",
    prefix: "ranges-",
    panel: "avCenterPanel",
    // It loads media straight away, so finds it can't before it's played.
    play: null,
  },
];

const MEDIA = [
  {
    media: "a missing file",
    manifest: "missing-audio-manifest.json",
    file: "missing-audio.mp3",
  },
  {
    media: "an HLS stream it can't load",
    manifest: "cross-origin-hls-manifest.json",
    file: "stream.m3u8",
  },
  {
    media: "an MPEG-DASH stream it can't load",
    manifest: "cross-origin-dash-manifest.json",
    file: "stream.mpd",
  },
];

const CASES = PLAYERS.flatMap((player) =>
  MEDIA.map((media) => ({ ...player, ...media }))
);

// Each test loads the viewer and plays its media, which can be slow while
// other tests run, so has 60s.
describe.each(CASES)("$media in $player", (media) => {
  let browser;
  let context;
  let page;
  let errors;
  let failed;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  // Loads the manifest as a new visitor, collecting the page's uncaught
  // errors (including unhandled promise rejections) and noting when the
  // media fails to load, and presses play if the player waits for that
  // before loading media.
  const loadAndPlay = async ({ locales, config } = {}) => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    errors = [];
    failed = false;
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => {
      if (request.url().includes(media.file)) {
        failed = true;
      }
    });
    page.on("response", (response) => {
      if (response.url().includes(media.file) && response.status() >= 400) {
        failed = true;
      }
    });
    await page.goto(
      viewerUrl(fixture(media.prefix + media.manifest), locales),
      {
        waitUntil: "domcontentloaded",
      }
    );
    if (config) {
      await applyConfig(config);
    }
    if (media.play) {
      await page.waitForSelector(media.play, { visible: true });
      // It may find it can't play the media first (e.g. mediaelement starts
      // loading an HLS stream straight away), and a click outside the message
      // would close it.
      const messageShown = await page.$eval(
        ".genericDialogue",
        (dialogue) => !!dialogue.offsetParent
      );
      if (!messageShown) {
        await page.click(media.play);
      }
    }
  };

  // Applies config through the examples page's Configuration tab, which
  // starts the viewer again with it, and waits for the new viewer.
  const applyConfig = async (config) => {
    await page.waitForSelector(".genericDialogue");
    // The viewer started again with the config loads the media again.
    failed = false;
    await page.evaluate((config) => {
      document.querySelector(".genericDialogue").classList.add("unconfigured");
      document.getElementById("customConfig").value = JSON.stringify(config);
      document.getElementById("setConfigButton").click();
    }, config);
    await page.waitForSelector(".genericDialogue:not(.unconfigured)");
  };

  const message = async () => {
    await page.waitForSelector(".genericDialogue", { visible: true });
    return page.$eval(".genericDialogue p", (p) => p.textContent.trim());
  };

  it("tells the user, in a message, that the media can't be played", async () => {
    await loadAndPlay();
    expect(await message()).toBe(
      "Sorry, this media can't be played. It may have been moved or be unavailable."
    );
  }, 60000);

  it("tells the user in their language", async () => {
    await loadAndPlay({ locales: "cy-GB" });
    expect(await message()).toBe(
      "Mae'n ddrwg gennym, ni ellir chwarae'r cyfryngau hyn. Efallai eu bod wedi'u symud neu nad ydynt ar gael."
    );
  }, 60000);

  it("doesn't throw an uncaught error", async () => {
    await loadAndPlay();
    await message();
    // Gives any rejected play request time to go unhandled.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(errors).toEqual([]);
  }, 60000);

  // It starts the viewer twice, which can be slow while other tests run.
  it("doesn't tell the user when configured to hide media errors", async () => {
    await loadAndPlay({
      config: {
        modules: { [media.panel]: { options: { hideMediaError: true } } },
      },
    });
    for (let waited = 0; !failed && waited < 20000; waited += 250) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    expect(failed).toBe(true);
    // Gives a message time to be shown.
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // The viewer has a message dialogue, but it's hidden.
    expect(
      await page.$eval(".genericDialogue", (d) => d.offsetParent === null)
    ).toBe(true);
    expect(errors).toEqual([]);
  }, 60000);
});
