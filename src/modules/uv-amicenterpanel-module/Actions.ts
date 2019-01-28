import { Mode } from "./Mode";

export enum TypeKeys {
    CHANGE_MODE = "CHANGE_MODE",
    MODEL_LOADED = "MODEL_LOADED",
    OTHER = "OTHER"
}

export type ActionTypes = 
    | ChangeModeAction
    | ModelLoadedAction;

export interface ChangeModeAction {
    type: TypeKeys.CHANGE_MODE;
    payload: Mode;
}

export interface ModelLoadedAction {
    type: TypeKeys.MODEL_LOADED;
    payload: any;
}