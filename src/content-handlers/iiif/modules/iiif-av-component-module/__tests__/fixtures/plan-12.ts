import { TimePlan } from "../../src/types/time-plan";

// http://localhost:8002/examples/template.html#?manifest=http%3A%2F%2Flocalhost%3A8002%2Fexamples%2Fbl-json%2F12.json&c=&m=&s=&cv=
export const plan12: TimePlan = {
  type: "time-plan",
  canvases: [
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000005",
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000004",
  ],
  duration: 5642.48,
  items: [
    {
      type: "time-plan",
      canvases: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000005",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000004",
      ],
      duration: 5642.48,
      items: [
        {
          type: "time-stop",
          canvasIndex: 0,
          start: 0,
          end: 2823.24,
          duration: 2823.24,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000005#t=0.00,2823.24",
          canvasTime: {
            start: 0,
            end: 2823.24,
          },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
          ],
        },
        {
          type: "time-stop",
          canvasIndex: 1,
          start: 2823.24,
          end: 5642.48,
          duration: 2819.24,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000004#t=0.00,2819.24",
          canvasTime: {
            start: 0,
            end: 2819.24,
          },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
          ],
        },
      ],
      stops: [
        {
          type: "time-stop",
          canvasIndex: 0,
          start: 0,
          end: 2823.24,
          duration: 2823.24,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000005#t=0.00,2823.24",
          canvasTime: {
            start: 0,
            end: 2823.24,
          },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
          ],
        },
        {
          type: "time-stop",
          canvasIndex: 1,
          start: 2823.24,
          end: 5642.48,
          duration: 2819.24,
          rangeId:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
          rawCanvasSelector:
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000004#t=0.00,2819.24",
          canvasTime: {
            start: 0,
            end: 2819.24,
          },
          rangeStack: [
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000002/top",
            "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
          ],
        },
      ],
      rangeOrder: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
      ],
      end: 5642.48,
      start: 0,
      rangeId:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
      rangeStack: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000002/top",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
      ],
    },
  ],
  stops: [
    {
      type: "time-stop",
      canvasIndex: 0,
      start: 0,
      end: 2823.24,
      duration: 2823.24,
      rangeId:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
      rawCanvasSelector:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000005#t=0.00,2823.24",
      canvasTime: {
        start: 0,
        end: 2823.24,
      },
      rangeStack: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000002/top",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
      ],
    },
    {
      type: "time-stop",
      canvasIndex: 1,
      start: 2823.24,
      end: 5642.48,
      duration: 2819.24,
      rangeId:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
      rawCanvasSelector:
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000004#t=0.00,2819.24",
      canvasTime: {
        start: 0,
        end: 2819.24,
      },
      rangeStack: [
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000002/top",
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
      ],
    },
  ],
  rangeOrder: [
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000002/top",
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006",
  ],
  end: 5642.48,
  start: 0,
  rangeId:
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000002/top",
  rangeStack: [
    "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000002/top",
  ],
} as any;
