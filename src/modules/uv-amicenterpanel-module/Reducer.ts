import { TypeKeys, ActionTypes } from './Actions';
import { State } from "./State";

type Reducer = (s: State, action: ActionTypes) => State;

export const AMIViewerReducer: Reducer = (state: State, action: ActionTypes) => {
    switch (action.type) {
        case TypeKeys.CHANGE_MODE:
          return {
            mode: action.payload,
            series: state.series,
            modeldata: null
          };
        case TypeKeys.MODEL_LOADED:
          return {
            mode: state.mode,
            series: state.series,
            modeldata: action.payload
          };
        default:
          return state;
    }
}