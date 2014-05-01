
// the provider contains all methods related to
// interacting with the data model.
interface IProvider{
	config: any;
	sequence: any;
	manifest: any;
	type: string;
	isHomeDomain: boolean;
	isOnlyInstance: boolean;
	canvasIndex: number;
	sequenceIndex: number;
	isReload: boolean;
	configExtension: string;
	domain: string;
	isLightbox: boolean;

	load(): void;
	reload(callback: any): void;
	//parseSections(section: any, assets: any[], path: string): void;
	//parseStructures(structure: any, assetSequences: any[], path: string): void;
	//replaceSectionType(sectionType: string): string;
	//getRootSection(): any;
	//getTitle(): string;
	//getSeeAlso(): any;
	//isSeeAlsoEnabled(): boolean;
	//getSectionByAssetIndex(index: number): any;
    //getSectionIndex(path: string): number;
    //getAssetSection(asset): any;
    //getLastAssetOrderLabel(): string;
    //getAssetIndexByOrderLabel(label: string): number;
    getCanvasByIndex(index): any;
    getCurrentCanvas(): any;
	getType(): string;
	getMediaUri(fileUri: string): string;
	getThumbUri(asset: any, thumbsBaseUri?: string, thumbsUriTemplate?: string): string;
	addTimestamp(uri: string): string;
}

export = IProvider;