import BootstrapParams = require("../../BootstrapParams");
import BootStrapper = require("../../Bootstrapper");
import ExternalResource = require("./ExternalResource");
import IMetadataItem = require("./IMetadataItem");
import IRange = require("./IRange");

// the provider contains all methods related to
// interacting with the IIIF data model.
interface IProvider{
    canvasIndex: number;
    collectionIndex: number;
    iiifResource: Manifesto.IIIIFResource;
    manifest: Manifesto.IIIIFResource;
    manifestIndex: number;
    manifestUri: string;
    resources: Manifesto.IExternalResource[];
    sequenceIndex: number;

    addTimestamp(uri: string): string;
    getAttribution(): string;
    getCanvases(): Manifesto.ICanvas[];
    getCanvasById(id: string): Manifesto.ICanvas;
    getCanvasesById(ids: string[]): Manifesto.ICanvas[];
    getCanvasByIndex(index: number): any;
    getCanvasIndexById(id: string): number;
    getCanvasIndexByLabel(label: string): number;
    getCanvasIndexParam(): number;
    getCanvasRange(canvas: Manifesto.ICanvas): Manifesto.IRange;
    getCanvasRanges(canvas: Manifesto.ICanvas): Manifesto.IRange[];
    getCanvasType(canvas?: Manifesto.ICanvas): Manifesto.CanvasType;
    getCollectionIndex(iiifResource: Manifesto.IIIIFResource): number;
    getCurrentCanvas(): Manifesto.ICanvas;
    getCurrentSequence(): Manifesto.ISequence;
    getFirstPageIndex(): number;
    getInfoUri(canvas: Manifesto.ICanvas): string;
    getLastCanvasLabel(alphanumeric?: boolean): string;
    getLastPageIndex(): number;
    getLicense(): string;
    getLogo(): string;
    getManifestType(): Manifesto.ManifestType;
    getMetadata(): IMetadataItem[];
    getPagedIndices(index?: number): number[]; // todo: rename to something generic
    getRanges(): IRange[];
    getCanvasMetadata(canvas: Manifesto.ICanvas): IMetadataItem[];
    getRangeByPath(path: string): Manifesto.IRange;
    getRangeCanvases(range: Manifesto.IRange): Manifesto.ICanvas[];
    getSeeAlso(): any;
    getSequenceIndexParam(): number;
    getStartCanvasIndex(): number;
    getShareUrl(): string;
    getThumbs(width: number, height: number): Manifesto.IThumb[];
    getTitle(): string;
    getTotalCanvases(): number;
    getTree(): Manifesto.ITreeNode;
    getViewingDirection(): Manifesto.ViewingDirection;
    getViewingHint(): Manifesto.ViewingHint;
    isCanvasIndexOutOfRange(index: number): boolean;
    isFirstCanvas(index?: number): boolean;
    isLastCanvas(index?: number): boolean;
    isMultiCanvas(): boolean;
    isMultiSequence(): boolean;
    isSeeAlsoEnabled(): boolean;
    isTotalCanvasesEven(): boolean;

    // todo: move these to baseextension?
    bootstrapper: BootStrapper;
    config: any;
    domain: string;
    embedDomain: string;
    isHomeDomain: boolean;
    isLightbox: boolean;
    isOnlyInstance: boolean;
    isReload: boolean;
    jsonp: boolean;
    locale: string;
    locales: any[];

    changeLocale(locale: string): void;
    defaultToThumbsView(): boolean;
    getAlternateLocale(): any;
    getDomain(): string;
    getEmbedDomain(): string;
    getLocales(): any[];
    getSerializedLocales(): string;
    getSettings(): ISettings;
    isDeepLinkingEnabled(): boolean;
    reload(params?: BootstrapParams);
    sanitize(html: string): string;
    serializeLocales(locales: any[]): string;
    updateSettings(settings: ISettings): void;
}

export = IProvider;