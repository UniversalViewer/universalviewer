import {
  canvasMediaKind,
  isVideoCanvas,
  mediaKind,
} from "../src/content-handlers/iiif/modules/uv-shared-module/MediaKind";

// Whether media is audio or video, which decides the player the MediaElement
// extension builds, the media element the AV component creates, and the
// images both show while it plays. In order: the body's type, else an
// audio/ or video/ format, else whether the body, or else its canvas, has a
// width and height (as video does, and audio doesn't, in IIIF Presentation
// 3), else audio.
describe("mediaKind", () => {
  const body = (properties: object) => ({
    id: "https://example.org/media",
    ...properties,
  });

  describe("goes by the body's type first", () => {
    it.each([
      ["Sound", "audio"],
      ["Audio", "audio"],
      ["dctypes:Sound", "audio"],
      ["Video", "video"],
      ["MovingImage", "video"],
      ["dctypes:MovingImage", "video"],
    ])("%s is %s", (type, kind) => {
      expect(mediaKind(body({ type }))).toBe(kind);
    });

    it("whatever its format: audio in an MP4 file (recipe 0014)", () => {
      expect(mediaKind(body({ type: "Sound", format: "video/mp4" }))).toBe(
        "audio"
      );
    });

    it("whatever its size", () => {
      expect(
        mediaKind(body({ type: "Sound", width: 640, height: 360 }), {
          width: 640,
          height: 360,
        })
      ).toBe("audio");
    });

    it("isn't audio or video for other types", () => {
      expect(mediaKind(body({ type: "Image", format: "image/jpeg" }))).toBe(
        null
      );
      expect(mediaKind(body({ type: "TextualBody" }))).toBe(null);
    });
  });

  describe("goes by an audio/ or video/ format without a type", () => {
    it.each([
      ["audio/mp4", "audio"],
      ["audio/mpeg", "audio"],
      // HLS, which may be audio or video
      ["audio/mpegurl", "audio"],
      ["audio/x-mpegurl", "audio"],
      ["video/mp4", "video"],
      ["video/webm", "video"],
      ["video/ogg", "video"],
      ["video/x-mpegurl", "video"],
    ])("%s is %s", (format, kind) => {
      expect(mediaKind(body({ format }))).toBe(kind);
    });

    it("whatever its size", () => {
      expect(
        mediaKind(body({ format: "audio/mp4" }), { width: 640, height: 360 })
      ).toBe("audio");
    });

    it("isn't audio or video for other formats", () => {
      expect(mediaKind(body({ format: "image/jpeg" }))).toBe(null);
      expect(mediaKind(body({ format: "text/vtt" }))).toBe(null);
      // e.g. a transcript offered as a rendering (IIIF Cookbook recipe 0017)
      expect(mediaKind(body({ format: "application/pdf" }))).toBe(null);
    });
  });

  // e.g. HLS (application/vnd.apple.mpegurl) or MPEG-DASH
  // (application/dash+xml), which may be audio or video.
  describe("goes by size when neither says", () => {
    const hls = { format: "application/vnd.apple.mpegurl" };
    const dash = { format: "application/dash+xml" };

    it("is video when the body has a width and height", () => {
      expect(mediaKind(body({ ...hls, width: 640, height: 360 }))).toBe(
        "video"
      );
    });

    it("is video when its canvas has a width and height", () => {
      expect(mediaKind(body(dash), { width: 640, height: 360 })).toBe("video");
    });

    it("is audio with neither, as an audio canvas has only a duration", () => {
      expect(mediaKind(body(hls), { duration: 60 })).toBe("audio");
      expect(mediaKind(body(dash))).toBe("audio");
      expect(mediaKind(body({}))).toBe("audio");
    });

    it("needs both a width and a height", () => {
      expect(mediaKind(body({ ...hls, width: 640 }))).toBe("audio");
    });
  });
});

