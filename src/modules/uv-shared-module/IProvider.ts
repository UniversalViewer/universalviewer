import BootstrapParams = require("../../BootstrapParams");
import BootStrapper = require("../../Bootstrapper");
import CanvasType = require("./CanvasType");
import Resource = require("./Resource");

// the provider contains all methods related to
// interacting with the IIIF data model.
interface IProvider{
    canvasIndex: number;
    manifest: Manifesto.IManifest;
    sequence: any;
    sequenceIndex: number;

    addTimestamp(uri: string): string;
    getAttribution(): string;
    getLicense(): string;
    getLogo(): string;
    getCanvasByIndex(index: number): any;
    getCanvasIndexByLabel(label: string): number;
    getCanvasIndexById(id: string): number;
    getCanvasType(canvas?: Manifesto.ICanvas): Manifesto.CanvasType;
    getCurrentCanvas(): any;
    getLocalisedValue(resource: any): string;
    getManifestType(): string;
    getMetadata(includeRootProperties?: boolean): any;
    getRendering(resource: any, format: Manifesto.RenderingFormat): Manifesto.IRendering;
    getRenderings(element: any): Manifesto.IRendering[];
    getSeeAlso(): any;
    getSequenceType(): string;
    getService(resource: any, profile: Manifesto.ServiceProfile): Manifesto.IService;
    getRangeByPath(path: string): Manifesto.IRange;
    getThumbs(width: number, height: number): Manifesto.Thumb[];
    getThumbUri(canvas: any, width: number, height: number): string;
    getTitle(): string;
    getTotalCanvases(): number;
    getTree(): Manifesto.TreeNode;
    getPagedIndices(index?: number): number[];
    getFirstPageIndex(): number;
    getLastPageIndex(): number;
    getPrevPageIndex(index?: number): number;
    getNextPageIndex(index?: number): number;
    getStartCanvasIndex(): number;
    getViewingDirection(): Manifesto.ViewingDirection;
    isCanvasIndexOutOfRange(index: number): boolean;
    isFirstCanvas(index?: number): boolean;
    isLastCanvas(index?: number): boolean;
    isPagingEnabled(): boolean;
    isPagingSettingEnabled(): boolean;
    isMultiCanvas(): boolean;
    isMultiSequence(): boolean;
    isSeeAlsoEnabled(): boolean;
    isTotalCanvasesEven(): boolean;
    load(): void;
    loadResource(resource: Resource, loginMethod: (loginService: string) => Promise<void>): Promise<Resource>;
    loadResources(resources: Resource[], loginMethod: (loginService: string) => Promise<void>): Promise<Resource[]>;

    // todo: move these to extension
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
    paramMap: string[];
    reload(params?: BootstrapParams);
    sanitize(html: string): string;
    serializeLocales(locales: any[]): string;
    updateSettings(settings: ISettings): void;
}

export = IProvider;