import { VirtualCanvas } from "../elements/virtual-canvas";
import { Canvas } from "manifesto.js";

export function isVirtual(
  canvas: Canvas | VirtualCanvas | undefined
): canvas is VirtualCanvas {
  if (!canvas) {
    return false;
  }
  return canvas instanceof VirtualCanvas;
}
