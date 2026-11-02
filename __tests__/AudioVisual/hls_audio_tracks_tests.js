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
} = require("../../scripts/testHls");
const { delayResponses } = require("../../scripts/testTiming");

// HLS-only audio in tracks, each its own canvas and without ranges, as many
// digital collections give an album: its format written
// application/x-mpegURL, as servers often give it, and its playlists' names
// with commas and apostrophes in them. Each track plays, with hls.js in a
// browser where UV plays HLS with it (Firefox, mocked here in Chrome, as in
// Chrome itself), and with the browser's own player where UV plays it with
// that (Safari, mocked here in Chrome); choosing another track plays it, and
// lets go of the one left, so it isn't still loading. Each track plays the
// same recording, tagged with the track's number (?track=N on its segments),
// in four segments (byte ranges of it), so a track can be left part loaded.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

const TRACKS = [
  "01._Black_Sand_Basin,_morning.m3u8",
  "02._The_raven's_call,_l'istesso_tempo.m3u8",
  "03._Flight,_over_the_basin.m3u8",
];
const LABELS = [
  "1. Black Sand Basin, morning",
  "2. The raven's call, l'istesso tempo",
  "3. Flight, over the basin",
];
const segment = (track) => `black-sand-raven.aac?track=${track}`;
// The segments in each track's playlist.
const SEGMENTS = 4;
// The recording's length.
const DURATION = 12.65;
// The players' media elements: mediaelement plays HLS with hls.js in a video
// element, even for audio.
const MEDIA = ".centerPanel audio, .centerPanel video";

const PLAYERS = [
  {
    player: "mediaelement (manifests without ranges)",
    manifest: "hls-audio-tracks-manifest.json",
    play: ".mejs__playpause-button button",
    // It loads one track at a time, and lets go of each it leaves.
    oneTrackAtATime: true,
  },
  {
    player: "the AV component (manifests with ranges)",
    manifest: "ranges-hls-audio-tracks-manifest.json",
    play: ".iiif-av-component .controls-container button:has(.av-icon-play)",
    // It plays the tracks as one timeline, so keeps every track's media
    // ready, and pauses the track it leaves.
    oneTrackAtATime: false,
  },
];

const BROWSERS = [
  {
    browser: "as in Firefox",
    asFirefox: true,
    // hls.js fetches the stream with script requests.
    kinds: ["fetch", "xhr"],
  },
  {
    browser: "as in Safari",
    asSafari: true,
    kinds: ["media"],
  },
];

const CASES = PLAYERS.flatMap((player) =>
  BROWSERS.map((browser) => ({ ...player, ...browser }))
);

