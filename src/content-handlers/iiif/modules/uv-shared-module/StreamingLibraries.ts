import { getHls } from "../iiif-av-component-module/helpers/get-hls";

// hls.js and dash.js play HLS and MPEG-DASH in browsers without native support
// for them. Each is loaded only when it's needed, from UV's own files (never a
// CDN), as the global the players use (window.Hls, window.dashjs), unless the
// page has provided its own.

export const loadHls = async (): Promise<any> => {
  if (!getHls()) {
    const { default: Hls } = await import(
      /* webpackChunkName: "hls" */ "hls.js"
    );
    (window as any).Hls = Hls;
  }
  return getHls();
};

export const loadDash = async (): Promise<any> => {
  if (typeof (window as any).dashjs === "undefined") {
    await import(
      /* webpackChunkName: "dashjs" */ "dashjs/dist/dash.mediaplayer.min"
    );
  }
  return (window as any).dashjs;
};

// Tells the players that a stream can't be played (e.g. a playlist that
// can't be loaded), as the media element's own error event would: hls.js and
// dash.js report their failures themselves, not through the media element.
// The players then tell the user, unless configured not to (hideMediaError).
const reportStreamError = (media: HTMLMediaElement): void => {
  media.dispatchEvent(new Event("error"));
};

// Plays an HLS stream in a media element: natively where the browser can
// (e.g. Safari) and the page hasn't provided a working hls.js, otherwise with
// hls.js. withCredentials sends cookies with its requests (for adaptive
// auth).
export const attachHls = async (
  media: HTMLMediaElement,
  source: string,
  withCredentials = false
): Promise<void> => {
  const provided = getHls();
  if (
    !(provided && provided.isSupported()) &&
    media.canPlayType("application/vnd.apple.mpegurl")
  ) {
    media.src = source;
    return;
  }
  const Hls = await loadHls();
  const hls = new Hls(
    withCredentials
      ? {
          xhrSetup: (xhr: XMLHttpRequest) => {
            xhr.withCredentials = true;
          },
        }
      : {}
  );
  hls.on(Hls.Events.ERROR, (_event: string, data: { fatal: boolean }) => {
    if (data.fatal) {
      reportStreamError(media);
    }
  });
  hls.loadSource(source);
  hls.attachMedia(media);
};

// Plays an MPEG-DASH stream in a media element, with dash.js.
// withCredentials sends cookies with its manifest requests (for adaptive
// auth).
export const attachDash = async (
  media: HTMLMediaElement,
  source: string,
  withCredentials = false
): Promise<void> => {
  const dashjs = await loadDash();
  const player = dashjs.MediaPlayer().create();
  player.getDebug().setLogToBrowserConsole(false);
  player.on(dashjs.MediaPlayer.events.ERROR, () => reportStreamError(media));
  if (withCredentials) {
    player.setXHRWithCredentialsForType("MPD", true);
  }
  player.initialize(media, source, false);
};
