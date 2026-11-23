import { useEffect, useRef } from "react";
import { useCanvasIndex } from "@samvera/ramp";
import { IIIFEvents } from "../../IIIFEvents";

export function UVSyncBridge({ extensionHost }: { extensionHost: any }) {
  const { canvasIndex } = useCanvasIndex();
  const lastCanvas = useRef<number | null>(null);

  useEffect(() => {
    if (canvasIndex == null) return;
    if (lastCanvas.current === null) {
      lastCanvas.current = canvasIndex;
      return;
    }
    if (canvasIndex !== lastCanvas.current) {
      lastCanvas.current = canvasIndex;
      extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, canvasIndex);
    }
  }, [canvasIndex]);

  return null;
}