describe.each(CASES)("HLS audio tracks in $player, $browser", (media) => {
  let browser;
  let context;
  let page;
  let errors;
  // The requests for each track's playlist and segment, by kind.
  let playlists;
  let segments;
  // Every URL requested, in order (decoded), and those whose responses
  // finished arriving.
  let requests;
  let finished;
  // How long each of the first track's segments is held back, if it is.
  let segmentDelay;

  beforeAll(async () => {
    puppeteer = (await import("puppeteer")).default;
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }, 60000);

  afterAll(async () => {
    await browser.close();
  });

  // The media playing, once it's 0.5 seconds in: its source and length.
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

  // Waits for the player to be on a track: mediaelement loads it then (its
  // segment is requested), while the AV component, which loaded every track
  // already, titles the player for it.
  const waitForTrack = (track) =>
    media.oneTrackAtATime
      ? page.waitForRequest(
          (request) =>
            decodeURIComponent(request.url()).includes(segment(track)),
          { timeout: 20000 }
        )
      : page.waitForFunction(
          (label) =>
            document
              .querySelector(".centerPanel h1.title")
              .textContent.trim() === label,
          { timeout: 20000 },
          LABELS[track - 1]
        );

  // Chooses a track from the thumbnails. The AV extension's left panel has a
  // tab for its thumbnails (and one for its index); the MediaElement
  // extension's shows them without one.
  const chooseTrack = async (track) => {
    await page.waitForSelector(".leftPanel .thumb");
    const tab = await page.$(".leftPanel .thumbs.tab");
    if (tab && (await tab.isVisible())) {
      await tab.click();
    }
    await page.waitForSelector(".leftPanel .thumb", { visible: true });
    const thumbs = await page.$$(".leftPanel .thumb");
    await thumbs[track - 1].click();
  };

  // Loads the manifest as a new visitor, noting the requests for each
  // track, and plays the first.
  beforeEach(async () => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    errors = [];
    requests = [];
    finished = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) =>
      requests.push(decodeURIComponent(request.url()))
    );
    page.on("requestfinished", (request) =>
      finished.push(decodeURIComponent(request.url()))
    );
    if (segmentDelay) {
      await delayResponses(page, segment(1), segmentDelay);
    }
    playlists = TRACKS.map((name) => requestKinds(page, name));
    segments = TRACKS.map((_, i) => requestKinds(page, segment(i + 1)));
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
    if (media.oneTrackAtATime) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }, 60000);

  it("plays the first track, however its playlist is named", async () => {
    const [audio] = await playing();
    expect(audio.duration).toBeCloseTo(DURATION, 0);
    expect(playlists[0].length).toBeGreaterThan(0);
    expect(segments[0].length).toBeGreaterThan(0);
    // The way it's meant to, for the browser.
    playlists[0]
      .concat(segments[0])
      .forEach((kind) => expect(media.kinds).toContain(kind));
    if (media.oneTrackAtATime) {
      expect(playlists[1]).toEqual([]);
      expect(playlists[2]).toEqual([]);
    }
  }, 60000);

  it("loads the track chosen, however its playlist is named", async () => {
    await playing();
    await chooseTrack(2);
    await waitForTrack(2);
    expect(playlists[1].length).toBeGreaterThan(0);
    expect(segments[1].length).toBeGreaterThan(0);
    playlists[1]
      .concat(segments[1])
      .forEach((kind) => expect(media.kinds).toContain(kind));
    expect(errors).toEqual([]);
  }, 60000);

  it("keeps playing, on the track chosen, and stops the track left", async () => {
    await playing();
    const requestedBefore = requests.length;
    await chooseTrack(2);
    await waitForTrack(2);
    await playing();
    // Gives the track left time to stop.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Just the track chosen plays: where the browser's own player plays it,
    // its source says which track it is (hls.js plays from a blob URL); in
    // the AV component, which has a media element for each track, the
    // second is the second track's.
    const nowPlaying = await page.$$eval(MEDIA, (elements) =>
      elements
        .map((media, i) => ({
          i,
          playing: !media.paused,
          src: decodeURIComponent(media.currentSrc),
        }))
        .filter((media) => media.playing)
    );
    expect(nowPlaying.length).toBe(1);
    if (!nowPlaying[0].src.startsWith("blob:")) {
      expect(nowPlaying[0].src).toContain(TRACKS[1]);
    } else if (media.oneTrackAtATime) {
      // hls.js plays from a blob URL, so mediaelement's track (it loads one
      // at a time) is told by what's fetched since the choice: the second
      // track's segments, and nothing more of the first's. (The AV
      // component, which loaded every track already, is told by which of
      // its media elements plays, below.)
      const segmentsSince = requests
        .slice(requestedBefore)
        .filter((url) => /black-sand-raven\.aac\?track=\d/.test(url))
        .map((url) => url.match(/track=(\d)/)[1]);
      expect(segmentsSince).toContain("2");
      expect(segmentsSince).not.toContain("1");
    }
    if (!media.oneTrackAtATime) {
      expect(nowPlaying[0].i).toBe(1);
    }
    expect(errors).toEqual([]);
  }, 60000);

  if (media.oneTrackAtATime) {
    // With each of the first track's segments (about 3 seconds long) taking
    // 3 seconds to arrive, so it's still loading them when another track is
    // chosen.
    describe("while it's still loading", () => {
      beforeAll(() => {
        segmentDelay = 3000;
      });
      afterAll(() => {
        segmentDelay = undefined;
      });

      it("lets go of the track left, so it isn't still loading", async () => {
        await playing();
        const ofTrackLeft = (url) =>
          url.includes(TRACKS[0]) || url.includes(segment(1));
        // Still loading it: not all its segments have arrived (or the test
        // would show nothing).
        expect(
          finished.filter((url) => url.includes(segment(1))).length
        ).toBeLessThan(SEGMENTS);
        if (media.asFirefox) {
          // Counts the hls.js players stopped.
          await page.evaluate(() => {
            window.hlsPlayersStopped = 0;
            const destroy = window.Hls.prototype.destroy;
            window.Hls.prototype.destroy = function () {
              window.hlsPlayersStopped++;
              return destroy.call(this);
            };
          });
        }
        const requestedBefore = requests.length;
        const finishedBefore = finished.length;
        await chooseTrack(2);
        await waitForTrack(2);
        // Gives the track left time to load more, if it would.
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Nothing more of it is requested, and what was being loaded is let
        // go of, not left to finish arriving.
        expect(requests.slice(requestedBefore).filter(ofTrackLeft)).toEqual([]);
        expect(finished.slice(finishedBefore).filter(ofTrackLeft)).toEqual([]);
        // No media element is left with the first track.
        expect(
          await page.$$eval(
            MEDIA,
            (elements, name) =>
              elements.filter((media) =>
                decodeURIComponent(media.currentSrc).includes(name)
              ).length,
            TRACKS[0]
          )
        ).toBe(0);
        if (media.asFirefox) {
          expect(
            await page.evaluate(() => window.hlsPlayersStopped)
          ).toBeGreaterThanOrEqual(1);
        }
        expect(errors).toEqual([]);
      }, 60000);
    });
  }
});
