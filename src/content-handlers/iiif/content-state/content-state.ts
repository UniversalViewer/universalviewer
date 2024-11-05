// https://github.com/digirati-co-uk/iiif-canvas-panel/blob/main/packages/canvas-panel/src/helpers/content-state/content-state.ts
import { Annotation } from "@iiif/presentation-3";
import { expandTarget, SupportedTarget } from "./expand-target";

export type ContentState =
  | string
  | (Annotation & { "@context"?: string })
  | (StateSource & { "@context"?: string })
  | Array<
      | string
      | (Annotation & { "@context"?: string })
      | (StateSource & { "@context"?: string })
    >;

export type StateSource = {
  id: string;
  type: "Manifest" | "Canvas" | "Range";
  partOf?:
    | string
    | { id: string; type: string }
    | Array<{
        id: string;
        type: string;
      }>;
};

// Normalised content state?
export type NormalisedContentState = {
  id: string;
  type: "Annotation";
  motivation: ["contentState", ...string[]];
  target: Array<SupportedTarget>;
  extensions: Record<string, any>;
};

type ValidationResponse =
  | readonly [false, { reason?: string }]
  | readonly [true];

export function validateContentState(
  annotation: ContentState,
  strict = false
): ValidationResponse {
  // Valid content state.
  if (typeof annotation === "string") {
    if (annotation.startsWith("{")) {
      try {
        const parsed = JSON.parse(annotation);
        return validateContentState(parsed);
      } catch (err) {
        return [false, { reason: "Invalid JSON" }];
      }
    }
    return [true];
  }

  if (Array.isArray(annotation)) {
    for (const anno of annotation) {
      const [valid, reason] = validateContentState(anno);
      if (!valid && reason) {
        return [valid as false, reason] as const;
      }
    }

    return [true];
  }

  if (annotation.type === "Annotation") {
    // We are validating the annotation.
    return [true];
  }

  if (strict && annotation.type === "Canvas" && !annotation.partOf) {
    return [false, { reason: "Canvas without partOf cannot be loaded" }];
  }

  return [true];
}

export function serialiseContentState(annotation: ContentState): string {
  return encodeContentState(
    typeof annotation === "string" ? annotation : JSON.stringify(annotation)
  );
}

export function parseContentState(state: string): ContentState;
export function parseContentState(state: string, async: false): ContentState;
export async function parseContentState(
  state: string,
  async: true
): Promise<ContentState>;
export function parseContentState(
  state: string,
  asyncOrFetcher?: boolean
): ContentState | Promise<ContentState> {
  state = state.trim();

  if (state[0] === "{") {
    // we might have json.
    return asyncOrFetcher
      ? Promise.resolve(JSON.parse(state))
      : JSON.parse(state);
  }

  if (state.startsWith("http")) {
    if (!asyncOrFetcher) {
      throw new Error(
        "Cannot fetch remote fetch with async=false in parseContentState"
      );
    }
    // resolve.
    return fetch(state).then((r) => r.json());
  }

  return parseContentState(decodeContentState(state), asyncOrFetcher as any);
}

export function encodeContentState(state: string): string {
  const uriEncoded = encodeURIComponent(state); // using built in function
  const base64 =
    typeof btoa === "undefined"
      ? Buffer.from(uriEncoded, "utf-8").toString("base64")
      : btoa(uriEncoded); // using built in function
  const base64url = base64.replace(/\+/g, "-").replace(/\//g, "_");
  return base64url.replace(/=/g, "");
}

export function decodeContentState(encodedContentState: string): string {
  const base64url = restorePadding(encodedContentState);
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const base64Decoded =
    typeof atob === "undefined"
      ? Buffer.from(base64, "base64").toString("utf-8")
      : atob(base64); // using built in function
  return decodeURIComponent(base64Decoded).trim(); // using built in function
}

function restorePadding(s: string) {
  // The length of the restored string must be a multiple of 4
  const pad = s.length % 4;

  if (pad === 1) {
    throw new Error(
      "InvalidLengthError: Input base64url string is the wrong length to determine padding"
    );
  }

  return s + (pad ? "====".slice(0, 4 - pad) : "");
}

export function normaliseContentState(
  state: ContentState
): NormalisedContentState {
  if (!state) {
    throw new Error("Content state is empty");
  }

  if (!Array.isArray(state)) {
    // We have multiples.
    // throw new Error('Content state is an [Array] and not yet supported');
    state = [state];
  }

  let annoId = "vault://virtual-annotation/" + new Date().getTime(); // <-- need a virtual id
  const motivation = ["contentState"];
  const targets: SupportedTarget[] = [];

  for (const source of state) {
    if (typeof source === "string") {
      // Note: this is unlikely to happen in conjunction with parseContentState()
      throw new Error(
        "Content state is a [String] type and cannot be inferred"
      );
    }

    // If we DO have annotation, then this is all we should be returning.
    if (source.type === "Annotation") {
      annoId = source.id;
      if (Array.isArray(source.motivation)) {
        for (const singleMotivation of source.motivation) {
          if (motivation.indexOf(singleMotivation) === -1) {
            motivation.push(singleMotivation);
          }
        }
      }

      if (Array.isArray(source.target)) {
        for (const target of source.target) {
          const expanded = expandTarget(target as any);
          targets.push(expanded);
        }
      } else {
        const expanded = expandTarget(source.target as any);
        targets.push(expanded);
      }

      continue;
    }

    const target = expandTarget(source as any);
    targets.push(target);
  }

  return {
    id: annoId,
    type: "Annotation",
    motivation: ["contentState", ...((state as any).motivation || [])],
    target: targets,
    extensions: {},
  };
}
