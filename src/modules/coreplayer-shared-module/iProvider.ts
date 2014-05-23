import TreeNode = require("./treeNode");
import Thumb = require("./thumb");

// the provider contains all methods related to
// interacting with the data model.
interface IProvider{
	canvasIndex: number;
	config: any;
	configExtension: string;
	domain: string;
	isHomeDomain: boolean;
	isLightbox: boolean;
	isOnlyInstance: boolean;
	isReload: boolean;
	manifest: any;
	sequence: any;
	sequenceIndex: number;
	treeRoot: TreeNode;

    addTimestamp(uri: string): string;
    getCanvasByIndex(index): any;
    getCanvasIndexByOrderLabel(label: string): number; // todo: remove?
    getCanvasOrderLabel(canvas: any): string;
    getCanvasStructure(canvas: any): any;
    getCurrentCanvas(): any;
    getDomain(): string;
    getLastCanvasOrderLabel(): string; // todo: remove?
    getManifestSeeAlsoUri(manifest: any): string;
    getManifestType(): string;
    getMediaUri(mediaUri: string): string;
    getMetaData(callback: (data: any) => any): void;
    getSeeAlso(): any;
    getSequenceType(): string;
    getStructureByCanvasIndex(index: number): any; // todo: remove?
    getStructureByIndex(structure: any, index: number): any; // todo: remove?
    getStructureIndex(path: string): number; // todo: remove?
    getThumbs(): Array<Thumb>;
    getThumbUri(asset: any, thumbsBaseUri?: string, thumbsUriTemplate?: string): string;
    getTitle(): string;
    getTotalCanvases(): number;
    getTree(): TreeNode;
    isDeepLinkingEnabled(): boolean;
    isMultiCanvas(): boolean;
    isMultiSequence(): boolean;
    isSeeAlsoEnabled(): boolean;
    load(): void;
    paramMap: string[];
    parseManifest(): void;
    parseStructure(): void;
    reload(callback: any): void;
    setMediaUri(canvas: any): void; // todo: remove?
}

export = IProvider;