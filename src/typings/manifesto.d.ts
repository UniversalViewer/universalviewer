declare module Manifesto {
    class Canvas implements ICanvas {
        id: string;
        jsonld: any;
        manifest: IManifest;
        ranges: IRange[];
        type: CanvasType;
        getHeight(): number;
        getLabel(): string;
        getRange(): IRange;
        getThumbUri(width: number, height: number): string;
        getWidth(): number;
    }
}
declare module Manifesto {
    class CanvasType {
        value: string;
        static canvas: CanvasType;
        constructor(value: string);
        toString(): string;
    }
}
declare var isArray: any;
declare module Manifesto {
    class Element implements IElement {
        id: string;
        jsonld: any;
        manifest: IManifest;
        type: ElementType;
        getLabel(): string;
        getRenderings(): IRendering[];
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
    interface ICanvas extends IManifestResource {
        ranges: IRange[];
        type: CanvasType;
        getHeight(): number;
        getLabel(): string;
        getRange(): IRange;
        getThumbUri(width: number, height: number): string;
        getWidth(): number;
    }
}
declare module Manifesto {
    interface IElement extends IManifestResource {
        type: ElementType;
        getLabel(): string;
        getRenderings(): IRendering[];
    }
}
declare module Manifesto {
    interface IJSONLDResource {
        id: string;
        jsonld: any;
    }
}
declare module Manifesto {
    interface IManifest extends IJSONLDResource {
        defaultLabel: string;
        getAttribution(): string;
        getLocalisedValue(resource: any, locale?: string): string;
        getLabel(): string;
        getLogo(): string;
        getLicense(): string;
        getMetadata(includeRootProperties?: boolean): any;
        getRangeById(id: string): IRange;
        getRangeByPath(path: string): IRange;
        getRendering(resource: any, format: RenderingFormat | string): IRendering;
        getRenderings(resource: any): IRendering[];
        getSeeAlso(): any;
        getService(resource: IJSONLDResource, profile: ServiceProfile | string): IService;
        getSequenceByIndex(index: number): ISequence;
        getTitle(): string;
        getTotalSequences(): number;
        getTree(): TreeNode;
        isMultiSequence(): boolean;
        rootRange: IRange;
        treeRoot: TreeNode;
    }
}
declare module Manifesto {
    interface IManifestResource extends IJSONLDResource {
        manifest: IManifest;
    }
}
interface IManifesto {
    load: (manifestUri: string, callback: (manifest: string) => void) => void;
    parse: (manifest: string) => Manifesto.Manifest;
}
declare module Manifesto {
    interface IRange extends IManifestResource {
        canvases: any[];
        label: string;
        parentRange: Range;
        path: string;
        ranges: Range[];
        viewingDirection: ViewingDirection;
        viewingHint: ViewingHint;
        getLabel(): string;
        treeNode: TreeNode;
    }
}
declare module Manifesto {
    interface IRendering extends IManifestResource {
        format: string;
    }
}
declare module Manifesto {
    interface ISequence extends IManifestResource {
        getCanvasById(id: string): ICanvas;
        getCanvasByIndex(index: number): ICanvas;
        getCanvasIndexById(id: string): number;
        getCanvasIndexByLabel(label: string): number;
        getLastCanvasLabel(): string;
        getLastPageIndex(): number;
        getNextPageIndex(index: number): number;
        getPagedIndices(index: number): number[];
        getPrevPageIndex(index: number): number;
        getStartCanvasIndex(): number;
        getTotalCanvases(): number;
        getThumbs(width: number, height: number): Manifesto.Thumb[];
        getViewingDirection(): Manifesto.ViewingDirection;
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
    }
}
declare var isArray: any;
declare module Manifesto {
    class Manifest implements IManifest {
        defaultLabel: string;
        id: string;
        jsonld: any;
        locale: string;
        manifest: IManifest;
        rootRange: IRange;
        sequences: Sequence[];
        treeRoot: TreeNode;
        constructor(jsonld: any);
        getAttribution(): string;
        getLabel(): string;
        getLocalisedValue(resource: any, locale?: string): string;
        getLogo(): string;
        getLicense(): string;
        getMetadata(includeRootProperties?: boolean): any;
        getRanges(): IRange[];
        getRangeById(id: string): IRange;
        getRangeByPath(path: string): IRange;
        getRendering(resource: any, format: Manifesto.RenderingFormat): Manifesto.Rendering;
        getRenderings(resource: any): IRendering[];
        getSeeAlso(): any;
        getService(resource: any, profile: Manifesto.ServiceProfile): IService;
        getSequenceByIndex(sequenceIndex: number): ISequence;
        getTitle(): string;
        getTotalSequences(): number;
        getTree(): TreeNode;
        private _parseTreeNode(node, range);
        isMultiSequence(): boolean;
    }
}
declare module Manifesto {
    class Range implements IRange {
        canvases: any[];
        id: string;
        jsonld: any;
        label: string;
        manifest: Manifesto.Manifest;
        parentRange: Range;
        path: string;
        ranges: Range[];
        treeNode: TreeNode;
        viewingHint: ViewingHint;
        viewingDirection: ViewingDirection;
        getLabel(): string;
    }
}
declare module Manifesto {
    class Rendering implements IRendering {
        format: string;
        id: string;
        jsonld: any;
        manifest: IManifest;
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
declare var isNumber: any;
declare module Manifesto {
    class Sequence implements ISequence {
        canvases: Canvas[];
        id: string;
        jsonld: any;
        manifest: IManifest;
        startCanvas: string;
        viewingDirection: ViewingDirection;
        viewingHint: ViewingHint;
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
        getTotalCanvases(): number;
        getViewingDirection(): Manifesto.ViewingDirection;
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
        static manifest: Manifest;
        static parse(manifest: string): Manifest;
        static parseSequences(): void;
        static parseCanvases(sequence: any): Canvas[];
        static parseRanges(r: any, path: string, parentRange?: Range): void;
        static getCanvasById(id: string): Canvas;
    }
    class Serialiser {
        static serialise(manifest: Manifest): string;
    }
}
declare module Manifesto {
    class Service {
        id: string;
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
declare var http: any;
declare var url: any;
declare var path: any;
