import BootstrapParams = require("../../BootstrapParams");
import BootStrapper = require("../../Bootstrapper");
import CanvasType = require("./CanvasType");
import RenderingFormat = require("./RenderingFormat");
import Resource = require("./Resource");
import ServiceProfile = require("./ServiceProfile");
import Thumb = require("./Thumb");
import TreeNode = require("./TreeNode");

// the provider contains all methods related to
// interacting with the IIIF data model.
interface IProvider{
    canvasIndex: number;
    manifest: any;
    sequence: any;
    sequenceIndex: number;
    treeRoot: TreeNode;

    addTimestamp(uri: string): string;
    getAttribution(): string;
    getLicense(): string;
    getLogo(): string;
    getCanvasByIndex(index): any;
    getCanvasIndexByLabel(label: string): number;
    getCanvasIndexById(id: string): number;
    getCanvasStructure(canvas: any): any;
    getCanvasType(canvas?: any): string;
    getCurrentCanvas(): any;
    getLocalisedValue(property: any): string;
    getManifestSeeAlsoUri(manifest: any): string;
    getManifestType(): string;
    getMetaData(callback: (data: any) => any): void;
    getRendering(resource: any, format: RenderingFormat): any
    getRenderings(element: any): any[];
    getSeeAlso(): any;
    getSequenceType(): string;
    getService(resource: any, profile: ServiceProfile): any;
    getStructureByPath(path: string): any;
    getThumbs(width: number, height: number): Thumb[];
    getThumbUri(canvas: any, width: number, height: number): string;
    getTitle(): string;
    getTotalCanvases(): number;
    getTree(): TreeNode;
    getPagedIndices(canvasIndex?: number): number[];
    getFirstPageIndex(): number;
    getLastPageIndex(): number;
    getPrevPageIndex(canvasIndex?: number): number;
    getNextPageIndex(canvasIndex?: number): number;
    getStartCanvasIndex(): number;
    getViewingDirection(): string;
    isCanvasIndexOutOfRange(canvasIndex: number): boolean;
    isFirstCanvas(canvasIndex?: number): boolean;
    isLastCanvas(canvasIndex?: number): boolean;
    isPagingEnabled(): boolean;
    isPagingSettingEnabled(): boolean;
    isMultiCanvas(): boolean;
    isMultiSequence(): boolean;
    isSeeAlsoEnabled(): boolean;
    isTotalCanvasesEven(): boolean;
    load(): void;
    loadResource(resource: Resource, loginMethod: (loginService: string) => Promise<void>): Promise<Resource>;
    loadResources(resources: Resource[], loginMethod: (loginService: string) => Promise<void>): Promise<Resource[]>;
    parseManifest(): void;
    parseStructure(): void;
    sanitize(html: string): string;

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
    serializeLocales(locales: any[]): string;
    updateSettings(settings: ISettings): void;
}

export = IProvider;