export class EbookExtensionEvents {
  static namespace: string = "ebookExtension.";

  static CFI_FRAGMENT_CHANGE: string =
    EbookExtensionEvents.namespace + "cfiFragmentChange";
  static ITEM_CLICKED: string = EbookExtensionEvents.namespace + "itemClicked";
  static LOADED_NAVIGATION: string =
    EbookExtensionEvents.namespace + "loadedNavigation";
  static RELOCATED: string = EbookExtensionEvents.namespace + "relocated";
  static RENDITION_ATTACHED: string =
    EbookExtensionEvents.namespace + "renditionAttached";
  static TOC_READY: string = EbookExtensionEvents.namespace + "tocReady";
}
