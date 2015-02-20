/// <reference path="./iSettings.d.ts" />

import BootStrapper = require("../../bootstrapper");
import TreeNode = require("./treeNode");
import Thumb = require("./thumb");
import BootstrapParams = require("../../bootstrapParams");

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
    getCurrentCanvas(): any;
    getLocalisedValue(property: any): string;
    getManifestSeeAlsoUri(manifest: any): string;
    getManifestType(): string;
    getMetaData(callback: (data: any) => any): void;
    getSeeAlso(): any;
    getSequenceType(): string;
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
    isFirstCanvas(canvasIndex?: number): boolean;
    isLastCanvas(canvasIndex?: number): boolean;
    isPaged(): boolean;
    isMultiCanvas(): boolean;
    isMultiSequence(): boolean;
    isSeeAlsoEnabled(): boolean;
    load(): void;
    parseManifest(): void;
    parseStructure(): void;
    sanitize(html: string): string;

    // should these move to extension? (not generic to IIIF)
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

    getMediaUri(mediaUri: string): string;
    getDomain(): string;
    getEmbedDomain(): string;
    defaultToThumbsView(): boolean;
    isDeepLinkingEnabled(): boolean;
    paramMap: string[];
    reloadManifest(callback: any): void;
    reload(params?: BootstrapParams);
    setMediaUri(canvas: any): void;
    getSettings(): ISettings;
    updateSettings(settings: ISettings): void;
    getLocales(): any;
}

export = IProvider;