import { IUVData } from "../../IUVData";

export interface IOpenSeadragonExtensionData extends IUVData {
  highlight: string | null;
  rotation: number | null;
  xywh: string | null;
}
