// had to copy this from lib.es2016.array.include.d.ts as no combination of compiler options would work :-(
interface Array<T> {
  /**
   * Determines whether an array includes a certain element, returning true or false as appropriate.
   * @param searchElement The element to search for.
   * @param fromIndex The position in this array at which to begin searching for searchElement.
   */
  includes(searchElement: T, fromIndex?: number): boolean;
}

interface Window {
  MediaSource: any;
  WebKitMediaSource: any;
  jQuery: any;
}

declare let dashjs: any;
declare let Hls: any;
declare let WaveformData: any;
declare let jQuery: any;
