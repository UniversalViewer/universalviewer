import { IAVComponentData } from "./component-data";
import { VirtualCanvas } from "../elements/virtual-canvas";
import { Canvas, Range } from "manifesto.js";

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IAVCanvasInstanceData extends IAVComponentData {
  canvas?: Canvas | VirtualCanvas;
  range?: Range;
  visible?: boolean;
  volume?: number;
}
