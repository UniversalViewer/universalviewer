export class Events {
    static namespace: string = 'pdfExtension.';

    static PDF_LOADED: string                                   = Events.namespace + 'pdfLoaded';
    static PAGE_INDEX_CHANGED: string                           = Events.namespace + 'pageIndexChanged';
    static SEARCH: string                                       = Events.namespace + 'search';
}