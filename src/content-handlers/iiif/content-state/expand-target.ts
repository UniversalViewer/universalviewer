import { ExternalWebResource, W3CAnnotationTarget } from "@iiif/presentation-3";
import { SupportedSelectors } from "./selector-extensions";
import { parseSelector } from "./parse-selector";

export type SupportedTarget = {
  type: "SpecificResource";
  source:
    | ExternalWebResource
    | {
        id: string;
        type: "Unknown" | "Canvas" | "Range" | "Manifest";
        partOf?: Array<{ id: string; type: string }>;
      };
  purpose?: string;
  selector: SupportedSelectors | null;
  selectors: SupportedSelectors[];
};

export function expandTarget(
  target: W3CAnnotationTarget | W3CAnnotationTarget[],
  options: {
    typeMap?: Record<string, string>;
  } = {}
): SupportedTarget {
  if (Array.isArray(target)) {
    // Don't support multiple targets for now.
    return expandTarget(target[0]);
  }

  if (typeof target === "string") {
    const [id, fragment] = target.split("#");

    if (!fragment) {
      // This is an unknown selector.
      return {
        type: "SpecificResource",
        source: {
          id,
          type: (options.typeMap && (options.typeMap[id] as any)) || "Unknown",
        },
        selector: null,
        selectors: [],
      };
    }

    return expandTarget({
      type: "SpecificResource",
      source: { id, type: "Unknown" },
      selector: {
        type: "FragmentSelector",
        value: fragment,
      },
    });
  }

  // @todo, how do we want to support choices for targets.
  if (
    target.type === "Choice" ||
    target.type === "List" ||
    target.type === "Composite" ||
    target.type === "Independents"
  ) {
    // we also don't support these, just choose the first.
    return expandTarget(target.items[0]);
  }

  if (target.type === "SpecificResource") {
    if (
      target.source.type === "Canvas" &&
      target.source.partOf &&
      typeof target.source.partOf === "string"
    ) {
      target.source.partOf = [
        {
          id: target.source.partOf,
          type: "Manifest",
        },
      ];
    }

    const { selector, selectors } = target.selector
      ? parseSelector(target.selector)
      : { selector: null, selectors: [] };

    return {
      type: "SpecificResource",
      source: target.source,
      selector,
      selectors,
    };
  }

  if (target.id) {
    if (
      (target as any).type === "Canvas" &&
      (target as any).partOf &&
      typeof (target as any).partOf === "string"
    ) {
      (target as any).partOf = [
        {
          id: (target as any).partOf,
          type: "Manifest",
        },
      ];
    }

    const [id, fragment] = target.id.split("#");
    if (!fragment) {
      // This is an unknown selector.
      return {
        type: "SpecificResource",
        source: {
          ...(target as any),
          id,
        },
        selector: null,
        selectors: [],
      };
    }

    return expandTarget({
      type: "SpecificResource",
      source: {
        ...(target as any),
        id,
      },
      selector: {
        type: "FragmentSelector",
        value: fragment,
      },
    });
  }

  return {
    type: "SpecificResource",
    source: target as ExternalWebResource,
    selector: null,
    selectors: [],
  };
}
