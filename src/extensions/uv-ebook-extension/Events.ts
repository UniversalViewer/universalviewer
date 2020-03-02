export class Events {
    static namespace: string = "ebookExtension.";

    static CFI_FRAGMENT_CHANGED: string               = Events.namespace + "cfiFragmentChanged";
    static ITEM_CLICKED: string                       = Events.namespace + "itemClicked";
    static LOADED_NAVIGATION: string                  = Events.namespace + "loadedNavigation";
    static RELOCATED: string                          = Events.namespace + "relocated";
    static RENDITION_ATTACHED: string                 = Events.namespace + "renditionAttached";
    static TOC_READY: string                          = Events.namespace + "tocReady";
}