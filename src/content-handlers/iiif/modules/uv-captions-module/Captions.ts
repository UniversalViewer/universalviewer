import { Annotation, Canvas, PropertyValue } from "manifesto.js";
import { CaptionTrack, orderCaptionTracks } from "./CaptionTrack";

const CAPTION_FORMATS = new Set(["text/vtt", "text/srt"]);

export const isCaptionFormat = (format: unknown): boolean =>
  CAPTION_FORMATS.has(String(format).toLowerCase());

// The label's value for the user's locale, chosen as manifesto chooses any
// label: an exact locale match (cy-GB), then the same base language (cy),
// then, as IIIF requires when no language matches, the values without a
// language, or else those of the first language. A label may be a plain
// string, a IIIF v3 language map or IIIF v2 language values.
export const captionLabel = (
  label: any,
  locale: string
): string | undefined => {
  try {
    return PropertyValue.parse(label).getValue(locale) ?? undefined;
  } catch {
    // A malformed label, e.g. a language map whose values aren't arrays.
    return undefined;
  }
};

// The part of the canvas an annotation targets, in seconds: from a
// "#t=start,end" media fragment on a target URL or FragmentSelector (either
// end may be omitted), or from a PointSelector's "t". A target without a
// temporal component covers the whole canvas.
export const targetTime = (
  target: any
): Pick<CaptionTrack, "start" | "end"> => {
  const selectors: any[] =
    target && target.selector ? [].concat(target.selector) : [];
  const fragments = [
    typeof target === "string" ? target : target && target.id,
    ...selectors.map((selector: any) => selector && selector.value),
  ];

  for (const fragment of fragments) {
    const match = /(?:^|[#&])t=(?:npt:)?([\d.]*)(?:,([\d.]+))?/.exec(
      fragment || ""
    );
    if (match && (match[1] || match[2])) {
      return {
        start: Number(match[1] || 0),
        end: match[2] ? Number(match[2]) : undefined,
      };
    }
  }

  const point = selectors.find(
    (selector: any) => selector && typeof selector.t === "number"
  );
  return { start: point ? point.t : 0, end: undefined };
};

// A caption track from a caption file's raw JSON, which may come from a
// canvas rendering or an annotation body, placed on the part of the canvas
// its annotation targets. Every caption source goes through here, so all are
// labelled, and placed on the canvas, the same way.
export const captionTrack = (
  json: any,
  locale: string,
  { start = 0, end }: Pick<CaptionTrack, "start" | "end"> = {}
): CaptionTrack => ({
  id: json.id || json["@id"],
  label: captionLabel(json.label, locale) ?? json.format,
  language: Array.isArray(json.language) ? json.language[0] : json.language,
  start,
  end,
});

// Caption files are fetched by the browser, so a cross-origin URL is only
// readable when every response hop carries CORS headers. Follow any
// CORS-friendly redirect to its final URL, and retry plain-http sources over
// https: an http -> https upgrade redirect whose 301 response lacks CORS
// headers is blocked by the browser even though its destination is readable.
export const resolveCaptionSource = async (src: string): Promise<string> => {
  const attempts: string[] = [src];

  if (src.startsWith("http://")) {
    attempts.push(src.replace(/^http:\/\//, "https://"));
  }

  for (const attempt of attempts) {
    try {
      const response = await fetch(attempt);
      if (response.ok) {
        return response.url;
      }
    } catch {
      // expected when the attempt is blocked by CORS or mixed content;
      // fall through to the next candidate
    }
  }

  console.warn(
    `Captions at ${src} could not be read (CORS headers are required on every response, including redirects); the player will omit this track.`
  );

  return src;
};

// The supplementing annotations in a canvas' annotation pages (IIIF cookbook
// recipe 0219). Inline pages are read directly; pages referenced by id alone
// are fetched.
const getSupplementingAnnotations = async (
  canvas: Canvas
): Promise<Annotation[]> => {
  const pages: any[] = [].concat(canvas.getProperty("annotations") || []);
  const annotations: Annotation[] = [];

  for (const page of pages) {
    let items: any[] | undefined = page.items;

    if (!items && page.id) {
      try {
        const response = await fetch(page.id);
        if (response.ok) {
          items = (await response.json()).items;
        }
      } catch {
        console.warn(
          `Annotation page ${page.id} could not be read (CORS headers are required); any captions it contains will be unavailable.`
        );
      }
    }

    for (const item of items || []) {
      const motivations: string[] = [].concat(item.motivation);
      if (motivations.includes("supplementing")) {
        annotations.push(new Annotation(item, canvas.options));
      }
    }
  }

  return annotations;
};

// Every caption track for a canvas, wherever the manifest declares it:
// - as a rendering of the canvas (as in IIIF cookbook recipe 0017, there for
//   a plain-text transcript);
// - as a body of the canvas' painting annotation, alongside the media. This
//   follows no cookbook recipe, but is supported for existing manifests;
// - as a supplementing annotation (IIIF cookbook recipe 0219), whose body may
//   be a Choice of caption files, e.g. one per language (recipe 0074).
// Labels follow the user's locale, and the tracks are listed as the captions
// menu offers them: the user's language first, then the rest alphabetically
// (orderCaptionTracks). Caption URLs are resolved to ones the browser can
// read, and a file declared more than once is listed once.
export const getCanvasCaptions = async (
  canvas: Canvas,
  locale: string
): Promise<CaptionTrack[]> => {
  const tracks: CaptionTrack[] = canvas
    .getRenderings()
    .map((rendering: any) => rendering.__jsonld)
    .filter((json: any) => isCaptionFormat(json.format))
    .map((json: any) => captionTrack(json, locale));

  const annotations: Annotation[] = [
    ...canvas.getContent(),
    ...(await getSupplementingAnnotations(canvas)),
  ];

  for (const annotation of annotations) {
    const time = targetTime(annotation.getTarget());

    for (const body of annotation.getBody()) {
      const json = body.__jsonld;
      if (json && isCaptionFormat(json.format)) {
        tracks.push(captionTrack(json, locale, time));
      }
    }
  }

  const unique = tracks.filter(
    (track, index) =>
      !!track.id && tracks.findIndex((t) => t.id === track.id) === index
  );

  for (const track of unique) {
    track.id = await resolveCaptionSource(track.id);
  }

  return orderCaptionTracks(unique, locale);
};
