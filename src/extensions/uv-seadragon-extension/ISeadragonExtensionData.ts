import {IUVData} from "../../IUVData";

export interface ISeadragonExtensionData extends IUVData {
    highlight: string | null;
    rotation: number | null;
    xywh: string | null;
}