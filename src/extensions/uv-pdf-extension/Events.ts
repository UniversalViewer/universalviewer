export class Events {
  static namespace: string = "pdfExtension.";

  static PDF_LOADED: string = Events.namespace + "pdfLoaded";
  static PAGE_INDEX_CHANGE: string = Events.namespace + "pageIndexChange";
  static SEARCH: string = Events.namespace + "search";
}
