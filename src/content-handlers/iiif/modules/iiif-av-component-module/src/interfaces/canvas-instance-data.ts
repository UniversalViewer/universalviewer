import { IAVComponentData } from "./component-data";
import { VirtualCanvas } from "../elements/virtual-canvas";
import { Canvas, Range } from "manifesto.js";
export interface IAVCanvasInstanceData extends IAVComponentData {
  canvas?: Canvas | VirtualCanvas;
  range?: Range;
  visible?: boolean;
  volume?: number;
}
