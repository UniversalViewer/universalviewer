// How the e2e tests choose which of UV's two ways to play HLS a page uses
// first: the browser's own HLS player, or hls.js, which, unlike the browser's
// own player, needs the stream's server to send CORS headers. Chrome (the
// test browser, since 155) and Safari have their own player; Firefox
// doesn't. UV tries hls.js first wherever it can (Chrome, Firefox), and the
// browser's own player first in Safari (see mediaAttempts).

const { interceptRequests } = require("./testRequests");

// HLS's formats, as UV (hls-media-types.ts) and mediaelement (audio/hls,
// video/hls) know them.
const HLS_FORMAT = /mpegurl|\/hls$/i;

// An HLS playlist's URL.
const HLS_PLAYLIST = /\.m3u8(\?|$)/i;

// Whether a request is one the browser's own HLS player makes for a playlist,
// which Firefox, with no such player, never makes.
const byOwnHlsPlayer = (request) =>
  request.resourceType() === "media" &&
  HLS_PLAYLIST.test(decodeURIComponent(request.url()));

// Mocks Firefox's behaviour in Chrome: the page is told the browser can't
// play HLS itself (canPlayType answers "" for HLS's formats), so UV plays it
// with hls.js, as it does in Firefox. Chrome's own choice among a media
// element's <source> elements doesn't ask the page, so would still load an
// HLS <source> itself, as Firefox wouldn't: those requests are refused,
// through testRequests' one handler, so other helpers (such as testTiming's
// delayResponses) can act on requests too. Call before loading the page.
const asFirefox = async (page) => {
  page.asFirefox = true;
  await interceptRequests(page, (request) =>
    byOwnHlsPlayer(request) ? "abort" : undefined
  );
  await page.evaluateOnNewDocument((source) => {
    const pattern = new RegExp(source, "i");
    const canPlayType = HTMLMediaElement.prototype.canPlayType;
    HTMLMediaElement.prototype.canPlayType = function (type) {
      return pattern.test(type) ? "" : canPlayType.call(this, type);
    };
  }, HLS_FORMAT.source);
};

// Mocks Safari's behaviour in Chrome: the page is told it's in Safari (by its
// user agent), so UV plays HLS with the browser's own player first, as it
// does in Safari; Chrome's own HLS player stands in for Safari's. Call before
// loading the page.
const SAFARI =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";
const asSafari = async (page) => {
  await page.setUserAgent(SAFARI);
};

// Whether the page's browser has its own HLS player. Tests of that player
// check this first, so they fail plainly in a browser without one rather than
// testing hls.js instead.
const playsHlsNatively = (page) =>
  page.evaluate(
    () =>
      document
        .createElement("video")
        .canPlayType("application/vnd.apple.mpegurl") !== ""
  );

// The kinds of request (puppeteer's resourceType) the page makes for URLs
// containing `file`, as they're made: "media" for the browser's own player,
// "xhr" or "fetch" for hls.js. Leaves out those asFirefox refuses, which
// Firefox wouldn't make. Call before loading the page.
const requestKinds = (page, file) => {
  const kinds = [];
  page.on("request", (request) => {
    if (
      decodeURIComponent(request.url()).includes(file) &&
      !(page.asFirefox && byOwnHlsPlayer(request))
    ) {
      kinds.push(request.resourceType());
    }
  });
  return kinds;
};

// Who made the requests requestKinds collected, in turn, each once until the
// other takes over: "the browser's own player" or "hls.js".
const requesters = (kinds) =>
  kinds
    .map((kind) => (kind === "media" ? "the browser's own player" : "hls.js"))
    .filter((who, i, all) => who !== all[i - 1]);

module.exports = {
  asFirefox,
  asSafari,
  playsHlsNatively,
  requestKinds,
  requesters,
};
