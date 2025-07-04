export class Events {
  static CONFIGURE: string = "configure";
  static CREATED: string = "created";
  static DROP: string = "drop";
  static ERROR: string = "error";
  static EXIT_FULLSCREEN: string = "exitFullScreen";
  static EXTERNAL_RESOURCE_OPENED: string = "externalResourceOpened";
  static LOAD: string = "load";
  static LOAD_FAILED: string = "loadFailed";
  static RELOAD: string = "reload";
  static RESIZE: string = "resize";
  static TOGGLE_FULLSCREEN: string = "toggleFullScreen";
  static SEARCH_HIT_CHANGED: string = "searchHitChanged"; // added this to be able to act upon changes to the selected search hit
}
