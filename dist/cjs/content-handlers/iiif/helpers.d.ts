import { ContentState, NormalisedContentState } from "./content-state/content-state";
export declare function parseContentStateParameter(contentState?: ContentState | string): NormalisedContentState | {
    type: "remote-content-state";
    id: string;
} | null;
