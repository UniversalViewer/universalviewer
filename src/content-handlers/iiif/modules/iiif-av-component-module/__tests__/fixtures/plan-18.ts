import { TimePlan } from "../../src/types/time-plan";

// http://localhost:8002/examples/template.html#?manifest=http%3A%2F%2Flocalhost%3A8002%2Fexamples%2Fbl-json%2F18.json&c=&m=&s=&cv=
export const plan18: TimePlan = {
  type: "time-plan",
  canvases: [
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000004",
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000004",
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000006",
  ],
  duration: 2667.8,
  items: [
    {
      type: "time-plan",
      canvases: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000004",
      ],
      duration: 88.12,
      items: [
        {
          type: "time-stop",
          canvasIndex: 0,
          start: 0,
          end: 88.12,
          duration: 88.12,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000007",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000004#t=0.00,88.12",
          canvasTime: { start: 0, end: 88.12 },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000007",
          ],
        },
      ],
      stops: [
        {
          type: "time-stop",
          canvasIndex: 0,
          start: 0,
          end: 88.12,
          duration: 88.12,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000007",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000004#t=0.00,88.12",
          canvasTime: { start: 0, end: 88.12 },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000007",
          ],
        },
      ],
      rangeOrder: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000007",
      ],
      end: 88.12,
      start: 0,
      rangeId:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000007",
      rangeStack: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000007",
      ],
    },
    {
      type: "time-plan",
      canvases: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000004",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000006",
      ],
      duration: 2579.6800000000003,
      items: [
        {
          type: "time-stop",
          canvasIndex: 0,
          start: 88.11999999999989,
          end: 1815.04,
          duration: 1726.92,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000004#t=88.12,1815.04",
          canvasTime: { start: 88.12, end: 1815.04 },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
          ],
        },
        {
          type: "time-stop",
          canvasIndex: 1,
          start: 1815.0400000000002,
          end: 2667.8,
          duration: 852.76,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000006#t=0.00,852.76",
          canvasTime: { start: 0, end: 852.76 },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
          ],
        },
      ],
      stops: [
        {
          type: "time-stop",
          canvasIndex: 0,
          start: 88.11999999999989,
          end: 1815.04,
          duration: 1726.92,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000004#t=88.12,1815.04",
          canvasTime: { start: 88.12, end: 1815.04 },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
          ],
        },
        {
          type: "time-stop",
          canvasIndex: 1,
          start: 1815.0400000000002,
          end: 2667.8,
          duration: 852.76,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000006#t=0.00,852.76",
          canvasTime: { start: 0, end: 852.76 },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
          ],
        },
      ],
      rangeOrder: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
      ],
      end: 2667.8,
      start: 88.12,
      rangeId:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
      rangeStack: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
      ],
    },
  ],
  stops: [
    {
      type: "time-stop",
      canvasIndex: 0,
      start: 0,
      end: 88.12,
      duration: 88.12,
      rangeId:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000007",
      rawCanvasSelector:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000004#t=0.00,88.12",
      canvasTime: { start: 0, end: 88.12 },
      rangeStack: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000007",
      ],
    },
    {
      type: "time-stop",
      canvasIndex: 1,
      start: 88.11999999999989,
      end: 1815.04,
      duration: 1726.92,
      rangeId:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
      rawCanvasSelector:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000004#t=88.12,1815.04",
      canvasTime: { start: 88.12, end: 1815.04 },
      rangeStack: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
      ],
    },
    {
      type: "time-stop",
      canvasIndex: 2,
      start: 1815.0400000000002,
      end: 2667.8,
      duration: 852.76,
      rangeId:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
      rawCanvasSelector:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000006#t=0.00,852.76",
      canvasTime: { start: 0, end: 852.76 },
      rangeStack: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
      ],
    },
  ],
  rangeOrder: [
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000007",
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
  ],
  end: 2667.8,
  start: 0,
  rangeId:
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
  rangeStack: [
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
  ],
} as any;
