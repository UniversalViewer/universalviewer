import { TimePlan } from "../../src/types/time-plan";

// http://localhost:8002/examples/template.html#?manifest=http%3A%2F%2Flocalhost%3A8002%2Fexamples%2Fbl-json%2F29.json&c=&m=&s=&cv=
export const plan29: TimePlan = {
  type: "time-plan",
  canvases: [
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000004",
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000004",
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000005",
  ],
  duration: 519,
  items: [
    {
      type: "time-plan",
      canvases: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000004",
      ],
      duration: 224.68,
      items: [
        {
          type: "time-stop",
          canvasIndex: 0,
          start: 0,
          end: 224.68,
          duration: 224.68,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000006",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000004#t=0.00,224.68",
          canvasTime: { start: 0, end: 224.68 },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000006",
          ],
        },
      ],
      stops: [
        {
          type: "time-stop",
          canvasIndex: 0,
          start: 0,
          end: 224.68,
          duration: 224.68,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000006",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000004#t=0.00,224.68",
          canvasTime: { start: 0, end: 224.68 },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000006",
          ],
        },
      ],
      rangeOrder: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000006",
      ],
      end: 224.68,
      start: 0,
      rangeId:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000006",
      rangeStack: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000006",
      ],
    },
    {
      type: "time-plan",
      canvases: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000004",
      ],
      duration: 120.68,
      items: [
        {
          type: "time-stop",
          canvasIndex: 0,
          start: 224.68,
          end: 345.36,
          duration: 120.68,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000008",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000004#t=224.68,345.36",
          canvasTime: { start: 224.68, end: 345.36 },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000008",
          ],
        },
      ],
      stops: [
        {
          type: "time-stop",
          canvasIndex: 0,
          start: 224.68,
          end: 345.36,
          duration: 120.68,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000008",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000004#t=224.68,345.36",
          canvasTime: { start: 224.68, end: 345.36 },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000008",
          ],
        },
      ],
      rangeOrder: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000008",
      ],
      end: 345.36,
      start: 224.68,
      rangeId:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000008",
      rangeStack: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000008",
      ],
    },
    {
      type: "time-plan",
      canvases: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000005",
      ],
      duration: 173.64,
      items: [
        {
          type: "time-stop",
          canvasIndex: 0,
          start: 345.36,
          end: 519,
          duration: 173.64,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x00000a",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000005#t=0.00,173.64",
          canvasTime: { start: 0, end: 173.64 },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x00000a",
          ],
        },
      ],
      stops: [
        {
          type: "time-stop",
          canvasIndex: 0,
          start: 345.36,
          end: 519,
          duration: 173.64,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x00000a",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000005#t=0.00,173.64",
          canvasTime: { start: 0, end: 173.64 },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x00000a",
          ],
        },
      ],
      rangeOrder: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x00000a",
      ],
      end: 519,
      start: 345.36,
      rangeId:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x00000a",
      rangeStack: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x00000a",
      ],
    },
  ],
  stops: [
    {
      type: "time-stop",
      canvasIndex: 0,
      start: 0,
      end: 224.68,
      duration: 224.68,
      rangeId:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000006",
      rawCanvasSelector:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000004#t=0.00,224.68",
      canvasTime: { start: 0, end: 224.68 },
      rangeStack: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000006",
      ],
    },
    {
      type: "time-stop",
      canvasIndex: 1,
      start: 224.68,
      end: 345.36,
      duration: 120.68,
      rangeId:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000008",
      rawCanvasSelector:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000004#t=224.68,345.36",
      canvasTime: { start: 224.68, end: 345.36 },
      rangeStack: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000008",
      ],
    },
    {
      type: "time-stop",
      canvasIndex: 2,
      start: 345.36,
      end: 519,
      duration: 173.64,
      rangeId:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x00000a",
      rawCanvasSelector:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000005#t=0.00,173.64",
      canvasTime: { start: 0, end: 173.64 },
      rangeStack: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x00000a",
      ],
    },
  ],
  rangeOrder: [
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000006",
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000008",
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x00000a",
  ],
  end: 519,
  start: 0,
  rangeId:
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
  rangeStack: [
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100093652072.0x000002/top",
  ],
} as any;
