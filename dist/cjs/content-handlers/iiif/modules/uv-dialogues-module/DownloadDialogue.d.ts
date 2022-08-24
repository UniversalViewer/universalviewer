import { Dialogue } from "../uv-shared-module/Dialogue";
import { DownloadOption } from "../uv-shared-module/DownloadOption";
import { IRenderingOption } from "../uv-shared-module/IRenderingOption";
import { ManifestResource } from "manifesto.js";
export declare class DownloadDialogue extends Dialogue {
    $downloadOptions: JQuery;
    $noneAvailable: JQuery;
    $title: JQuery;
    $footer: JQuery;
    $termsOfUseButton: JQuery;
    renderingUrls: string[];
    renderingUrlsCount: number;
    constructor($element: JQuery);
    create(): void;
    addEntireFileDownloadOptions(): void;
    addEntireFileDownloadOption(uri: string, label: string, format: string): void;
    resetDynamicDownloadOptions(): void;
    getDownloadOptionsForRenderings(resource: ManifestResource, defaultLabel: string, type: DownloadOption): IRenderingOption[];
    getSelectedOption(): JQuery<HTMLElement>;
    getCurrentResourceId(): string;
    getCurrentResourceFormat(): string;
    updateNoneAvailable(): void;
    updateTermsOfUseButton(): void;
    getFileExtension(fileUri: string): string | null;
    isMediaDownloadEnabled(): boolean;
    isDownloadOptionAvailable(option: DownloadOption): boolean;
    close(): void;
    resize(): void;
}
