import { ExternalWebResource, W3CAnnotationTarget } from "@iiif/presentation-3";
import { SupportedSelectors } from "./selector-extensions";
export declare type SupportedTarget = {
    type: "SpecificResource";
    source: ExternalWebResource | {
        id: string;
        type: "Unknown" | "Canvas" | "Range" | "Manifest";
        partOf?: Array<{
            id: string;
            type: string;
        }>;
    };
    purpose?: string;
    selector: SupportedSelectors | null;
    selectors: SupportedSelectors[];
};
export declare function expandTarget(target: W3CAnnotationTarget | W3CAnnotationTarget[], options?: {
    typeMap?: Record<string, string>;
}): SupportedTarget;
