/// <reference path="./iSettings.d.ts" />

import TreeNode = require("./treeNode");
import Thumb = require("./thumb");

// the provider contains all methods related to
// interacting with the data model.
interface IProvider{
	canvasIndex: number;
	config: any;
	configExtension: string;
	domain: string;
    embedDomain: string;
	isHomeDomain: boolean;
	isLightbox: boolean;
	isOnlyInstance: boolean;
	isReload: boolean;
	manifest: any;
	sequence: any;
	sequenceIndex: number;
	treeRoot: TreeNode;

    addTimestamp(uri: string): string;
    defaultToThumbsView(): boolean;
    getCanvasByIndex(index): any;
    getCanvasIndexByOrderLabel(label: string): number; // todo: remove?
    getCanvasOrderLabel(canvas: any): string;
    getCanvasStructure(canvas: any): any;
    getCurrentCanvas(): any;
    getDomain(): string;
    getEmbedDomain(): string;
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
    isDeepLinkingEnabled(): boolean;
    isFirstCanvas(canvasIndex?: number): boolean;
    isLastCanvas(canvasIndex?: number): boolean;
    isPaged(): boolean;
    isMultiCanvas(): boolean;
    isMultiSequence(): boolean;
    isSeeAlsoEnabled(): boolean;
    load(): void;
    paramMap: string[];
    parseManifest(): void;
    parseStructure(): void;
    reload(callback: any): void;
    setMediaUri(canvas: any): void; // todo: remove?
    getSettings(): ISettings;
    updateSettings(settings: ISettings): void;
}

export = IProvider;