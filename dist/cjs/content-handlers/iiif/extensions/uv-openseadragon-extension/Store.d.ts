import { ExtensionState } from "../../modules/uv-shared-module/ExtensionState";
export interface OpenSeadragonExtensionState extends ExtensionState {
}
export declare const createStore: () => import("zustand/vanilla").StoreApi<OpenSeadragonExtensionState>;
