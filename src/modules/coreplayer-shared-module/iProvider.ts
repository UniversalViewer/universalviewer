
// the provider contains all methods related to
// interacting with the data model.
interface IProvider{
	config: any;
	sequence: any;
	manifest: any;
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

    parseManifest(): void;
    parseStructure(): void;

    getCanvasByIndex(index): any;
    getCurrentCanvas(): any;
	getType(): string;
	getTitle(): string;
	getMediaUri(mediaUri: string): string;
	setMediaUri(canvas: any): void;
	getThumbUri(asset: any, thumbsBaseUri?: string, thumbsUriTemplate?: string): string;
	getSeeAlso(): any;
	isSeeAlsoEnabled(): boolean;
	getStructureSeeAlsoUri(structure: any): string;
	isMultiCanvas(): boolean;
	addTimestamp(uri: string): string;
	isDeepLinkingEnabled(): boolean;
}

export = IProvider;