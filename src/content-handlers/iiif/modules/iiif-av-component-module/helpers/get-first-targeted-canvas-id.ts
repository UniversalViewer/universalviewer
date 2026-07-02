import { Range, Utils } from "manifesto.js";

export function getFirstTargetedCanvasId(range: Range): string | undefined {
  let canvasId: string | undefined;

  if (range.canvases && range.canvases.length) {
    canvasId = range.canvases[0];
  } else {
    const childRanges: Range[] = range.getRanges();

    if (childRanges.length) {
      return getFirstTargetedCanvasId(childRanges[0]);
    }
  }

  if (canvasId !== undefined) {
    return Utils.normaliseUrl(canvasId);
  }

  return undefined;
}
