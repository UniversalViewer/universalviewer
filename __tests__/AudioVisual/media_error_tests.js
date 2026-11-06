let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl } = require("../../scripts/testViewer");
const {
  asFirefox,
  asSafari,
  playsHlsNatively,
  requestKinds,
  requesters,
} = require("../../scripts/testHls");
const { delayResponses } = require("../../scripts/testTiming");

// When a manifest's media can't be played, every way of playing it having
// been tried, the user is told so in a message, and the page doesn't throw an
// error. The media can't be played because:
// - its file returns 404 Not Found, as the old Florence Nightingale
//   manifest's does;
// - it's an HLS stream served from another origin without CORS headers, as
//   the British Library's early AV streams are, with a segment no HLS player
//   can play. hls.js can't load it. In a browser without its own HLS player
//   (Firefox, mocked here in Chrome), that's the only way UV can play it, and
//   the message says why. In one with its own player, that player loads it
//   (it needs no CORS), but can't play its segment: UV tries it after hls.js
//   in Chrome, and before hls.js in Safari (mocked here in Chrome);
// - it's an MPEG-DASH stream served the same way, which dash.js can't load.
// (Whether the message is shown at all, hideMediaError, is tested in
// __tests__/Config/hide_media_error_tests.js.)
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

const MESSAGE = {
  en: "Sorry, this media can't be played. It may have been moved or be unavailable.",
  cy: "Mae'n ddrwg gennym, ni ellir chwarae'r cyfryngau hyn. Efallai eu bod wedi'u symud neu nad ydynt ar gael.",
};
// Added when the stream's server sends no CORS headers, and the browser has
// no HLS player of its own to play it without them.
const BLOCKED_BY_CORS = {
  en: "Its server doesn't allow it to be played on other websites (it sends no CORS headers). It may play in Chrome or Safari, which can sometimes play resources without CORS headers.",
  cy: "Nid yw ei weinydd yn caniatáu iddo gael ei chwarae ar wefannau eraill (nid yw'n anfon penawdau CORS). Efallai y bydd yn chwarae yn Chrome neu Safari, sy'n gallu chwarae adnoddau heb benawdau CORS weithiau.",
};

const PLAYERS = [
  {
    player: "mediaelement (manifests without ranges)",
    prefix: "",
    // It doesn't load most media until it's played.
    play: ".mejs__playpause-button button",
  },
  {
    player: "the AV component (manifests with ranges)",
    prefix: "ranges-",
    // It loads media straight away, so finds it can't before it's played.
    play: null,
  },
];

const MEDIA = [
  {
    media: "a missing file",
    manifest: "missing-audio-manifest.json",
  },
  {
    // Found missing only well after the player is shown, so play is always
    // pressed first, and the browser rejects that request to play it.
    media: "a missing file, found missing after play is pressed",
    manifest: "missing-audio-manifest.json",
    delay: { file: "missing-audio.mp3", ms: 3000 },
  },
  {
    media: "an HLS stream hls.js can't load, as in Firefox",
    manifest: "cross-origin-hls-manifest.json",
    stream: "stream.m3u8",
    asFirefox: true,
    blockedByCors: true,
    // Only ever by hls.js.
    requestedBy: ["hls.js"],
  },
  {
    media: "an HLS stream neither hls.js nor the browser's own player can play",
    manifest: "cross-origin-hls-manifest.json",
    stream: "stream.m3u8",
    requestedBy: ["hls.js", "the browser's own player"],
  },
  {
    media:
      "an HLS stream neither the browser's own player nor hls.js can play, as in Safari",
    manifest: "cross-origin-hls-manifest.json",
    stream: "stream.m3u8",
    asSafari: true,
    requestedBy: ["the browser's own player", "hls.js"],
  },
  {
    media: "an MPEG-DASH stream it can't load",
    manifest: "cross-origin-dash-manifest.json",
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
  let streamRequests;

  beforeAll(async () => {
    puppeteer = (await import("puppeteer")).default;
    browser = await puppeteer.launch({
      headless: true,
      // Play is pressed from within the page (see loadAndPlay), which the
      // browser wouldn't otherwise let start the media.
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--autoplay-policy=no-user-gesture-required",
      ],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  // Loads the manifest as a new visitor, collecting the page's uncaught
  // errors (including unhandled promise rejections) and the requests for the
  // stream, and presses play if the player waits for that before loading
  // media.
  const loadAndPlay = async ({ locales } = {}) => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    streamRequests = media.stream ? requestKinds(page, media.stream) : [];
    if (media.asFirefox) {
      await asFirefox(page);
    }
    if (media.asSafari) {
      await asSafari(page);
    }
    if (media.delay) {
      await delayResponses(page, media.delay.file, media.delay.ms);
    }
    await page.goto(
      viewerUrl(fixture(media.prefix + media.manifest), locales),
      {
        waitUntil: "domcontentloaded",
      }
    );
    if (media.stream && !media.asFirefox) {
      expect(await playsHlsNatively(page)).toBe(true);
    }
    if (media.play) {
      await page.waitForSelector(media.play, { visible: true });
      // It may find it can't play the media first (e.g. mediaelement starts
      // loading an HLS stream straight away), and a click outside the message
      // would close it. So Play is pressed only if the message isn't shown,
      // in one step within the page, and on the button itself, so it can't
      // land on a message shown meanwhile.
      await page.$eval(media.play, (button) => {
        if (!document.querySelector(".genericDialogue").offsetParent) {
          button.click();
        }
      });
    }
  };

  const message = async () => {
    await page.waitForSelector(".genericDialogue", { visible: true });
    return page.$eval(".genericDialogue p", (p) => p.textContent.trim());
  };

  const expected = (language) =>
    media.blockedByCors
      ? `${MESSAGE[language]} ${BLOCKED_BY_CORS[language]}`
      : MESSAGE[language];

  it("tells the user, in a message, that the media can't be played", async () => {
    await loadAndPlay();
    return expect(await message()).toBe(expected("en"));
  }, 60000);

  it("tells the user in their language", async () => {
    await loadAndPlay({ locales: "cy-GB" });
    return expect(await message()).toBe(expected("cy"));
  }, 60000);

  it("doesn't throw an uncaught error", async () => {
    await loadAndPlay();
    await message();
    // Gives any rejected play request time to go unhandled.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return expect(errors).toEqual([]);
  }, 60000);

  if (media.requestedBy) {
    it("tries the stream every way it can before telling the user", async () => {
      await loadAndPlay();
      await message();
      return expect(requesters(streamRequests)).toEqual(media.requestedBy);
    }, 60000);
  }
});
