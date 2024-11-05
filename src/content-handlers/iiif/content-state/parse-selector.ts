import { SupportedSelectors, TemporalSelector } from "./selector-extensions";
import { Selector } from "@iiif/presentation-3";

export type ParsedSelector = {
  selector: SupportedSelectors | null;
  selectors: SupportedSelectors[];
};

const BOX_SELECTOR =
  /&?(xywh=)?(pixel:|percent:)?([0-9]+(?:\.[0-9]+)?),([0-9]+(?:\.[0-9]+)?),([0-9]+(?:\.[0-9]+)?),([0-9]+(?:\.[0-9]+)?)/;

// Does not support 00:00:00 or 00:00 formats.
const TEMPORAL_SELECTOR =
  /&?(t=)(npt:)?([0-9]+(.[0-9]+)?)?(,([0-9]+(.[0-9]+)?))?/;

export function parseSelector(source: Selector | Selector[]): ParsedSelector {
  if (Array.isArray(source)) {
    return (source as Array<string | Selector>).reduce(
      <ParseSelector>(data: ParsedSelector, nextSource: string | Selector) => {
        const { selector, selectors } = parseSelector(nextSource);
        if (selector) {
          if (!data.selector) {
            data.selector = selector;
          }
          data.selectors.push(...selectors);
        }
        return data;
      },
      {
        selector: null,
        selectors: [],
      } as ParsedSelector
    );
  }

  if (!source) {
    return {
      selector: null,
      selectors: [],
    };
  }

  if (typeof source === "string") {
    const [_id, fragment] = source.split("#");

    if (!fragment) {
      // This is an unknown selector.
      return {
        selector: null,
        selectors: [],
      };
    }

    return parseSelector({ type: "FragmentSelector", value: fragment });
  }

  if (source.type === "PointSelector" && (source.t || source.t === 0)) {
    const selector: TemporalSelector = {
      type: "TemporalSelector",
      startTime: source.t,
    };

    return {
      selector,
      selectors: [selector],
    };
  }

  if (source.type === "FragmentSelector") {
    const matchBoxSelector = BOX_SELECTOR.exec(source.value);
    if (matchBoxSelector) {
      const selector: SupportedSelectors = {
        type: "BoxSelector",
        unit: matchBoxSelector[2] === "percent:" ? "percent" : "pixel",
        x: parseFloat(matchBoxSelector[3]),
        y: parseFloat(matchBoxSelector[4]),
        width: parseFloat(matchBoxSelector[5]),
        height: parseFloat(matchBoxSelector[6]),
      };

      return {
        selector,
        selectors: [selector],
      };
    }

    const matchTimeSelector = source.value.match(TEMPORAL_SELECTOR);
    if (matchTimeSelector) {
      const selector: TemporalSelector = {
        type: "TemporalSelector",
        startTime: matchTimeSelector[4] ? parseFloat(matchTimeSelector[4]) : 0,
        endTime: matchTimeSelector[7]
          ? parseFloat(matchTimeSelector[7])
          : undefined,
      };

      return {
        selector,
        selectors: [selector],
      };
    }

    return {
      selector: null,
      selectors: [],
    };
  }

  return {
    selector: null,
    selectors: [],
  };
}
