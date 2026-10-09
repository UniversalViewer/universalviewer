import {
  choosePosterImages,
  mediaThumbnail,
} from "../src/content-handlers/iiif/modules/uv-shared-module/PosterImages";

// The images shown with audio and video: before playback (a placeholder, as
// in IIIF Cookbook recipe 0013) and while it plays (an accompanying image, as
// in recipe 0014).
describe("choosePosterImages", () => {
  // A canvas showing an image, as a placeholderCanvas or accompanyingCanvas.
  const imageCanvas = (name: string, size = { width: 640, height: 360 }) => ({
    id: `https://example.org/${name}`,
    type: "Canvas",
    ...size,
    items: [
      {
        id: `https://example.org/${name}/page`,
        type: "AnnotationPage",
        items: [
          {
            id: `https://example.org/${name}/page/annotation`,
            type: "Annotation",
            motivation: "painting",
            body: {
              id: `https://example.org/${name}.jpg`,
              type: "Image",
              format: "image/jpeg",
              ...size,
            },
            target: `https://example.org/${name}`,
          },
        ],
      },
    ],
  });

  // A canvas of audio or video, with the given properties, and those given
  // for its painting annotation.
  const mediaCanvas = (properties: object = {}, annotation: object = {}) => ({
    id: "https://example.org/canvas",
    type: "Canvas",
    duration: 60,
    ...properties,
    items: [
      {
        id: "https://example.org/canvas/page",
        type: "AnnotationPage",
        items: [
          {
            id: "https://example.org/canvas/page/annotation",
            type: "Annotation",
            motivation: "painting",
            body: {
              id: "https://example.org/media.mp4",
              type: "Sound",
              format: "audio/mp4",
            },
            target: "https://example.org/canvas",
            ...annotation,
          },
        ],
      },
    ],
  });

  const manifest = (properties: object = {}) => ({
    id: "https://example.org/manifest",
    type: "Manifest",
    ...properties,
  });

  const image = (name: string) => ({
    id: `https://example.org/${name}.jpg`,
    width: 640,
    height: 360,
  });

  const choose = (
    canvas: object,
    { video = false, manifestProperties = {} } = {}
  ) =>
    choosePosterImages({
      manifest: manifest(manifestProperties),
      canvas,
      isVideo: video,
    });

  it("shows nothing without an image", () => {
    expect(choose(mediaCanvas())).toEqual({
      beforePlay: null,
      whilePlaying: null,
    });
  });

  describe("a placeholderCanvas (recipe 0013)", () => {
    const canvas = mediaCanvas({
      placeholderCanvas: imageCanvas("placeholder"),
    });

    it("is shown before video plays, and gives way to the video", () => {
      expect(choose(canvas, { video: true })).toEqual({
        beforePlay: image("placeholder"),
        whilePlaying: null,
      });
    });

    it("is kept while audio plays, which has no picture of its own", () => {
      expect(choose(canvas)).toEqual({
        beforePlay: image("placeholder"),
        whilePlaying: image("placeholder"),
      });
    });
  });

  describe("an accompanyingCanvas (recipe 0014)", () => {
    const canvas = mediaCanvas({
      accompanyingCanvas: imageCanvas("accompanying"),
    });

    it("is shown before and while audio plays", () => {
      expect(choose(canvas)).toEqual({
        beforePlay: image("accompanying"),
        whilePlaying: image("accompanying"),
      });
    });

    it("is shown before and while video plays", () => {
      expect(choose(canvas, { video: true })).toEqual({
        beforePlay: image("accompanying"),
        whilePlaying: image("accompanying"),
      });
    });
  });

  it("shows a placeholder before playback, then the accompanying image", () => {
    const canvas = mediaCanvas({
      placeholderCanvas: imageCanvas("placeholder"),
      accompanyingCanvas: imageCanvas("accompanying"),
    });
    expect(choose(canvas)).toEqual({
      beforePlay: image("placeholder"),
      whilePlaying: image("accompanying"),
    });
    expect(choose(canvas, { video: true })).toEqual({
      beforePlay: image("placeholder"),
      whilePlaying: image("accompanying"),
    });
  });

  describe("the manifest's images", () => {
    it("are used when the canvas has none", () => {
      expect(
        choose(mediaCanvas(), {
          manifestProperties: {
            placeholderCanvas: imageCanvas("manifest-placeholder"),
            accompanyingCanvas: imageCanvas("manifest-accompanying"),
          },
        })
      ).toEqual({
        beforePlay: image("manifest-placeholder"),
        whilePlaying: image("manifest-accompanying"),
      });
    });

    it("give way to the canvas' own", () => {
      const manifestProperties = {
        placeholderCanvas: imageCanvas("manifest-placeholder"),
        accompanyingCanvas: imageCanvas("manifest-accompanying"),
      };
      expect(
        choose(mediaCanvas({ placeholderCanvas: imageCanvas("placeholder") }), {
          manifestProperties,
        })
      ).toEqual({
        beforePlay: image("placeholder"),
        whilePlaying: image("placeholder"),
      });
      expect(
        choose(
          mediaCanvas({ accompanyingCanvas: imageCanvas("accompanying") }),
          { manifestProperties }
        )
      ).toEqual({
        beforePlay: image("accompanying"),
        whilePlaying: image("accompanying"),
      });
    });
  });

  // posterCanvas, the name for placeholderCanvas in drafts of IIIF
  // Presentation 3, is still found on manifests (e.g. the British Library's
  // early AV manifests), so is read as the manifest's placeholderCanvas.
  describe("a manifest's posterCanvas", () => {
    const manifestProperties = { posterCanvas: imageCanvas("poster") };

    it("is shown before and while audio plays", () => {
      expect(choose(mediaCanvas(), { manifestProperties })).toEqual({
        beforePlay: image("poster"),
        whilePlaying: image("poster"),
      });
    });

    it("is shown before video plays, and gives way to the video", () => {
      expect(
        choose(mediaCanvas(), { video: true, manifestProperties })
      ).toEqual({ beforePlay: image("poster"), whilePlaying: null });
    });

    it("gives way to a placeholderCanvas", () => {
      expect(
        choose(mediaCanvas(), {
          manifestProperties: {
            ...manifestProperties,
            placeholderCanvas: imageCanvas("manifest-placeholder"),
          },
        }).beforePlay
      ).toEqual(image("manifest-placeholder"));
    });
  });

  describe("thumbnails", () => {
    const v3Thumbnail = (name: string) => [
      {
        id: `https://example.org/${name}.jpg`,
        type: "Image",
        format: "image/jpeg",
        width: 640,
        height: 360,
      },
    ];

    it("use the painting annotation's, as a URL", () => {
      const canvas = mediaCanvas(
        {},
        { thumbnail: "https://example.org/annotation-thumbnail.jpg" }
      );
      const thumbnail = { id: "https://example.org/annotation-thumbnail.jpg" };
      expect(choose(canvas)).toEqual({
        beforePlay: thumbnail,
        whilePlaying: thumbnail,
      });
    });

    it("use the painting annotation's, as IIIF v3 images", () => {
      const canvas = mediaCanvas(
        {},
        { thumbnail: v3Thumbnail("annotation-thumbnail") }
      );
      expect(choose(canvas)).toEqual({
        beforePlay: image("annotation-thumbnail"),
        whilePlaying: image("annotation-thumbnail"),
      });
    });

    it("use the canvas', as IIIF v3 images", () => {
      const canvas = mediaCanvas({
        thumbnail: v3Thumbnail("canvas-thumbnail"),
      });
      expect(choose(canvas)).toEqual({
        beforePlay: image("canvas-thumbnail"),
        whilePlaying: image("canvas-thumbnail"),
      });
    });

    it("use the canvas' in a IIIF v2 manifest, as a URL or an image", () => {
      const v2Canvas = (thumbnail: unknown) => ({
        "@id": "https://example.org/canvas",
        "@type": "sc:Canvas",
        thumbnail,
      });
      const thumbnail = { id: "https://example.org/canvas-thumbnail.jpg" };
      expect(
        choose(v2Canvas("https://example.org/canvas-thumbnail.jpg"))
      ).toEqual({ beforePlay: thumbnail, whilePlaying: thumbnail });
      expect(
        choose(v2Canvas({ "@id": "https://example.org/canvas-thumbnail.jpg" }))
      ).toEqual({ beforePlay: thumbnail, whilePlaying: thumbnail });
    });

    it("prefer the painting annotation's to the canvas'", () => {
      const canvas = mediaCanvas(
        { thumbnail: v3Thumbnail("canvas-thumbnail") },
        { thumbnail: v3Thumbnail("annotation-thumbnail") }
      );
      expect(choose(canvas).beforePlay).toEqual(image("annotation-thumbnail"));
    });

    it("give way to placeholder and accompanying images", () => {
      const thumbnail = { thumbnail: v3Thumbnail("canvas-thumbnail") };
      expect(
        choose(
          mediaCanvas({
            ...thumbnail,
            placeholderCanvas: imageCanvas("placeholder"),
          })
        ).beforePlay
      ).toEqual(image("placeholder"));
      expect(
        choose(mediaCanvas(thumbnail), {
          manifestProperties: {
            accompanyingCanvas: imageCanvas("manifest-accompanying"),
          },
        }).beforePlay
      ).toEqual(image("manifest-accompanying"));
    });

    it("are shown before video plays, and give way to the video", () => {
      const canvas = mediaCanvas({
        thumbnail: v3Thumbnail("canvas-thumbnail"),
      });
      expect(choose(canvas, { video: true })).toEqual({
        beforePlay: image("canvas-thumbnail"),
        whilePlaying: null,
      });
    });
  });

  it("sizes an image by its canvas when it has no size of its own", () => {
    const canvas = imageCanvas("placeholder");
    delete (canvas.items[0].items[0].body as any).width;
    delete (canvas.items[0].items[0].body as any).height;
    expect(
      choose(mediaCanvas({ placeholderCanvas: canvas })).beforePlay
    ).toEqual(image("placeholder"));
  });
});

