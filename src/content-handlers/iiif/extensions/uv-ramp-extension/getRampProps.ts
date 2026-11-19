type Obj = Record<string, any>;

export function stripNil<T extends Obj>(obj: T): Partial<T> {
  const out: Obj = {};
  for (const [k, v] of Object.entries(obj ?? {})) {
    if (v === null || v === undefined) continue;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = stripNil(v);
    } else {
      out[k] = v;
    }
  }
  return out as Partial<T>;
}


// Runtime values 
export interface RampRuntime {
  manifest?: object;           
  manifestUrl?: string;
  startCanvasId?: string;       
  startCanvasTime?: number;     
  playerID: string;             
  transcripts?: { canvasId: number; items: { title: string; url: string }[] }[];
  searchCallbacks?: { matcher?: Function; sorter?: Function };
}

export interface RampModuleConfig {
  options: Obj;
  content: Obj;
}

export function getRampProps(config: RampModuleConfig, rt: RampRuntime) {
  const o = config.options ?? {};
  const c = config.content ?? {};

  const { enabled: searchEnabled, ...searchOpts } = o.transcript?.search ?? {};
  const search =
    searchEnabled === false
      ? false
      : { ...stripNil(searchOpts), ...(rt.searchCallbacks ?? {}) };

  return {
    iiifPlayer: stripNil({
      manifestUrl: rt.manifestUrl,
      manifest: rt.manifest,
      startCanvasId: rt.startCanvasId,
      startCanvasTime: rt.startCanvasTime,
      customErrorMessage: c.iiifPlayer?.customErrorMessage,
      emptyManifestMessage: c.iiifPlayer?.emptyManifestMessage,
    }),

    mediaPlayer: stripNil(o.mediaPlayer),

    structuredNavigation: stripNil({
      ...o.structuredNavigation,
      sectionsHeading: c.structuredNavigation?.sectionsHeading,
    }),

    transcript: stripNil({
      playerID: rt.playerID,
      manifestUrl: rt.manifestUrl,
      transcripts: rt.transcripts,
      showMetadata: o.transcript?.showMetadata,
      showNotes: o.transcript?.showNotes,
      showMoreSettings: o.transcript?.showMoreSettings,
      search,
    }),

    annotations: stripNil({
      ...o.annotations,
      headingText: c.annotations?.headingText,
    }),

    autoAdvanceToggle: stripNil({
      ...o.autoAdvanceToggle,
      label: c.autoAdvanceToggle?.label,
    }),

    //for replacing UV metadata component later
    metadataDisplay: stripNil({
      ...o.metadataDisplay,
      itemHeading: c.metadataDisplay?.itemHeading,
      sectionHeading: c.metadataDisplay?.sectionHeading,
    }),

  };
}