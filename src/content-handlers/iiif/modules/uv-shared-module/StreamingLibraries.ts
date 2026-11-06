import { getHls } from "../iiif-av-component-module/helpers/get-hls";
import { hlsMimeTypes } from "../iiif-av-component-module/helpers/hls-media-types";
import { isSafari } from "../iiif-av-component-module/helpers/is-safari";
import {
  HlsErrorData,
  hlsWays,
  isBlockedByCors,
  MediaSupport,
  MediaVia,
} from "../iiif-av-component-module/helpers/media-attempts";

// hls.js and dash.js play HLS and MPEG-DASH in browsers without native support
// for them. Each is loaded only when it's needed, from UV's own files (never a
// CDN), as the global the players use (window.Hls, window.dashjs), unless the
// page has provided its own.

// Whether window.Hls is UV's own, rather than the page's.
let uvLoadedHls = false;

export const loadHls = async (): Promise<any> => {
  if (!getHls()) {
    const { default: Hls } = await import(
      /* webpackChunkName: "hls" */ "hls.js"
    );
    (window as any).Hls = Hls;
    uvLoadedHls = true;
  }
  return getHls();
};

// What the browser can do with streams (see mediaAttempts): play HLS itself
// (e.g. Chrome, Safari), or with hls.js (with Media Source Extensions able to
// play MP4, as hls.js's own isSupported() checks), or with an hls.js the page
// has provided, and whether it's Safari.
export const mediaSupport = (): MediaSupport => {
  const video = document.createElement("video");
  const Hls = getHls();
  const MediaSource = (window as any).ManagedMediaSource || window.MediaSource;
  return {
    nativeHls: hlsMimeTypes.some((type: string) =>
      /maybe|probably/i.test(video.canPlayType(type))
    ),
    hlsJs: Hls
      ? Hls.isSupported()
      : !!MediaSource &&
        MediaSource.isTypeSupported(
          'video/mp4; codecs="avc1.42E01E,mp4a.40.2"'
        ),
    pageHlsJs: !!Hls && !uvLoadedHls && Hls.isSupported(),
    safari: isSafari(),
  };
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
// The players then try the next version of the media, or tell the user,
// unless configured not to (hideMediaError). blockedByCors says whether it
// was that the stream's server sends no CORS headers.
const reportStreamError = (
  media: HTMLMediaElement,
  blockedByCors = false
): void => {
  media.dispatchEvent(new CustomEvent("error", { detail: { blockedByCors } }));
};

// Stops a stream loading in a media element, so the element can play another
// version of the media, or be let go of.
export type Detach = () => void;

// Plays an HLS stream in a media element: with the browser's own HLS player
// ("native") or hls.js, as asked; by default the first way hlsWays gives.
// hls.js only fetches renditions the player is big enough to show.
// withCredentials sends cookies with its requests (for adaptive auth).
export const attachHls = async (
  media: HTMLMediaElement,
  source: string,
  withCredentials = false,
  via?: "native" | "hls.js"
): Promise<Detach> => {
  const way = via || hlsWays(mediaSupport())[0] || "hls.js";
  if (way === "native") {
    media.src = source;
    return () => {
      media.removeAttribute("src");
      media.load();
    };
  }
  const Hls = await loadHls();
  const hls = new Hls({
    capLevelToPlayerSize: true,
    ...(withCredentials
      ? {
          xhrSetup: (xhr: XMLHttpRequest) => {
            xhr.withCredentials = true;
          },
        }
      : {}),
  });
  hls.on(Hls.Events.ERROR, (_event: string, data: HlsErrorData) => {
    if (data.fatal) {
      reportStreamError(
        media,
        isBlockedByCors(data, source, window.location.href)
      );
    }
  });
  hls.loadSource(source);
  hls.attachMedia(media);
  return () => hls.destroy();
};

// dash.js 2.x's error event, which it fires for every error, fatal or not.
interface DashErrorData {
  error: string;
  event?: { id?: string } | string;
}

// Whether dash.js can't play the stream at all: its manifest can't be
// fetched or used, or the browser can't play it. Not, say, a segment that
// couldn't be fetched (as when dash.js aborts one to switch rendition), which
// it plays on after.
const isFatalDashError = ({ error, event }: DashErrorData): boolean =>
  error === "capability" ||
  error === "mediasource" ||
  error === "manifestError" ||
  (error === "download" &&
    typeof event === "object" &&
    event.id === "manifest");

// Plays an MPEG-DASH stream in a media element, with dash.js, which only
// fetches renditions the player is big enough to show (by the screen's
// pixels, on high-density screens). withCredentials sends cookies with its
// manifest requests (for adaptive auth).
export const attachDash = async (
  media: HTMLMediaElement,
  source: string,
  withCredentials = false
): Promise<Detach> => {
  const dashjs = await loadDash();
  const player = dashjs.MediaPlayer().create();
  player.getDebug().setLogToBrowserConsole(false);
  player.on(dashjs.MediaPlayer.events.ERROR, (data: DashErrorData) => {
    if (isFatalDashError(data)) {
      reportStreamError(media);
    }
  });
  if (withCredentials) {
    player.setXHRWithCredentialsForType("MPD", true);
  }
  player.initialize(media, source, false);
  // Once initialised: dash.js 2.x makes the part these set as it does.
  player.setLimitBitrateByPortal(true);
  player.setUsePixelRatioInLimitBitrateByPortal(true);
  return () => player.reset();
};

// A version of the media, and how it's played (see mediaAttempts).
export interface MediaVersion {
  source: string;
  via: MediaVia;
}

// Plays one version of the media in a media element.
const attachVersion = (
  media: HTMLMediaElement,
  { source, via }: MediaVersion,
  withCredentials: boolean
): Promise<Detach> => {
  if (via === "native" || via === "hls.js") {
    return attachHls(media, source, withCredentials, via);
  }
  if (via === "dash") {
    return attachDash(media, source, withCredentials);
  }
  media.src = source;
  return Promise.resolve(() => {
    media.removeAttribute("src");
    media.load();
  });
};

// Plays the versions of the media in a media element, in turn: when one
// can't be played (the element, or hls.js or dash.js, reports an error), the
// next is tried in the same element, so its listeners and place in the
// player are kept, and it carries on playing if it was asked to. Only when
// none can be played is `onUnplayable` called, with whether the last failed
// because its server sends no CORS headers. Returns a detach that stops
// whichever is loading, for when the element is let go of.
export const playVersionsInTurn = (
  media: HTMLMediaElement,
  versions: MediaVersion[],
  withCredentials: boolean,
  onUnplayable: (blockedByCors: boolean) => void
): Detach => {
  let index = -1;
  let detach: Detach | null = null;
  let playRequested = false;
  let stopped = false;

  const next = async (): Promise<void> => {
    if (detach) {
      detach();
      detach = null;
    }
    index++;
    if (stopped || index >= versions.length) {
      return;
    }
    detach = await attachVersion(media, versions[index], withCredentials);
    if (playRequested) {
      media.play().catch(() => undefined);
    }
  };

  media.addEventListener("play", () => (playRequested = true));
  media.addEventListener("pause", () => {
    // Paused by the user or the player, not by a version failing.
    if (!media.error) {
      playRequested = false;
    }
  });
  media.addEventListener("error", (event: Event) => {
    const streamError = event instanceof CustomEvent;
    // Errors from the element itself once its source has gone (as when a
    // version is detached) aren't the current version failing.
    if (stopped || (!streamError && (!media.error || !media.currentSrc))) {
      return;
    }
    if (index + 1 < versions.length) {
      next();
      return;
    }
    stopped = true;
    onUnplayable(streamError && !!(event as CustomEvent).detail?.blockedByCors);
  });

  if (!versions.length) {
    setTimeout(() => onUnplayable(false), 0);
  } else {
    next();
  }

  return () => {
    stopped = true;
    if (detach) {
      detach();
      detach = null;
    }
  };
};
