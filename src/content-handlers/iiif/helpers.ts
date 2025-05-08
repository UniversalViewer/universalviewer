import {
  ContentState,
  normaliseContentState,
  NormalisedContentState,
  parseContentState,
} from "./content-state/content-state";
export function parseContentStateParameter(
  contentState?: ContentState | string
):
  | NormalisedContentState
  | { type: "remote-content-state"; id: string }
  | null {
  if (!contentState) {
    return null;
  }

  if (typeof contentState === "string" && contentState.startsWith("http")) {
    return { type: "remote-content-state", id: contentState };
  }

  try {
    return normaliseContentState(
      typeof contentState === "string"
        ? parseContentState(contentState)
        : contentState
    );
  } catch (err) {
    return null;
  }
}
