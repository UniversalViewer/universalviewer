import { TypeKeys, ChangeModeAction, ModelLoadedAction } from './Actions';
import { Mode } from './Mode';

export const changeMode = (payload: Mode): ChangeModeAction => ({
    type: TypeKeys.CHANGE_MODE,
    payload
});

export const modelLoaded = (payload: any): ModelLoadedAction => ({
    type: TypeKeys.MODEL_LOADED,
    payload
});