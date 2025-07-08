import { Canvas, Range, Utils } from "manifesto.js";
import { MediaType } from "@iiif/vocabulary";

export class AVComponentUtils {
  private static _compare(a: any, b: any): string[] {
    const changed: string[] = [];
    Object.keys(a).forEach((p) => {
      if (!Object.is(b[p], a[p])) {
        changed.push(p);
      }
    });
    return changed;
  }

  public static diff(a: any, b: any) {
    return Array.from(
      new Set(
        AVComponentUtils._compare(a, b).concat(AVComponentUtils._compare(b, a))
      )
    );
  }

  public static getSpatialComponent(target: string): number[] | null {
    const spatial: RegExpExecArray | null = /xywh=([^&]+)/g.exec(target);
    let xywh: number[] | null = null;

    if (spatial && spatial[1]) {
      xywh = <any>spatial[1].split(",");
    }

    return xywh;
  }

  public static getFirstTargetedCanvasId(range: Range): string | undefined {
    let canvasId: string | undefined;

    if (range.canvases && range.canvases.length) {
      canvasId = range.canvases[0];
    } else {
      const childRanges: Range[] = range.getRanges();

      if (childRanges.length) {
        return AVComponentUtils.getFirstTargetedCanvasId(childRanges[0]);
      }
    }

    if (canvasId !== undefined) {
      return Utils.normaliseUrl(canvasId);
    }

    return undefined;
  }

  public static getTimestamp(): string {
    return String(new Date().valueOf());
  }

  public static retargetTemporalComponent(
    canvases: Canvas[],
    target: string
  ): string | undefined {
    let t: number[] | null = Utils.getTemporalComponent(target);

    if (t) {
      let offset: number = 0;
      let targetWithoutTemporal: string = target.substr(0, target.indexOf("#"));

      // loop through canvases adding up their durations until we reach the targeted canvas
      for (let i = 0; i < canvases.length; i++) {
        const canvas: Canvas = canvases[i];
        if (!canvas.id.includes(targetWithoutTemporal)) {
          const duration: number | null = canvas.getDuration();
          if (duration) {
            offset += duration;
          }
        } else {
          // we've reached the canvas whose target we're adjusting
          break;
        }
      }

      t[0] = Number(t[0]) + offset;
      t[1] = Number(t[1]) + offset;

      return targetWithoutTemporal + "#t=" + t[0] + "," + t[1];
    }

    return undefined;
  }

  public static formatTime(aNumber: number): string {
    let hours: number | string,
      minutes: number | string,
      seconds: number | string,
      hourValue: string;

    seconds = Math.ceil(aNumber);
    hours = Math.floor(seconds / (60 * 60));
    hours = hours >= 10 ? hours : "0" + hours;
    minutes = Math.floor((seconds % (60 * 60)) / 60);
    minutes = minutes >= 10 ? minutes : "0" + minutes;
    seconds = Math.floor((seconds % (60 * 60)) % 60);
    seconds = seconds >= 10 ? seconds : "0" + seconds;

    if (hours >= 1) {
      hourValue = hours + ":";
    } else {
      hourValue = "";
    }

    return hourValue + minutes + ":" + seconds;
  }

  public static isIE(): number | boolean {
    const ua = window.navigator.userAgent;

    // Test values; Uncomment to check result …

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    const msie = ua.indexOf("MSIE ");
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
    }

    const trident = ua.indexOf("Trident/");
    if (trident > 0) {
      // IE 11 => return version number
      const rv = ua.indexOf("rv:");
      return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
    }

    const edge = ua.indexOf("Edge/");
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
    }

    // other browser
    return false;
  }

  public static isSafari() {
    // https://stackoverflow.com/questions/7944460/detect-safari-browser?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  public static debounce(fn: any, debounceDuration: number): any {
    // summary:
    //      Returns a debounced function that will make sure the given
    //      function is not triggered too much.
    // fn: Function
    //      Function to debounce.
    // debounceDuration: Number
    //      OPTIONAL. The amount of time in milliseconds for which we
    //      will debounce the function. (defaults to 100ms)
    debounceDuration = debounceDuration || 100;

    return function () {
      if (!fn.debouncing) {
        const args: any = Array.prototype.slice.apply(arguments);
        fn.lastReturnVal = fn.apply(window, args);
        fn.debouncing = true;
      }
      clearTimeout(fn.debounceTimeout);
      fn.debounceTimeout = setTimeout(function () {
        fn.debouncing = false;
      }, debounceDuration);

      return fn.lastReturnVal;
    };
  }

  public static hlsMimeTypes = [
    // Apple santioned
    "application/vnd.apple.mpegurl",
    "vnd.apple.mpegurl",
    // Apple sanctioned for backwards compatibility
    "audio/mpegurl",
    // Very common
    "audio/x-mpegurl",
    // Very common
    "application/x-mpegurl",
    // Included for completeness
    "video/x-mpegurl",
    "video/mpegurl",
    "application/mpegurl",
  ];

  public static normalise(num: number, min: number, max: number): number {
    return (num - min) / (max - min);
  }

  public static isHLSFormat(format: MediaType) {
    return this.hlsMimeTypes.includes(format.toString());
  }

  public static isMpegDashFormat(format: MediaType) {
    return format.toString() === "application/dash+xml";
  }

  public static canPlayHls() {
    const doc = typeof document === "object" && document,
      videoelem = doc && doc.createElement("video"),
      isvideosupport = Boolean(videoelem && videoelem.canPlayType);

    return (
      isvideosupport &&
      this.hlsMimeTypes.some(function (canItPlay) {
        return /maybe|probably/i.test((<any>videoelem).canPlayType(canItPlay));
      })
    );
  }
}
