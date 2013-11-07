
import baseProvider = require("./baseProvider");

interface IExtension{

	provider: any;
	currentAssetIndex: number;
	mouseX: number;
	mouseY: number;
	isFullScreen: boolean;

	width(): number;
	height(): number;
	refresh(): void;
	redirect(uri: string): void;
	viewAssetSequence(index): void;
	isDeepLinkingEnabled(): boolean;
	isMultiAsset(): boolean;
	isOverlayActive(): boolean;
	getSectionByAssetIndex(index: number): any;
	getSectionIndex(path: string): number;
	getAssetSection(asset): any;
	getAssetByIndex(index): any;
	getLastAssetOrderLabel(): string;
	getAssetIndexByOrderLabel(label: string): number;
	getCurrentAsset(): any;
	showDialogue(message: string, acceptCallback?: any, buttonText?: string, allowClose?: boolean): void;
	getParam(key: baseProvider.params): any;
	triggerSocket(eventName: string, eventObject: any): void;
	isSeeAlsoEnabled(): boolean;
}

export = IExtension;