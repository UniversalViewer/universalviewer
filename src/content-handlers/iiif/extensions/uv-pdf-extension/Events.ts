export class PDFExtensionEvents {
  static namespace: string = "pdfExtension.";

  static PDF_LOADED: string = PDFExtensionEvents.namespace + "pdfLoaded";
  static PAGE_INDEX_CHANGE: string =
    PDFExtensionEvents.namespace + "pageIndexChange";
  static SEARCH: string = PDFExtensionEvents.namespace + "search";
  static ZOOM_IN: string = PDFExtensionEvents.namespace + "zoomIn";
  static ZOOM_OUT: string = PDFExtensionEvents.namespace + "zoomOut";
}
