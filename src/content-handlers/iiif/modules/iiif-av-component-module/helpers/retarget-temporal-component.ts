import { Utils, Canvas } from "manifesto.js";

export function retargetTemporalComponent(
  canvases: Canvas[],
  target: string
): string | undefined {
  const t: number[] | null = Utils.getTemporalComponent(target);

  if (t) {
    let offset = 0;
    const targetWithoutTemporal: string = target.substr(0, target.indexOf("#"));

    // loop through canvases adding up their durations until we reach the targeted canvas
    for (let i = 0; i < canvases.length; i++) {
      const canvas: Canvas = canvases[i];
      if (!canvas.id.includes(targetWithoutTemporal)) {
        const duration: number | null = canvas.getDuration();
        if (duration) {
          offset += duration;
        }
      } else {
        // we've reached the canvas whose target we're adjusting
        break;
      }
    }

    t[0] = Number(t[0]) + offset;
    t[1] = Number(t[1]) + offset;

    return targetWithoutTemporal + "#t=" + t[0] + "," + t[1];
  }

  return undefined;
}