// The thumbnail for a canvas of audio or video: the image shown before it
// plays (see choosePosterImages), or none, with the kind of media for an
// icon. A canvas of anything else keeps the thumbnail manifesto gives it.
describe("mediaThumbnail", () => {
  const manifest = { id: "https://example.org/manifest", type: "Manifest" };
  const canvas = (body: object, properties: object = {}) => ({
    id: "https://example.org/canvas",
    type: "Canvas",
    ...properties,
    items: [
      {
        id: "https://example.org/canvas/page",
        type: "AnnotationPage",
        items: [
          {
            id: "https://example.org/canvas/page/annotation",
            type: "Annotation",
            motivation: "painting",
            body: { id: "https://example.org/media", ...body },
          },
        ],
      },
    ],
  });

  it("has no image, and is audio, for audio without any", () => {
    expect(
      mediaThumbnail({ manifest, canvas: canvas({ type: "Sound" }) })
    ).toEqual({ uri: null, kind: "audio" });
  });

  it("is the canvas' thumbnail", () => {
    expect(
      mediaThumbnail({
        manifest,
        canvas: canvas(
          { type: "Video" },
          {
            thumbnail: [{ id: "https://example.org/thumb.jpg", type: "Image" }],
          }
        ),
      })
    ).toEqual({ uri: "https://example.org/thumb.jpg", kind: "video" });
  });

  it("is the image shown before the media plays", () => {
    const placeholderCanvas = {
      id: "https://example.org/placeholder",
      type: "Canvas",
      width: 640,
      height: 360,
      items: [
        {
          id: "https://example.org/placeholder/page",
          type: "AnnotationPage",
          items: [
            {
              id: "https://example.org/placeholder/page/annotation",
              type: "Annotation",
              motivation: "painting",
              body: {
                id: "https://example.org/placeholder.jpg",
                type: "Image",
              },
            },
          ],
        },
      ],
    };
    expect(
      mediaThumbnail({
        manifest,
        canvas: canvas({ type: "Sound" }, { placeholderCanvas }),
      })
    ).toEqual({ uri: "https://example.org/placeholder.jpg", kind: "audio" });
  });

  it("leaves a canvas of an image alone", () => {
    expect(
      mediaThumbnail({
        manifest,
        canvas: canvas({ type: "Image", format: "image/jpeg" }),
      })
    ).toBeUndefined();
  });
});
