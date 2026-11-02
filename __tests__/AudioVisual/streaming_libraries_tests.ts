import {
  attachDash,
  attachHls,
} from "../../src/content-handlers/iiif/modules/uv-shared-module/StreamingLibraries";

// How UV plays HLS and MPEG-DASH streams in a media element, with stand-ins
// for hls.js, dash.js and the media element (these tests run outside a
// browser). hls.js and dash.js only fetch renditions the player is big enough
// to show, and each stream can be detached, so the element can try another
// version of the media, or be let go of when the user moves to another
// canvas, without the old stream still loading.
const PAGE = "http://localhost:4444";

// hls.js: records the config it's made with, and what's done to it.
class FakeHls {
  static instances: FakeHls[] = [];
  static isSupported = () => true;
  static Events = { ERROR: "hlsError" };
  handlers: { [event: string]: (event: string, data: any) => void } = {};
  loadSource = jest.fn();
  attachMedia = jest.fn();
  destroy = jest.fn();
  constructor(public config: any) {
    FakeHls.instances.push(this);
  }
  on(event: string, handler: (event: string, data: any) => void) {
    this.handlers[event] = handler;
  }
}

// dash.js's MediaPlayer.
const dashPlayer = () => ({
  getDebug: () => ({ setLogToBrowserConsole: jest.fn() }),
  on: jest.fn(),
  initialize: jest.fn(),
  setXHRWithCredentialsForType: jest.fn(),
  setLimitBitrateByPortal: jest.fn(),
  setUsePixelRatioInLimitBitrateByPortal: jest.fn(),
  reset: jest.fn(),
});

// A media element that can play HLS itself (as in Chrome or Safari) or not
// (as in Firefox).
const mediaElement = (nativeHls = false) =>
  ({
    src: "",
    canPlayType: jest.fn(() => (nativeHls ? "maybe" : "")),
    dispatchEvent: jest.fn(),
    removeAttribute: jest.fn(),
    load: jest.fn(),
  }) as any;

let player: ReturnType<typeof dashPlayer>;

beforeEach(() => {
  FakeHls.instances = [];
  player = dashPlayer();
  const global = globalThis as any;
  global.window = global;
  global.location = { origin: PAGE, href: `${PAGE}/` };
  global.Hls = FakeHls;
  global.dashjs = {
    MediaPlayer: Object.assign(() => ({ create: () => player }), {
      events: { ERROR: "error" },
    }),
  };
});

afterEach(() => {
  const global = globalThis as any;
  delete global.Hls;
  delete global.dashjs;
  delete global.location;
  delete global.window;
});

describe("attachHls", () => {
  const STREAM = `${PAGE}/stream.m3u8`;

  it("only fetches renditions the player is big enough to show", async () => {
    await attachHls(mediaElement(), STREAM, false, "hls.js");
    expect(FakeHls.instances[0].config).toMatchObject({
      capLevelToPlayerSize: true,
    });
  });

  it("plays with hls.js, or natively, as asked", async () => {
    const withHlsJs = mediaElement(true);
    await attachHls(withHlsJs, STREAM, false, "hls.js");
    expect(FakeHls.instances[0].loadSource).toHaveBeenCalledWith(STREAM);
    expect(FakeHls.instances[0].attachMedia).toHaveBeenCalledWith(withHlsJs);

    const natively = mediaElement(true);
    await attachHls(natively, STREAM, false, "native");
    expect(natively.src).toBe(STREAM);
    expect(FakeHls.instances).toHaveLength(1);
  });

  it("stops hls.js loading the stream when detached", async () => {
    const detach = await attachHls(mediaElement(), STREAM, false, "hls.js");
    detach();
    expect(FakeHls.instances[0].destroy).toHaveBeenCalled();
  });

  it("stops the browser loading the stream when detached", async () => {
    const media = mediaElement(true);
    const detach = await attachHls(media, STREAM, false, "native");
    detach();
    expect(media.removeAttribute).toHaveBeenCalledWith("src");
    expect(media.load).toHaveBeenCalled();
  });

  // The players tell the user it can't be played, and why, if it's that the
  // stream's server sends no CORS headers.
  it("reports when the stream can't be loaded, and whether CORS blocked it", async () => {
    const OTHER_SITE = "http://127.0.0.1:4444/stream.m3u8";
    const media = mediaElement();
    await attachHls(media, OTHER_SITE, false, "hls.js");
    FakeHls.instances[0].handlers[FakeHls.Events.ERROR]("hlsError", {
      fatal: true,
      type: "networkError",
      details: "manifestLoadError",
      response: { code: 0 },
    });
    const event = media.dispatchEvent.mock.calls[0][0];
    expect(event.type).toBe("error");
    expect(event.detail).toEqual({ blockedByCors: true });
  });

  it("doesn't report errors hls.js recovers from", async () => {
    const media = mediaElement();
    await attachHls(media, STREAM, false, "hls.js");
    FakeHls.instances[0].handlers[FakeHls.Events.ERROR]("hlsError", {
      fatal: false,
      type: "networkError",
      details: "fragLoadError",
    });
    expect(media.dispatchEvent).not.toHaveBeenCalled();
  });
});

describe("attachDash", () => {
  const STREAM = `${PAGE}/stream.mpd`;

  it("only fetches renditions the player is big enough to show", async () => {
    await attachDash(mediaElement(), STREAM);
    expect(player.setLimitBitrateByPortal).toHaveBeenCalledWith(true);
    // Once initialised: dash.js 2.x throws before then.
    expect(player.initialize.mock.invocationCallOrder[0]).toBeLessThan(
      player.setLimitBitrateByPortal.mock.invocationCallOrder[0]
    );
    // On high-density screens, by the pixels shown rather than the CSS size.
    expect(player.setUsePixelRatioInLimitBitrateByPortal).toHaveBeenCalledWith(
      true
    );
  });

  it("stops dash.js loading the stream when detached", async () => {
    const detach = await attachDash(mediaElement(), STREAM);
    detach();
    expect(player.reset).toHaveBeenCalled();
  });

  // dash.js 2.x reports every error the same way, fatal or not.
  const dashError = (error: object) =>
    player.on.mock.calls.find(([event]) => event === "error")[1](error);

  it("reports when the stream can't be played", async () => {
    const media = mediaElement();
    await attachDash(media, STREAM);
    dashError({ error: "download", event: { id: "manifest" } });
    dashError({ error: "mediasource", event: "Error creating source buffer." });
    dashError({ error: "capability", event: "mediasource" });
    dashError({ error: "manifestError", event: { id: "nostreams" } });
    expect(media.dispatchEvent).toHaveBeenCalledTimes(4);
    expect(media.dispatchEvent.mock.calls[0][0].type).toBe("error");
  });

  it("doesn't report errors dash.js plays on after", async () => {
    const media = mediaElement();
    await attachDash(media, STREAM);
    // A segment that couldn't be fetched, which dash.js skips or refetches.
    dashError({ error: "download", event: { id: "content" } });
    dashError({ error: "cc", event: { id: "parse" } });
    expect(media.dispatchEvent).not.toHaveBeenCalled();
  });
});
