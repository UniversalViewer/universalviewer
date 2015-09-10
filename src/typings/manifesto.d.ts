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
        constructor(jsonld: any);
        getProperty(name: string): any;
    }
}
declare module Manifesto {
    class ManifestResource extends JSONLDResource implements IManifestResource {
        options: IManifestoOptions;
        constructor(jsonld: any, options: IManifestoOptions);
        getLabel(): string;
        getMetadata(): any;
        getRendering(format: RenderingFormat | string): IRendering;
        getRenderings(): IRendering[];
        getService(profile: ServiceProfile | string): IService;
        getServices(): IService[];
    }
}
declare var _endsWith: any;
declare var _last: any;
declare module Manifesto {
    class Canvas extends ManifestResource implements ICanvas {
        ranges: IRange[];
        constructor(jsonld: any, options: IManifestoOptions);
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
        constructor(jsonld: any, options: IManifestoOptions);
        getType(): ElementType;
    }
}
declare var _assign: any;
declare module Manifesto {
    class IIIFResource extends ManifestResource implements IIIIFResource {
        index: number;
        isLoaded: boolean;
        parentCollection: ICollection;
        treeRoot: TreeNode;
        constructor(jsonld: any, options?: IManifestoOptions);
        getAttribution(): string;
        getDescription(): string;
        getIIIFResourceType(): IIIFResourceType;
        getLogo(): string;
        getLicense(): string;
        getSeeAlso(): any;
        getTitle(): string;
        getTree(): TreeNode;
        load(): Promise<IIIIFResource>;
    }
}
declare var _isArray: any;
declare var _map: any;
declare module Manifesto {
    class Manifest extends IIIFResource implements IManifest {
        index: number;
        rootRange: IRange;
        sequences: ISequence[];
        constructor(jsonld: any, options?: IManifestoOptions);
        getRanges(): IRange[];
        getRangeById(id: string): IRange;
        getRangeByPath(path: string): IRange;
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
        collections: ICollection[];
        manifests: IManifest[];
        constructor(jsonld: any, options: IManifestoOptions);
        getCollectionByIndex(collectionIndex: number): ICollection;
        getManifestByIndex(manifestIndex: number): IManifest;
        getTotalCollections(): number;
        getTotalManifests(): number;
        getTree(): TreeNode;
        private _parseManifests(parentCollection);
        private _parseCollections(parentCollection);
    }
}
declare module Manifesto {
    class Range extends ManifestResource implements IRange {
        canvases: any[];
        parentRange: Range;
        path: string;
        ranges: Range[];
        treeNode: TreeNode;
        constructor(jsonld: any, options: IManifestoOptions);
        getViewingDirection(): ViewingDirection;
        getViewingHint(): ViewingHint;
    }
}
declare module Manifesto {
    class Rendering extends ManifestResource implements IRendering {
        constructor(jsonld: any, options: IManifestoOptions);
        getFormat(): RenderingFormat;
    }
}
declare var _last: any;
declare module Manifesto {
    class Sequence extends ManifestResource implements ISequence {
        canvases: ICanvas[];
        constructor(jsonld: any, options: IManifestoOptions);
        getCanvasById(id: string): ICanvas;
        getCanvasByIndex(canvasIndex: number): any;
        getCanvasIndexById(id: string): number;
        getCanvasIndexByLabel(label: string, foliated?: boolean): number;
        getLastCanvasLabel(digitsOnly?: boolean): string;
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
declare var _isString: any;
declare module Manifesto {
    class Deserialiser {
        static parse(manifest: string, options?: IManifestoOptions): IIIIFResource;
        static parseJson(json: any, options?: IManifestoOptions): IIIIFResource;
        static parseCollection(json: any, options?: IManifestoOptions): ICollection;
        static parseCollections(collection: ICollection, options?: IManifestoOptions): void;
        static parseManifest(json: any, options?: IManifestoOptions): IManifest;
        static parseManifests(collection: ICollection, options?: IManifestoOptions): void;
        static parseSequences(manifest: IManifest, options: IManifestoOptions): void;
        static parseCanvases(sequence: any, options: IManifestoOptions): ICanvas[];
        static parseRanges(manifest: IManifest, r: any, path: string, parentRange?: IRange): void;
        static getCanvasById(manifest: IManifest, id: string): ICanvas;
    }
    class Serialiser {
        static serialise(manifest: IManifest): string;
    }
}
declare var _endsWith: any;
declare module Manifesto {
    class Service extends ManifestResource implements IService {
        constructor(jsonld: any, options: IManifestoOptions);
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
        static getLocalisedValue(resource: any, locale: string): string;
        static loadResource(uri: string): Promise<any>;
        static loadExternalResource(resource: IExternalResource, clickThrough: (resource: IExternalResource) => Promise<void>, login: (resource: IExternalResource) => Promise<void>, getAccessToken: (resource: IExternalResource) => Promise<IAccessToken>, storeAccessToken: (resource: IExternalResource, token: IAccessToken) => Promise<void>, getStoredAccessToken: (resource: IExternalResource) => Promise<IAccessToken>, handleResourceResponse: (resource: IExternalResource) => Promise<any>, options?: IManifestoOptions): Promise<IExternalResource>;
        static loadExternalResources(resources: IExternalResource[], clickThrough: (resource: IExternalResource) => Promise<void>, login: (resource: IExternalResource) => Promise<void>, getAccessToken: (resource: IExternalResource) => Promise<IAccessToken>, storeAccessToken: (resource: IExternalResource, token: IAccessToken) => Promise<void>, getStoredAccessToken: (resource: IExternalResource) => Promise<IAccessToken>, handleResourceResponse: (resource: IExternalResource) => Promise<any>, options?: IManifestoOptions): Promise<IExternalResource[]>;
        static authorize(resource: IExternalResource, clickThrough: (resource: IExternalResource) => Promise<void>, login: (resource: IExternalResource) => Promise<void>, getAccessToken: (resource: IExternalResource) => Promise<IAccessToken>, storeAccessToken: (resource: IExternalResource, token: IAccessToken) => Promise<void>, getStoredAccessToken: (resource: IExternalResource) => Promise<IAccessToken>): Promise<IExternalResource>;
        static getRendering(resource: any, format: RenderingFormat | string): IRendering;
        static getRenderings(resource: any): IRendering[];
        static getService(resource: any, profile: ServiceProfile | string): IService;
        static getServices(resource: any): IService[];
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
        collections: ICollection[];
        getCollectionByIndex(index: number): ICollection;
        getManifestByIndex(index: number): IManifest;
        getTotalCollections(): number;
        getTotalManifests(): number;
        getTree(): TreeNode;
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
    interface IIIIFResource extends IManifestResource {
        getAttribution(): string;
        getDescription(): string;
        getIIIFResourceType(): IIIFResourceType;
        getLicense(): string;
        getLogo(): string;
        getSeeAlso(): any;
        getTitle(): string;
        getTree(): TreeNode;
        index: number;
        isLoaded: boolean;
        load(): Promise<IIIIFResource>;
        parentCollection: ICollection;
        treeRoot: TreeNode;
    }
}
declare module Manifesto {
    interface IJSONLDResource {
        context: string;
        id: string;
        __jsonld: any;
        getProperty(name: string): any;
    }
}
declare module Manifesto {
    interface IManifest extends IIIIFResource {
        getRangeById(id: string): IRange;
        getRangeByPath(path: string): IRange;
        getSequenceByIndex(index: number): ISequence;
        getTotalSequences(): number;
        getTree(): TreeNode;
        getManifestType(): ManifestType;
        isMultiSequence(): boolean;
        rootRange: IRange;
        sequences: ISequence[];
    }
}
declare module Manifesto {
    interface IManifestResource extends IJSONLDResource {
        options: IManifestoOptions;
        getLabel(): string;
        getMetadata(): any;
        getRendering(format: RenderingFormat | string): IRendering;
        getRenderings(): IRendering[];
        getService(profile: ServiceProfile | string): IService;
        getServices(): IService[];
    }
}
interface IManifesto {
    CanvasType: Manifesto.CanvasType;
    create: (manifest: string, options?: Manifesto.IManifestoOptions) => Manifesto.IIIIFResource;
    ElementType: Manifesto.ElementType;
    getRenderings(resource: any): Manifesto.IRendering[];
    getService: (resource: any, profile: Manifesto.ServiceProfile | string) => Manifesto.IService;
    IIIFResourceType: Manifesto.IIIFResourceType;
    loadExternalResources: (resources: Manifesto.IExternalResource[], clickThrough: (resource: Manifesto.IExternalResource) => Promise<void>, login: (resource: Manifesto.IExternalResource) => Promise<void>, getAccessToken: (resource: Manifesto.IExternalResource) => Promise<Manifesto.IAccessToken>, storeAccessToken: (resource: Manifesto.IExternalResource, token: Manifesto.IAccessToken) => Promise<void>, getStoredAccessToken: (resource: Manifesto.IExternalResource) => Promise<Manifesto.IAccessToken>, handleResourceResponse: (resource: Manifesto.IExternalResource) => Promise<any>, options?: Manifesto.IManifestoOptions) => Promise<Manifesto.IExternalResource[]>;
    loadManifest: (uri: string) => Promise<any>;
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
    interface IRange extends IManifestResource {
        canvases: any[];
        getViewingDirection(): ViewingDirection;
        getViewingHint(): ViewingHint;
        parentRange: IRange;
        path: string;
        ranges: IRange[];
        treeNode: TreeNode;
    }
}
declare module Manifesto {
    interface IRendering extends IManifestResource {
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
        getLastCanvasLabel(digitsOnly?: boolean): string;
        getLastPageIndex(): number;
        getNextPageIndex(index: number): number;
        getPagedIndices(index: number): number[];
        getPrevPageIndex(index: number): number;
        getRendering(format: RenderingFormat | string): IRendering;
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
    interface IService extends IManifestResource {
        getProfile(): ServiceProfile;
        getInfoUri(): string;
    }
}