// Whether a canvas' media is video.
describe("isVideoCanvas", () => {
  const annotation = (body: unknown) => ({
    id: "https://example.org/canvas/page/annotation",
    type: "Annotation",
    motivation: "painting",
    body,
  });
  const canvas = (body: unknown, properties: object = {}) => ({
    id: "https://example.org/canvas",
    type: "Canvas",
    ...properties,
    items: [
      {
        id: "https://example.org/canvas/page",
        type: "AnnotationPage",
        items: [annotation(body)],
      },
    ],
  });
  const media = (properties: object) => ({
    id: "https://example.org/media.mp4",
    ...properties,
  });

  it("follows mediaKind for the painting annotation's body", () => {
    expect(isVideoCanvas(canvas(media({ type: "Video" })))).toBe(true);
    expect(
      isVideoCanvas(canvas(media({ type: "Sound", format: "video/mp4" })))
    ).toBe(false);
    expect(
      isVideoCanvas(
        canvas(media({ format: "application/dash+xml" }), {
          width: 640,
          height: 360,
        })
      )
    ).toBe(true);
    expect(
      isVideoCanvas(
        canvas(media({ format: "application/dash+xml" }), { duration: 60 })
      )
    ).toBe(false);
  });

  it("is video when any of the painting annotation's bodies is", () => {
    expect(
      isVideoCanvas(
        canvas([media({ type: "Sound" }), media({ type: "Video" })])
      )
    ).toBe(true);
    expect(
      isVideoCanvas(
        canvas([
          {
            type: "Choice",
            items: [media({ type: "Sound" }), media({ format: "video/webm" })],
          },
        ])
      )
    ).toBe(true);
  });

  // Manifests from drafts of IIIF Presentation 3 (e.g. the British Library's
  // early AV manifests) give a canvas' annotation pages as "content", as
  // manifesto reads them.
  it("reads a draft IIIF Presentation 3 canvas' content", () => {
    expect(
      isVideoCanvas({
        id: "https://example.org/canvas",
        type: "Canvas",
        content: [
          {
            id: "https://example.org/canvas/page",
            type: "AnnotationPage",
            items: [annotation(media({ type: "Video" }))],
          },
        ],
      })
    ).toBe(true);
  });

  // IIIF v2 IxIF manifests (as Wellcome Collection's are) give their media as
  // elements of a media sequence, which manifesto offers as canvases.
  it("goes by a IIIF v2 IxIF element itself", () => {
    expect(
      isVideoCanvas({
        "@id": "https://example.org/video.mp4",
        "@type": "dctypes:MovingImage",
        format: "video/mp4",
      })
    ).toBe(true);
    expect(
      isVideoCanvas({
        "@id": "https://example.org/audio.mp4",
        "@type": "dctypes:Sound",
        format: "video/mp4",
      })
    ).toBe(false);
  });

  it("isn't video without media", () => {
    expect(isVideoCanvas({ id: "https://example.org/canvas" })).toBe(false);
    expect(isVideoCanvas(undefined)).toBe(false);
  });
});

// Whether a canvas' media is audio, video, or neither (e.g. an image).
describe("canvasMediaKind", () => {
  const canvas = (...bodies: object[]) => ({
    id: "https://example.org/canvas",
    type: "Canvas",
    items: [
      {
        id: "https://example.org/canvas/page",
        type: "AnnotationPage",
        items: bodies.map((body, n) => ({
          id: `https://example.org/canvas/page/annotation/${n}`,
          type: "Annotation",
          motivation: "painting",
          body: { id: `https://example.org/media/${n}`, ...body },
        })),
      },
    ],
  });

  it("is audio for a canvas of audio", () => {
    expect(canvasMediaKind(canvas({ type: "Sound" }))).toBe("audio");
  });

  it("is video for a canvas with any video", () => {
    expect(canvasMediaKind(canvas({ type: "Sound" }, { type: "Video" }))).toBe(
      "video"
    );
  });

  it("is neither for a canvas of an image", () => {
    expect(
      canvasMediaKind(canvas({ type: "Image", format: "image/jpeg" }))
    ).toBe(null);
  });

  it("goes by a IIIF v2 IxIF element itself", () => {
    expect(
      canvasMediaKind({
        "@id": "https://example.org/audio.mp4",
        "@type": "dctypes:Sound",
      })
    ).toBe("audio");
  });
});
