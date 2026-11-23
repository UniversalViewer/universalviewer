interface Document {
  mozFullScreen: boolean;
  msFullscreenElement: any;
  webkitExitFullscreen: any;
  msExitFullscreen: any;
  mozCancelFullScreen: any;
  webkitIsFullScreen: any;
}

interface Element {
  scrollIntoViewIfNeeded: any;
}

interface HTMLElement {
  ontouchstart: any;
}

// jQuery plugin methods added in src/content-handlers/iiif/JQueryPlugins.ts,
// plus loosened core-method types this codebase relies on. Previously this
// interface lived inside JQueryPlugins.ts where, being module-scoped, it never
// applied globally — the app instead type-checked against the loose jQuery 2
// typings that @iiif/iiif-av-component (since vendored) pulled in transitively.

interface JQuery<TElement = HTMLElement> {
  attr(...args: any[]): any;
  css(...args: any[]): any;
  append(...args: any[]): any;
  text(...args: any[]): any;
  toggle(...args: any[]): any;
  html(...args: any[]): any;
  empty(...args: any[]): any;
  one(...args: any[]): any;
  remove(...args: any[]): any;
  height(...args: any[]): any;
  contents(...args: any[]): any;
  outerWidth(...args: any[]): any;
  outerHeight(...args: any[]): any;
  offset(...args: any[]): any;
  mousemove(...args: any[]): any;
  find(...args: any[]): any;
  data(...args: any[]): any;
  addClass(...args: any[]): any;
  removeClass(...args: any[]): any;
  width(...args: any[]): any;
  removeAttr(...args: any[]): any;
  prop(...args: any[]): any;
  is(...args: any[]): any;
  val(...args: any[]): any;
  on(...args: any[]): any;
  delegate(...args: any[]): any;
  scrollTop(...args: any[]): any;
  link(...args: any[]): any; // jsviews
  checkboxButton(onClicked: (checked: boolean) => void): void;
  disable(): void;
  ellipsis(chars: number): string;
  ellipsisFill(text?: string): any;
  ellipsisFixed(chars: number, buttonText: string): any;
  ellipsisHtmlFixed(chars: number, callback: () => void): any;
  enable(): void;
  equaliseHeight(reset?: boolean, average?: boolean): any;
  getVisibleElementWithGreatestTabIndex(): any;
  horizontalMargins(): number;
  horizontalPadding(): number;
  ismouseover(): boolean;
  leftMargin(): number;
  leftPadding(): number;
  on(
    events: string,
    handler: (eventObject: JQueryEventObject, ...args: any[]) => any,
    wait: Number
  ): JQuery;
  onEnter(callback: () => void): any;
  onPressed(callback: (e: any) => void): any;
  removeLastWord(chars?: number, depth?: number): any;
  rightMargin(): number;
  rightPadding(): number;
  switchClass(class1: string, class2: string): any;
  targetBlank(): void;
  toggleExpandText(
    chars: number,
    lessText: string,
    moreText: string,
    cb: () => void
  ): any;
  toggleExpandTextByLines(
    lines: number,
    lessText: string,
    moreText: string,
    cb: () => void
  ): any;
  toggleText(text1: string, text2: string): any;
  updateAttr(attrName: string, oldVal: string, newVal: string): void;
  verticalMargins(): number;
  verticalPadding(): number;
}

interface JQueryStatic {
  // pubsub
  publish(event: string, eventObj?: any[]): void;
  subscribe(event: string, handler: Function): void;
  unsubscribe(event: string): void;
  initPubSub(): void;
  disposePubSub(): void;

  //cookie(name: string);

  // jsviews
  observable: any;
  templates: any;
  views: any;
  view: any;

  // detect mobile browser
  browser: any;
}

// libs
declare var easyXDM: any;
declare var OpenSeadragon: any;
declare var MediaElementPlayer: any;
declare var yepnope: any;
declare var PDFJS: any;
declare var filterXSS: (html: string, config: any) => string;
declare var WEBVR: any;

// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/35946
declare var define: any;
declare var requirejs: any;

// app
interface Window {
  configExtensionCallback: any;
  browserDetect: any;
  trackEvent(
    category: string,
    action: string,
    label: string,
    value?: any
  ): void;
  trackVariable(slot: number, name: string, value: string, scope: number): void;
  trackingLabel: string;
  $: JQueryStatic;
  jQuery: JQueryStatic;
  webViewerLoad: any; // pdfjs
  openSeadragonViewer: any; // for testing convenience (make this generic)
  PDFObject: any;
  AMI: any;
  UVURLDataProvider: any;
  THREE: any;
  Event: any;
  CustomEvent: any;
  Hls: any;
  MediaSource: any;
  WebKitMediaSource: any;
  WaveformData: any;
  opera: any;
}

// had to copy this from lib.es2016.array.include.d.ts as no combination of compiler options would work :-(
interface Array<T> {
  /**
   * Determines whether an array includes a certain element, returning true or false as appropriate.
   * @param searchElement The element to search for.
   * @param fromIndex The position in this array at which to begin searching for searchElement.
   */
  includes(searchElement: T, fromIndex?: number): boolean;
}

// google
declare function trackEvent(
  category: string,
  action: string,
  label: string,
  value?: any
): void;

declare var YT: any;

interface Window {
  onYouTubeIframeAPIReady: any;
  youTubePlayers: any[];
  currentYouTubePlayer: any;
  //youTubeData: any; // has to be any, otherwise typescript complains
}
