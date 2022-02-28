export class PDFExtensionEvents {
  static namespace: string = "pdfExtension.";

  static PDF_LOADED: string = PDFExtensionEvents.namespace + "pdfLoaded";
  static PAGE_INDEX_CHANGE: string =
    PDFExtensionEvents.namespace + "pageIndexChange";
  static SEARCH: string = PDFExtensionEvents.namespace + "search";
}
