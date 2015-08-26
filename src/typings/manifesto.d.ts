declare module Manifesto {
    class StringValue {
        value: string;
        constructor(value?: string);
        toString(): string;
    }
}
declare module Manifesto {
    class CanvasType extends StringValue {
        static CANVAS: CanvasType;
        canvas(): CanvasType;
    }
}
declare module Manifesto {
    class ElementType extends StringValue {
        static DOCUMENT: ElementType;
        static MOVINGIMAGE: ElementType;
        static SOUND: ElementType;
        document(): ElementType;
        movingimage(): ElementType;
        sound(): ElementType;
    }
}
declare module Manifesto {
    class IIIFResourceType extends StringValue {
        static MANIFEST: IIIFResourceType;
        static COLLECTION: IIIFResourceType;
        manifest(): IIIFResourceType;
        collection(): IIIFResourceType;
    }
}
declare module Manifesto {
    class ManifestType extends StringValue {
        static EMPTY: ManifestType;
        static MANUSCRIPT: ManifestType;
        static MONOGRAPH: ManifestType;
        empty(): ManifestType;
        manuscript(): ManifestType;
        monograph(): ManifestType;
    }
}
declare module Manifesto {
    class RenderingFormat extends StringValue {
        static PDF: RenderingFormat;
        static DOC: RenderingFormat;
        static DOCX: RenderingFormat;
        pdf(): RenderingFormat;
        doc(): RenderingFormat;
        docx(): RenderingFormat;
    }
}
declare module Manifesto {
    class ServiceProfile extends StringValue {
        static AUTOCOMPLETE: ServiceProfile;
        static CLICKTHROUGH: ServiceProfile;
        static IIIFIMAGELEVEL1: ServiceProfile;
        static IIIFIMAGELEVEL2: ServiceProfile;
        static IXIF: ServiceProfile;
        static LOGIN: ServiceProfile;
        static LOGOUT: ServiceProfile;
        static OTHERMANIFESTATIONS: ServiceProfile;
        static SEARCHWITHIN: ServiceProfile;
        static TOKEN: ServiceProfile;
        autoComplete(): ServiceProfile;
        clickThrough(): ServiceProfile;
        iiifImageLevel1(): ServiceProfile;
        iiifImageLevel2(): ServiceProfile;
        ixif(): ServiceProfile;
        login(): ServiceProfile;
        logout(): ServiceProfile;
        otherManifestations(): ServiceProfile;
        searchWithin(): ServiceProfile;
        token(): ServiceProfile;
    }
}
declare module Manifesto {
    class ViewingDirection extends StringValue {
        static LEFTTORIGHT: ViewingDirection;
        static RIGHTTOLEFT: ViewingDirection;
        static TOPTOBOTTOM: ViewingDirection;
        static BOTTOMTOTOP: ViewingDirection;
        leftToRight(): ViewingDirection;
        rightToLeft(): ViewingDirection;
        topToBottom(): ViewingDirection;
        bottomToTop(): ViewingDirection;
    }
}
declare module Manifesto {
    class ViewingHint extends StringValue {
        static CONTINUOUS: ViewingHint;
        static EMPTY: ViewingHint;
        static INDIVIDUALS: ViewingHint;
        static NONPAGED: ViewingHint;
        static PAGED: ViewingHint;
        static TOP: ViewingHint;
        continuous(): ViewingHint;
        empty(): ViewingHint;
        individuals(): ViewingHint;
        nonPaged(): ViewingHint;
        paged(): ViewingHint;
        top(): ViewingHint;
    }
}
declare module Manifesto {
    class JSONLDResource implements IJSONLDResource {
        context: string;
        id: string;
        __jsonld: any;
        private _label;
        constructor(jsonld: any);
        getManifest(): IManifest;
        getLabel(): string;
        getProperty(name: string): any;
    }
}
declare module Manifesto {
    class ManifestResource extends JSONLDResource {
        getService(profile: ServiceProfile | string): IService;
    }
}
declare var _endsWith: any;
declare var _last: any;
declare module Manifesto {
    class Canvas extends ManifestResource implements ICanvas {
        ranges: IRange[];
        constructor(jsonld: any);
        getInfoUri(): string;
        getRange(): IRange;
        getThumbUri(width: number, height: number): string;
        getType(): CanvasType;
        getWidth(): number;
        getHeight(): number;
    }
}
declare module Manifesto {
    class Element extends ManifestResource implements IElement {
        type: ElementType;
        constructor(jsonld: any);
        getType(): ElementType;
    }
}
declare var _assign: any;
declare module Manifesto {
    class IIIFResource extends JSONLDResource implements IIIIFResource {
        options: IManifestoOptions;
        isLoaded: boolean;
        constructor(jsonld: any, options?: IManifestoOptions);
        getAttribution(): string;
        getIIIFResourceType(): IIIFResourceType;
        getLocalisedValue(resource: any, locale?: string): string;
        getLogo(): string;
        getLicense(): string;
        getMetadata(includeRootProperties?: boolean): any;
        getSeeAlso(): any;
        getService(resource: IJSONLDResource, profile: ServiceProfile | string): IService;
        getServices(resource: any): IService[];
        getTitle(): string;
        load(): Promise<IIIIFResource>;
    }
}
declare var _isArray: any;
declare var _map: any;
declare module Manifesto {
    class Manifest extends IIIFResource implements IManifest {
        rootRange: IRange;
        sequences: Sequence[];
        treeRoot: TreeNode;
        constructor(jsonld: any, options?: IManifestoOptions);
        getRanges(): IRange[];
        getRangeById(id: string): IRange;
        getRangeByPath(path: string): IRange;
        getRendering(resource: IJSONLDResource, format: RenderingFormat | string): IRendering;
        getRenderings(resource: any): IRendering[];
        getSequenceByIndex(sequenceIndex: number): ISequence;
        getTotalSequences(): number;
        getTree(): TreeNode;
        private _parseTreeNode(node, range);
        getManifestType(): ManifestType;
        isMultiSequence(): boolean;
    }
}
declare module Manifesto {
    class Collection extends IIIFResource implements ICollection {
        collections: Collection[];
        manifests: Manifest[];
        constructor(jsonld: any, options?: IManifestoOptions);
        getCollectionByIndex(collectionIndex: number): ICollection;
        getManifestByIndex(manifestIndex: number): IManifest;
        getTotalCollections(): number;
        getTotalManifests(): number;
    }
}
declare module Manifesto {
    class Range extends JSONLDResource implements IRange {
        canvases: any[];
        parentRange: Range;
        path: string;
        ranges: Range[];
        treeNode: TreeNode;
        constructor(jsonld: any);
        getViewingDirection(): ViewingDirection;
        getViewingHint(): ViewingHint;
    }
}
declare module Manifesto {
    class Rendering extends JSONLDResource implements IRendering {
        constructor(jsonld: any);
        getFormat(): RenderingFormat;
    }
}
declare var _last: any;
declare module Manifesto {
    class Sequence extends ManifestResource implements ISequence {
        canvases: ICanvas[];
        constructor(jsonld: any);
        getCanvasById(id: string): ICanvas;
        getCanvasByIndex(canvasIndex: number): any;
        getCanvasIndexById(id: string): number;
        getCanvasIndexByLabel(label: string, foliated?: boolean): number;
        getLastCanvasLabel(): string;
        getLastPageIndex(): number;
        getNextPageIndex(canvasIndex: number, pagingEnabled?: boolean): number;
        getPagedIndices(canvasIndex: number, pagingEnabled?: boolean): number[];
        getPrevPageIndex(canvasIndex: number, pagingEnabled?: boolean): number;
        getStartCanvasIndex(): number;
        getThumbs(width: number, height?: number): Manifesto.Thumb[];
        getStartCanvas(): string;
        getTotalCanvases(): number;
        getViewingDirection(): ViewingDirection;
        getViewingHint(): ViewingHint;
        isCanvasIndexOutOfRange(canvasIndex: number): boolean;
        isFirstCanvas(canvasIndex: number): boolean;
        isLastCanvas(canvasIndex: number): boolean;
        isMultiCanvas(): boolean;
        isPagingEnabled(): boolean;
        isTotalCanvasesEven(): boolean;
    }
}
declare var jmespath: any;
declare module Manifesto {
    class Deserialiser {
        static parse(manifest: string, options?: IManifestoOptions): IIIIFResource;
        static parseJson(json: any, options?: IManifestoOptions): IIIIFResource;
        static parseCollection(json: any, options?: IManifestoOptions): Collection;
        static parseCollections(collection: Collection, options?: IManifestoOptions): void;
        static parseManifest(json: any, options?: IManifestoOptions): Manifest;
        static parseManifests(collection: Collection, options?: IManifestoOptions): void;
        static parseSequences(manifest: Manifest): void;
        static parseCanvases(manifest: Manifest, sequence: any): Canvas[];
        static parseRanges(manifest: Manifest, r: any, path: string, parentRange?: Range): void;
        static getCanvasById(manifest: Manifest, id: string): ICanvas;
    }
    class Serialiser {
        static serialise(manifest: Manifest): string;
    }
}
declare var _endsWith: any;
declare module Manifesto {
    class Service extends JSONLDResource implements IService {
        constructor(resource: any);
        getProfile(): ServiceProfile;
        getDescription(): string;
        getInfoUri(): string;
    }
}
declare module Manifesto {
    class Thumb {
        index: number;
        uri: string;
        label: string;
        width: number;
        height: number;
        visible: boolean;
        constructor(index: number, uri: string, label: string, width: number, height: number, visible: boolean);
    }
}
declare module Manifesto {
    class TreeNode {
        label: string;
        data: any;
        nodes: TreeNode[];
        selected: boolean;
        expanded: boolean;
        parentNode: TreeNode;
        constructor(label?: string, data?: any);
        addNode(node: TreeNode): void;
    }
}
declare var http: any;
declare var url: any;
declare module Manifesto {
    class Utils {
        static loadManifest(uri: string): Promise<any>;
        static loadExternalResource(resource: IExternalResource, clickThrough: (resource: IExternalResource) => Promise<void>, login: (resource: IExternalResource) => Promise<void>, getAccessToken: (resource: IExternalResource) => Promise<IAccessToken>, storeAccessToken: (resource: IExternalResource, token: IAccessToken) => Promise<void>, getStoredAccessToken: (resource: IExternalResource) => Promise<IAccessToken>, handleResourceResponse: (resource: IExternalResource) => Promise<any>, options?: IManifestoOptions): Promise<IExternalResource>;
        static loadExternalResources(resources: IExternalResource[], clickThrough: (resource: IExternalResource) => Promise<void>, login: (resource: IExternalResource) => Promise<void>, getAccessToken: (resource: IExternalResource) => Promise<IAccessToken>, storeAccessToken: (resource: IExternalResource, token: IAccessToken) => Promise<void>, getStoredAccessToken: (resource: IExternalResource) => Promise<IAccessToken>, handleResourceResponse: (resource: IExternalResource) => Promise<any>, options?: IManifestoOptions): Promise<IExternalResource[]>;
        static authorize(resource: IExternalResource, clickThrough: (resource: IExternalResource) => Promise<void>, login: (resource: IExternalResource) => Promise<void>, getAccessToken: (resource: IExternalResource) => Promise<IAccessToken>, storeAccessToken: (resource: IExternalResource, token: IAccessToken) => Promise<void>, getStoredAccessToken: (resource: IExternalResource) => Promise<IAccessToken>): Promise<IExternalResource>;
    }
}
declare module Manifesto {
    interface IAccessToken {
        accessToken: string;
        tokenType: string;
        expiresIn: number;
    }
}
declare module Manifesto {
    interface IAnnotation extends IJSONLDResource {
        getMotivation(): string;
    }
}
declare module Manifesto {
    interface ICanvas extends IManifestResource {
        getHeight(): number;
        getInfoUri(): string;
        getRange(): IRange;
        getThumbUri(width: number, height: number): string;
        getType(): CanvasType;
        getWidth(): number;
        ranges: IRange[];
    }
}
declare module Manifesto {
    interface ICollection extends IIIIFResource {
        getCollectionByIndex(index: number): ICollection;
        getManifestByIndex(index: number): IManifest;
        getTotalCollections(): number;
        getTotalManifests(): number;
        collections: ICollection[];
        manifests: IManifest[];
    }
}
declare module Manifesto {
    interface IElement extends IManifestResource {
        getType(): ElementType;
    }
}
declare module Manifesto {
    interface IExternalResource {
        clickThroughService: IService;
        data: any;
        dataUri: string;
        error: any;
        isResponseHandled: boolean;
        loginService: IService;
        logoutService: IService;
        status: number;
        tokenService: IService;
        getData(accessToken?: IAccessToken): Promise<IExternalResource>;
        isAccessControlled(): boolean;
    }
}
declare module Manifesto {
    interface IIIIFResource extends IJSONLDResource {
        options: IManifestoOptions;
        isLoaded: boolean;
        getAttribution(): string;
        getLicense(): string;
        getLocalisedValue(resource: IJSONLDResource | string, locale?: string): string;
        getLogo(): string;
        getMetadata(includeRootProperties?: boolean): any;
        getSeeAlso(): any;
        getService(resource: IJSONLDResource, profile: ServiceProfile | string): IService;
        getServices(resource: any): IService[];
        getTitle(): string;
        getIIIFResourceType(): IIIFResourceType;
        load(): Promise<IIIIFResource>;
    }
}
declare module Manifesto {
    interface IJSONLDResource {
        context: string;
        id: string;
        __jsonld: any;
        getLabel(): string;
        getProperty(name: string): any;
    }
}
declare module Manifesto {
    interface IManifest extends IIIIFResource {
        getRangeById(id: string): IRange;
        getRangeByPath(path: string): IRange;
        getRendering(resource: IJSONLDResource, format: RenderingFormat | string): IRendering;
        getRenderings(resource: any): IRendering[];
        getSequenceByIndex(index: number): ISequence;
        getTotalSequences(): number;
        getTree(): TreeNode;
        getManifestType(): ManifestType;
        isMultiSequence(): boolean;
        rootRange: IRange;
        sequences: ISequence[];
        treeRoot: TreeNode;
    }
}
declare module Manifesto {
    interface IManifestResource extends IJSONLDResource {
        getService(profile: ServiceProfile | string): IService;
    }
}
interface IManifesto {
    loadManifest: (uri: string) => Promise<any>;
    loadExternalResources: (resources: Manifesto.IExternalResource[], clickThrough: (resource: Manifesto.IExternalResource) => Promise<void>, login: (resource: Manifesto.IExternalResource) => Promise<void>, getAccessToken: (resource: Manifesto.IExternalResource) => Promise<Manifesto.IAccessToken>, storeAccessToken: (resource: Manifesto.IExternalResource, token: Manifesto.IAccessToken) => Promise<void>, getStoredAccessToken: (resource: Manifesto.IExternalResource) => Promise<Manifesto.IAccessToken>, handleResourceResponse: (resource: Manifesto.IExternalResource) => Promise<any>, options?: Manifesto.IManifestoOptions) => Promise<Manifesto.IExternalResource[]>;
    create: (manifest: string, options?: Manifesto.IManifestoOptions) => Manifesto.IIIIFResource;
    CanvasType: Manifesto.CanvasType;
    ElementType: Manifesto.ElementType;
    IIIFResourceType: Manifesto.IIIFResourceType;
    ManifestType: Manifesto.ManifestType;
    RenderingFormat: Manifesto.RenderingFormat;
    ServiceProfile: Manifesto.ServiceProfile;
    ViewingDirection: Manifesto.ViewingDirection;
    ViewingHint: Manifesto.ViewingHint;
}
declare module Manifesto {
    interface IManifestoOptions {
        defaultLabel: string;
        locale: string;
        pessimisticAccessControl: boolean;
    }
}
declare module Manifesto {
    interface IRange extends IJSONLDResource {
        canvases: any[];
        getViewingDirection(): ViewingDirection;
        getViewingHint(): ViewingHint;
        parentRange: Range;
        path: string;
        ranges: Range[];
        treeNode: TreeNode;
    }
}
declare module Manifesto {
    interface IRendering extends IJSONLDResource {
        getFormat(): RenderingFormat;
    }
}
declare module Manifesto {
    interface ISequence extends IManifestResource {
        canvases: ICanvas[];
        getCanvasById(id: string): ICanvas;
        getCanvasByIndex(index: number): ICanvas;
        getCanvasIndexById(id: string): number;
        getCanvasIndexByLabel(label: string, foliated: boolean): number;
        getLastCanvasLabel(): string;
        getLastPageIndex(): number;
        getNextPageIndex(index: number): number;
        getPagedIndices(index: number): number[];
        getPrevPageIndex(index: number): number;
        getService(profile: Manifesto.ServiceProfile | string): IService;
        getStartCanvas(): string;
        getStartCanvasIndex(): number;
        getThumbs(width: number, height: number): Manifesto.Thumb[];
        getTotalCanvases(): number;
        getViewingDirection(): Manifesto.ViewingDirection;
        getViewingHint(): Manifesto.ViewingHint;
        isCanvasIndexOutOfRange(index: number): boolean;
        isFirstCanvas(index: number): boolean;
        isLastCanvas(index: number): boolean;
        isMultiCanvas(): boolean;
        isPagingEnabled(): boolean;
        isTotalCanvasesEven(): boolean;
    }
}
declare module Manifesto {
    interface IService extends IJSONLDResource {
        getProfile(): ServiceProfile;
        getDescription(): string;
        getInfoUri(): string;
    }
}
