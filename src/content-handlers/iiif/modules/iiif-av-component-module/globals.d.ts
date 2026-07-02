// Vendored from https://github.com/IIIF-Commons/iiif-av-component (v1.2.4).
// The original globals.d.ts also declared Window.MediaSource,
// Window.WebKitMediaSource, Window.jQuery and Array.includes — those are
// already declared in src/globals.d.ts, so only the bare globals the
// component references are declared here.

declare let dashjs: any;
declare let Hls: any;
declare let WaveformData: any;
declare let jQuery: any;

// jQuery UI plugin methods used by the component (loaded via
// require('jquery-ui-dist/jquery-ui') in components/av-component.ts).
// Declared here rather than via @types/jqueryui, whose non-generic JQuery
// interface declaration conflicts with @types/jquery v3. switchClass is
// already declared globally in src/globals.d.ts.

interface JQuery<TElement = HTMLElement> {
  slider(...args: any[]): any;
}
