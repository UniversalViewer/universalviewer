import { canvasMediaKind, paintingAnnotations } from "./MediaKind";

// An image shown with audio or video, and its size where known.
export interface PosterImage {
  id: string;
  width?: number;
  height?: number;
}

// The images shown with audio or video: before it plays, and while it plays
// (null for none).
export interface PosterImages {
  beforePlay: PosterImage | null;
  whilePlaying: PosterImage | null;
}

// The id of a JSON-LD resource, IIIF v3 ("id") or v2 ("@id").
const idOf = (resource: any): string | undefined =>
  resource && (resource.id || resource["@id"]);

// The image a thumbnail gives: a URL (as in IIIF v2), an image, or a list of
// images (as in IIIF v3), of which the first is used.
const thumbnailImage = (thumbnail: any): PosterImage | null => {
  const first = Array.isArray(thumbnail) ? thumbnail[0] : thumbnail;
  if (typeof first === "string") {
    return { id: first };
  }
  const id = idOf(first);
  if (!id) {
    return null;
  }
  const image: PosterImage = { id };
  if (first.width && first.height) {
    image.width = first.width;
    image.height = first.height;
  }
  return image;
};

// The image a placeholderCanvas or accompanyingCanvas shows: the body of its
// first painting annotation (the first of a list or Choice), sized by itself
// or else by the canvas.
const canvasImage = (canvas: any): PosterImage | null => {
  const annotation = paintingAnnotations(canvas)[0];
  let body = annotation && annotation.body;
  if (Array.isArray(body)) {
    body = body[0];
  }
  if (body && Array.isArray(body.items)) {
    body = body.items[0];
  }
  const id = idOf(body);
  if (!id) {
    return null;
  }
  const width = body.width || canvas.width;
  const height = body.height || canvas.height;
  return width && height ? { id, width, height } : { id };
};

const first = (
  ...images: Array<() => PosterImage | null>
): PosterImage | null => {
  for (const image of images) {
    const found = image();
    if (found) {
      return found;
    }
  }
  return null;
};

// The images to show for a canvas of audio or video, given the raw JSON-LD
// of the manifest and canvas. The canvas' own placeholderCanvas (IIIF
// Cookbook recipe 0013) and accompanyingCanvas (recipe 0014) come first,
// then the manifest's, then a thumbnail (the painting annotation's, else the
// canvas'):
// - Before playback, a placeholder comes before an accompanying image.
// - While audio plays, an accompanying image comes before a placeholder,
//   which is kept as audio has no picture of its own.
// - While video plays, only an accompanying image is shown, as the video
//   takes the place of a placeholder or thumbnail.
export const choosePosterImages = ({
  manifest,
  canvas,
  isVideo,
}: {
  manifest: any;
  canvas: any;
  isVideo: boolean;
}): PosterImages => {
  const placeholder = () => canvasImage(canvas && canvas.placeholderCanvas);
  const accompanying = () => canvasImage(canvas && canvas.accompanyingCanvas);
  // posterCanvas is the name for placeholderCanvas in drafts of IIIF
  // Presentation 3, still found on manifests (e.g. the British Library's
  // early AV manifests).
  const manifestPlaceholder = () =>
    first(
      () => canvasImage(manifest && manifest.placeholderCanvas),
      () => canvasImage(manifest && manifest.posterCanvas)
    );
  const manifestAccompanying = () =>
    canvasImage(manifest && manifest.accompanyingCanvas);
  const thumbnail = () =>
    first(
      () => {
        const annotation = paintingAnnotations(canvas)[0];
        return thumbnailImage(annotation && annotation.thumbnail);
      },
      () => thumbnailImage(canvas && canvas.thumbnail)
    );

  return {
    beforePlay: first(
      placeholder,
      accompanying,
      manifestPlaceholder,
      manifestAccompanying,
      thumbnail
    ),
    whilePlaying: isVideo
      ? first(accompanying, manifestAccompanying)
      : first(
          accompanying,
          placeholder,
          manifestAccompanying,
          manifestPlaceholder,
          thumbnail
        ),
  };
};

// The thumbnail for a canvas of audio or video: the image shown before it
// plays (see choosePosterImages), or null for none, and the kind of media,
// for an icon. undefined for a canvas of anything else (e.g. an image), which
// keeps the thumbnail manifesto gives it. (manifesto builds a thumbnail
// address from a canvas' image service, which audio and video don't have.)
export const mediaThumbnail = ({
  manifest,
  canvas,
}: {
  manifest: any;
  canvas: any;
}): { uri: string | null; kind: "audio" | "video" } | undefined => {
  const kind = canvasMediaKind(canvas);
  if (!kind) {
    return undefined;
  }
  const image = choosePosterImages({
    manifest,
    canvas,
    isVideo: kind === "video",
  }).beforePlay;
  return { uri: image ? image.id : null, kind };
};

// Gives the thumbnails of audio and video canvases their images (see
// mediaThumbnail), or none and the kind of media, for an icon. Thumbnails of
// other canvases are left as they are.
export const applyMediaThumbnails = (thumbs: any[], manifest: any): void => {
  thumbs.forEach((thumb) => {
    const media = mediaThumbnail({
      manifest,
      canvas: thumb.data && thumb.data.__jsonld,
    });
    if (media) {
      thumb.uri = media.uri || "";
      thumb.mediaKind = media.kind;
    }
  });
};
