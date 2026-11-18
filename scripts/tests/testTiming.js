// How the e2e tests force timing that would otherwise be left to chance, so
// a test that depends on it fails every time, not only when the machine
// happens to be busy or the network slow.

const { interceptRequests } = require("./testRequests");

// Makes the page's Date.now move on a millisecond each time it's read, as it
// can when the machine is busy, so code mustn't depend on how long passes
// between two reads. Call before loading the page.
const tickingClock = (page) =>
  page.evaluateOnNewDocument(() => {
    const now = Date.now.bind(Date);
    let ticks = 0;
    Date.now = () => now() + ++ticks;
  });

// Downloads at the given rate, in bytes per second: below a media file's
// bitrate, playback has to keep waiting for it. Call before loading the page.
const slowNetwork = (page, bytesPerSecond) =>
  page.emulateNetworkConditions({
    download: bytesPerSecond,
    upload: bytesPerSecond,
    latency: 0,
  });

// Holds each request for a URL containing `file` for `ms` before letting it
// through, so its response arrives after whatever the test does meanwhile
// (and a request the page gives up on meanwhile never arrives). It can be
// used with asFirefox (see testHls.js), which intercepts requests too: both
// add a rule to testRequests' one handler. Call before loading the page.
const delayResponses = (page, file, ms) =>
  interceptRequests(page, (request) =>
    decodeURIComponent(request.url()).includes(file) ? ms : undefined
  );

module.exports = { delayResponses, slowNetwork, tickingClock };
