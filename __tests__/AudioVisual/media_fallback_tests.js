let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const {
  viewerUrl,
  closeAttribution,
  waitUntilStill,
} = require("../../scripts/testViewer");
const {
  asFirefox,
  asSafari,
  playsHlsNatively,
  requestKinds,
  requesters,
} = require("../../scripts/testHls");

// When a manifest offers its media in more than one version (a Choice), and
// the first the player tries can't be played, it plays the next, rather than
// telling the user it can't play the media. Here an HLS stream that can't be
// played (from another origin without CORS headers, so hls.js can't load it,
// and with an Ogg segment, which no HLS player can play) is offered first,
// then an Ogg file that can be: in a browser without its own HLS player
// (Firefox, mocked here in Chrome), where UV tries the stream with hls.js; in
// Chrome, which has its own, but where UV tries hls.js first; and in Safari
// (mocked here in Chrome), where UV tries the browser's own player first.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

// The versions of the media, as the manifests offer them.
const STREAM = "stream.m3u8";
const FALLBACK = "whale-song.ogg?fallback";
// The fallback's length (the stream's is 10 seconds).
const FALLBACK_DURATION = 37.9;
// The players' media elements: mediaelement plays HLS with hls.js in a video
// element, even for audio.
const MEDIA = ".centerPanel audio, .centerPanel video";

const PLAYERS = [
  {
    player: "mediaelement (manifests without ranges)",
    manifest: "hls-fallback-manifest.json",
    play: ".mejs__playpause-button button",
  },
  {
    player: "the AV component (manifests with ranges)",
    manifest: "ranges-hls-fallback-manifest.json",
    play: ".iiif-av-component .controls-container button:has(.av-icon-play)",
  },
];

// Who requests the stream in each (see mediaAttempts): the first way UV
// tries HLS there, then, once that fails, the next version plays, so the
// other way (where there is one) isn't tried.
const BROWSERS = [
  { browser: "as in Firefox", asFirefox: true, requestedBy: ["hls.js"] },
  { browser: "in Chrome", requestedBy: ["hls.js"] },
  {
    browser: "as in Safari",
    asSafari: true,
    requestedBy: ["the browser's own player"],
  },
];

const CASES = PLAYERS.flatMap((player) =>
  BROWSERS.map((browser) => ({ ...player, ...browser }))
);

describe.each(CASES)("Falling back from HLS in $player, $browser", (media) => {
  let browser;
  let context;
  let page;
  let errors;
  let requested;
  // The kinds of request made for the stream (see requestKinds).
  let streamRequests;

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

  // The media playing: its source, length and time, once it's 0.5 seconds
  // in.
  const playing = async () => {
    await page.waitForFunction(
      (selector) =>
        Array.from(document.querySelectorAll(selector)).some(
          (media) => !media.paused && media.currentTime > 0.5
        ),
      { timeout: 20000 },
      MEDIA
    );
    return page.$$eval(MEDIA, (elements) =>
      elements
        .filter((media) => !media.paused && media.currentTime > 0.5)
        .map((media) => ({ src: media.currentSrc, duration: media.duration }))
    );
  };

  // Loads the manifest as a new visitor, noting the versions of the media
  // requested, in order, and presses play once.
  beforeEach(async () => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    errors = [];
    requested = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      const version = [STREAM, FALLBACK].find((name) =>
        request.url().includes(name)
      );
      if (version && requested[requested.length - 1] !== version) {
        requested.push(version);
      }
    });
    streamRequests = requestKinds(page, STREAM);
    if (media.asFirefox) {
      await asFirefox(page);
    }
    if (media.asSafari) {
      await asSafari(page);
    }
    await page.goto(viewerUrl(fixture(media.manifest)), {
      waitUntil: "domcontentloaded",
    });
    expect(await playsHlsNatively(page)).toBe(!media.asFirefox);
    await page.waitForSelector(media.play, { visible: true });
    await closeAttribution(page);
    await waitUntilStill(page, media.play);
    await page.click(media.play);
  }, 60000);

  it("tries the HLS stream first, then the next version", async () => {
    await playing();
    expect(requested).toEqual([STREAM, FALLBACK]);
    // The way it's meant to try the stream, for the browser.
    expect(requesters(streamRequests)).toEqual(media.requestedBy);
  }, 60000);

  it("plays the next version of the media", async () => {
    const [audio] = await playing();
    expect(audio.src).toContain(FALLBACK);
    expect(audio.duration).toBeCloseTo(FALLBACK_DURATION, 0);
  }, 60000);

  it("doesn't tell the user it can't play the media", async () => {
    await playing();
    expect(
      await page.$eval(".genericDialogue", (d) => d.offsetParent === null)
    ).toBe(true);
    expect(errors).toEqual([]);
  }, 60000);
});
