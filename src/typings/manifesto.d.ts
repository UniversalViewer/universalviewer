declare module Manifesto {
    class CanvasType {
        value: string;
        static canvas: CanvasType;
        constructor(value: string);
        toString(): string;
    }
}
declare module Manifesto {
    class ElementType {
        value: string;
        static document: CanvasType;
        static movingimage: CanvasType;
        static sound: CanvasType;
        constructor(value: string);
        toString(): string;
    }
}
declare module Manifesto {
    class RenderingFormat {
        value: string;
        static pdf: RenderingFormat;
        static doc: RenderingFormat;
        static docx: RenderingFormat;
        constructor(value: string);
        toString(): string;
    }
}
declare module Manifesto {
    class ServiceProfile {
        value: string;
        static autoComplete: ServiceProfile;
        static login: ServiceProfile;
        static logout: ServiceProfile;
        static otherManifestations: ServiceProfile;
        static searchWithin: ServiceProfile;
        static token: ServiceProfile;
        constructor(value: string);
        toString(): string;
    }
}
declare module Manifesto {
    class ViewingDirection {
        value: string;
        static leftToRight: ViewingDirection;
        static rightToLeft: ViewingDirection;
        static topToBottom: ViewingDirection;
        static bottomToTop: ViewingDirection;
        constructor(value: string);
        toString(): string;
    }
}
declare module Manifesto {
    class ViewingHint {
        value: string;
        static individuals: ViewingHint;
        static paged: ViewingHint;
        static continuous: ViewingHint;
        static nonPaged: ViewingHint;
        static top: ViewingHint;
        constructor(value: string);
        toString(): string;
    }
}
declare module Manifesto {
    interface IJSONLDResource {
        context: string;
        id: string;
        __jsonld: any;
        getLabel(): string;
    }
}
declare module Manifesto {
    class JSONLDResource implements IJSONLDResource {
        context: string;
        id: string;
        __jsonld: any;
        private _label;
        private _manifest;
        constructor(jsonld: any);
        getManifest(): IManifest;
        getLabel(): string;
    }
}
declare module Manifesto {
    class Canvas extends JSONLDResource implements ICanvas {
        ranges: IRange[];
        constructor(jsonld: any);
        getImageUri(): string;
        getRange(): IRange;
        getThumbUri(width: number, height: number): string;
        getType(): CanvasType;
        getWidth(): number;
        getHeight(): number;
    }
}
declare var _isArray: any;
declare module Manifesto {
    class Element extends JSONLDResource implements IElement {
        type: ElementType;
        constructor(jsonld: any);
        getRenderings(): IRendering[];
        getType(): ElementType;
    }
}
declare module Manifesto {
    interface ICanvas extends IJSONLDResource {
        getHeight(): number;
        getImageUri(): string;
        getRange(): IRange;
        getThumbUri(width: number, height: number): string;
        getType(): CanvasType;
        getWidth(): number;
        ranges: IRange[];
    }
}
declare module Manifesto {
    interface IElement extends IJSONLDResource {
        getRenderings(): IRendering[];
        getType(): ElementType;
    }
}
declare module Manifesto {
    interface IManifest extends IJSONLDResource {
        getAttribution(): string;
        getLicense(): string;
        getLocalisedValue(resource: IJSONLDResource | string, locale?: string): string;
        getLogo(): string;
        getMetadata(includeRootProperties?: boolean): any;
        getRangeById(id: string): IRange;
        getRangeByPath(path: string): IRange;
        getRendering(resource: IJSONLDResource, format: RenderingFormat | string): IRendering;
        getRenderings(resource: IJSONLDResource): IRendering[];
        getSeeAlso(): any;
        getSequenceByIndex(index: number): ISequence;
        getService(resource: IJSONLDResource, profile: ServiceProfile | string): IService;
        getTitle(): string;
        getTotalSequences(): number;
        getTree(): TreeNode;
        isMultiSequence(): boolean;
        options: IManifestoOptions;
        rootRange: IRange;
        sequences: ISequence[];
        treeRoot: TreeNode;
    }
}
interface IManifesto {
    load: (manifestUri: string, callback: (manifest: string) => void) => void;
    parse: (manifest: string) => Manifesto.Manifest;
}
interface IManifestoOptions {
    defaultLabel: string;
    locale: string;
    pessimisticAccessControl: boolean;
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
        format: string;
    }
}
declare module Manifesto {
    interface ISequence extends IJSONLDResource {
        canvases: ICanvas[];
        getCanvasById(id: string): ICanvas;
        getCanvasByIndex(index: number): ICanvas;
        getCanvasIndexById(id: string): number;
        getCanvasIndexByLabel(label: string): number;
        getLastCanvasLabel(): string;
        getLastPageIndex(): number;
        getNextPageIndex(index: number): number;
        getPagedIndices(index: number): number[];
        getPrevPageIndex(index: number): number;
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
    }
}
declare var _assign: any;
declare var _isArray: any;
declare module Manifesto {
    class Manifest extends JSONLDResource implements IManifest {
        options: IManifestoOptions;
        rootRange: IRange;
        sequences: Sequence[];
        treeRoot: TreeNode;
        constructor(jsonld: any, options?: IManifestoOptions);
        getAttribution(): string;
        getLocalisedValue(resource: any, locale?: string): string;
        getLogo(): string;
        getLicense(): string;
        getMetadata(includeRootProperties?: boolean): any;
        getRanges(): IRange[];
        getRangeById(id: string): IRange;
        getRangeByPath(path: string): IRange;
        getRendering(resource: IJSONLDResource, format: Manifesto.RenderingFormat | string): IRendering;
        getRenderings(resource: IJSONLDResource): IRendering[];
        getSeeAlso(): any;
        getService(resource: IJSONLDResource, profile: Manifesto.ServiceProfile | string): IService;
        getSequenceByIndex(sequenceIndex: number): ISequence;
        getTitle(): string;
        getTotalSequences(): number;
        getTree(): TreeNode;
        private _parseTreeNode(node, range);
        isMultiSequence(): boolean;
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
        format: string;
        constructor(jsonld: any);
    }
}
declare var _isNumber: any;
declare module Manifesto {
    class Sequence extends JSONLDResource implements ISequence {
        canvases: ICanvas[];
        constructor(jsonld: any);
        getCanvasById(id: string): ICanvas;
        getCanvasByIndex(canvasIndex: number): any;
        getCanvasIndexById(id: string): number;
        getCanvasIndexByLabel(label: string): number;
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
        static manifest: IManifest;
        static parse(manifest: string): IManifest;
        static parseSequences(): void;
        static parseCanvases(sequence: any): Canvas[];
        static parseRanges(r: any, path: string, parentRange?: Range): void;
        static getCanvasById(id: string): ICanvas;
    }
    class Serialiser {
        static serialise(manifest: Manifest): string;
    }
}
declare module Manifesto {
    class Service extends JSONLDResource implements IService {
        constructor(resource: any);
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
