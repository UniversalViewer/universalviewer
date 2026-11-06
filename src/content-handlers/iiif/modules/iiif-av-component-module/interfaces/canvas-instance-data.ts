import { IAVComponentData } from "./component-data";
import { VirtualCanvas } from "../elements/virtual-canvas";
import { Canvas, Range } from "manifesto.js";
import { CaptionLibrary } from "../../uv-captions-module/CaptionLibrary";

export interface IAVCanvasInstanceData extends IAVComponentData {
  canvas?: Canvas | VirtualCanvas;
  // Shared by an AV component's canvas instances.
  captionLibrary?: CaptionLibrary;
  range?: Range;
  visible?: boolean;
  volume?: number;
}
