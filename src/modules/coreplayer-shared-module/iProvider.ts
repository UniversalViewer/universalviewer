

interface IProvider{
	config: any;
	assetSequence: any;
	pkg: any;
	type: string;
	isHomeDomain: boolean;
	isOnlyInstance: boolean;
	assetSequenceIndex: number;
	isReload: boolean;
	configExtension: string;
	domain: string;

	load(): void;
	reload(callback: any): void;
	parseSections(section: any, assets: any[], path: string): void;
	parseStructures(structure: any, assetSequences: any[], path: string): void;
	replaceSectionType(sectionType: string): string;
	getRootSection(): any;
	getTitle(): string;
	getSeeAlso(): any;
	getMediaUri(fileUri: string): string;
}

export = IProvider;