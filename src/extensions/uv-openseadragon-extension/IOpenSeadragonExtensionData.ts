import { IIIFData } from "@/IUVData";

export interface IOpenSeadragonExtensionData extends IIIFData {
  highlight: string | undefined;
  rotation: number | undefined;
  xywh: string | undefined;
}
