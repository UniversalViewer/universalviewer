let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const {
  viewerUrl,
  applyConfig,
  closeAttribution,
  waitUntilStill,
} = require("../../scripts/testViewer");
const { asFirefox } = require("../../scripts/testHls");

// Each player's hideMediaError option: when a host configures it, the user
// isn't told when the media can't be played (see
// __tests__/AudioVisual/media_error_tests.js for the message itself), and the
// page still doesn't throw an error. The config is applied through the
// examples page's Configuration tab, which starts the viewer again with it,
// as a host's uv.on("configure") would.
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
    // It loads media straight away.
    play: null,
  },
];

// The media that can't be played (see media_error_tests.js for why).
const MEDIA = [
  {
    media: "a missing file",
    manifest: "missing-audio-manifest.json",
    file: "missing-audio.mp3",
  },
  {
    media: "an HLS stream hls.js can't load, as in Firefox",
    manifest: "cross-origin-hls-manifest.json",
    file: "stream.m3u8",
    asFirefox: true,
  },
  {
    media: "an HLS stream neither hls.js nor the browser's own player can play",
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

// Each test starts the viewer twice, which can be slow while other tests
// run, so has 60s.
describe.each(CASES)("hideMediaError, for $media in $player", (media) => {
  let browser;
  let context;
  let page;
  let errors;
  let failed;

  // Starting the browser can be slow while other tests run, so has 60s.
  beforeAll(async () => {
    puppeteer = (await import("puppeteer")).default;
    browser = await puppeteer.launch({
      headless: true,
      // Play is first pressed from within the page (see
      // loadWithConfigAndPlay), which the browser wouldn't otherwise let
      // start the media.
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--autoplay-policy=no-user-gesture-required",
      ],
    });
  }, 60000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  // Loads the manifest as a new visitor, applies the host's config and plays
  // the media, collecting the page's uncaught errors and noting when the
  // media fails: a request for it fails or is answered with an error, or the
  // media element reports an error (as the browser's own HLS player does
  // when it can't play a stream it has loaded).
  const loadWithConfigAndPlay = async (config) => {
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
    await page.exposeFunction("mediaFailed", () => {
      failed = true;
    });
    await page.evaluateOnNewDocument(() => {
      document.addEventListener(
        "error",
        (event) => {
          if (event.target instanceof HTMLMediaElement) {
            window.mediaFailed();
          }
        },
        true
      );
    });
    if (media.asFirefox) {
      await asFirefox(page);
    }
    await page.goto(viewerUrl(fixture(media.prefix + media.manifest)), {
      waitUntil: "domcontentloaded",
    });

    // Without the config, the user is told the media can't be played: so the
    // error path runs for this media, and its message being hidden after is
    // the config's doing. The player may find it can't play the media before
    // play is pressed (e.g. mediaelement starts loading an HLS stream straight
    // away), and a click outside the message would close it. So, as in
    // media_error_tests.js, play is pressed only if the message isn't shown,
    // in one step within the page, on the button itself.
    if (media.play) {
      await page.waitForSelector(media.play, { visible: true });
      await page.$eval(media.play, (button) => {
        if (!document.querySelector(".genericDialogue").offsetParent) {
          button.click();
        }
      });
    }
    await page.waitForSelector(".genericDialogue", {
      visible: true,
      timeout: 30000,
    });

    // Then through the Configuration tab. The viewer started again with the
    // config tries the media again.
    failed = false;
    await applyConfig(page, config);

    if (media.play) {
      await page.waitForSelector(media.play, { visible: true });
      // The viewer started again shows the manifest's attribution (if it
      // has one) again, which can cover the play button, and is laid out
      // again as it loads, moving it.
      await closeAttribution(page);
      await waitUntilStill(page, media.play);
      await page.click(media.play);
    }
  };

  it("doesn't tell the user when configured to hide media errors", async () => {
    await loadWithConfigAndPlay({
      modules: { [media.panel]: { options: { hideMediaError: true } } },
    });
    for (let waited = 0; !failed && waited < 20000; waited += 250) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    expect(failed).toBe(true);
    // Once the player has tried every way it has of playing the media (e.g.
    // hls.js, then the browser's own player), and so would have shown a
    // message.
    await page.waitForNetworkIdle({ idleTime: 1000, timeout: 30000 });
    // The viewer has a message dialogue, but it's hidden.
    expect(
      await page.$eval(".genericDialogue", (d) => d.offsetParent === null)
    ).toBe(true);
    expect(errors).toEqual([]);
  }, 60000);
});
