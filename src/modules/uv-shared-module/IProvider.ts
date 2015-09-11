import BootstrapParams = require("../../BootstrapParams");
import BootStrapper = require("../../Bootstrapper");
import ExternalResource = require("./ExternalResource");

// the provider contains all methods related to
// interacting with the IIIF data model.
interface IProvider{
    canvasIndex: number;
    collectionIndex: number;
    iiifResource: Manifesto.IIIIFResource;
    manifest: Manifesto.IIIIFResource;
    manifestIndex: number;
    resources: Manifesto.IExternalResource[];
    sequenceIndex: number;

    addTimestamp(uri: string): string;
    getAttribution(): string;
    getCanvasByIndex(index: number): any;
    getCanvasIndexById(id: string): number;
    getCanvasIndexByLabel(label: string): number;
    getCanvasIndexParam(): number;
    getCanvasType(canvas?: Manifesto.ICanvas): Manifesto.CanvasType;
    getCollectionIndex(iiifResource: Manifesto.IIIIFResource): number;
    getCurrentCanvas(): Manifesto.ICanvas;
    getCurrentSequence(): Manifesto.ISequence;
    getFirstPageIndex(): number;
    getInfoUri(canvas: Manifesto.ICanvas): string;
    getLastCanvasLabel(): string;
    getLastPageIndex(): number;
    getLicense(): string;
    getLogo(): string;
    getManifestType(): Manifesto.ManifestType;
    getMetadata(): any;
    getNextPageIndex(index?: number): number;
    getPagedIndices(index?: number): number[];
    getPrevPageIndex(index?: number): number;
    getRangeByPath(path: string): Manifesto.IRange;
    getSeeAlso(): any;
    getSequenceIndexParam(): number;
    getStartCanvasIndex(): number;
    getThumbs(width: number, height: number): Manifesto.Thumb[];
    getTitle(): string;
    getTotalCanvases(): number;
    getTree(): Manifesto.TreeNode;
    getViewingDirection(): Manifesto.ViewingDirection;
    isCanvasIndexOutOfRange(index: number): boolean;
    isFirstCanvas(index?: number): boolean;
    isLastCanvas(index?: number): boolean;
    isMultiCanvas(): boolean;
    isMultiSequence(): boolean;
    isPagingAvailable(): boolean;
    isPagingEnabled(): boolean;
    isPagingSettingEnabled(): boolean;
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
    getLocales(): any;
    getSerializedLocales(): string;
    getSettings(): ISettings;
    isDeepLinkingEnabled(): boolean;
    reload(params?: BootstrapParams);
    sanitize(html: string): string;
    serializeLocales(locales: any[]): string;
    updateSettings(settings: ISettings): void;
}

export = IProvider;