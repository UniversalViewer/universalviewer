import {
  BUILT_IN_CAPTION_STYLES,
  captionStyleId,
  captionStyles,
  chooseCaptionStyle,
  contrastRatio,
} from "../../src/content-handlers/iiif/modules/uv-captions-module/CaptionStyle";
import { CaptionsContent } from "../../src/content-handlers/iiif/modules/uv-captions-module/CaptionsControl";

// The captions control's text, as a player's content gives it.
const CONTENT = {
  captionWhiteOnBlack: "White on black",
  captionBlackOnWhite: "Black on white",
  captionDarkBlueOnPeach: "Dark blue on peach",
  captionDarkRedOnMint: "Dark red on mint",
  captionDarkPurpleOnYellow: "Dark purple on yellow",
} as CaptionsContent;

const BUILT_IN = [
  { label: "White on black", background: "#000000", color: "#ffffff" },
  { label: "Black on white", background: "#ffffff", color: "#000000" },
  { label: "Dark blue on peach", background: "#ffe5d0", color: "#0b2a5b" },
  { label: "Dark red on mint", background: "#d4f5e4", color: "#5c0f2e" },
  { label: "Dark purple on yellow", background: "#fff6c2", color: "#3b1453" },
];

// A host's own colours, as given by the captionStyles option.
const CONFIGURED = [
  { label: "Indigo on sand", background: "#faefcd", color: "#36096e" },
  { label: "Smoke on soot", background: "#24241e", color: "#f2f2f0" },
];

beforeEach(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("caption styles", () => {
  it("are UV's five, named by the player's content, when none are configured", () => {
    expect(captionStyles(undefined, CONTENT)).toEqual(BUILT_IN);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it.each(BUILT_IN_CAPTION_STYLES.map((style) => [style.nameKey, style]))(
    "UV's %s has at least AAA (7:1) contrast between text and background",
    (_, { background, color }) => {
      expect(contrastRatio(color, background)).toBeGreaterThanOrEqual(7);
    }
  );

  it("are the host's, in its order and with its names, when configured", () => {
    expect(captionStyles(CONFIGURED, CONTENT)).toEqual(CONFIGURED);
  });

  it("keep only the colours and name of each configured style", () => {
    expect(
      captionStyles([{ ...CONFIGURED[0], fontSize: "2em" }], CONTENT)
    ).toEqual([CONFIGURED[0]]);
  });

  it("leave out, with a warning, configured styles without a name or colours", () => {
    expect(
      captionStyles(
        [
          { label: "No background", color: "#ffffff" },
          CONFIGURED[0],
          { label: "", background: "#000000", color: "#ffffff" },
          { label: "Not colours", background: 0, color: null },
          "white on black",
        ],
        CONTENT
      )
    ).toEqual([CONFIGURED[0]]);
    expect(console.warn).toHaveBeenCalled();
  });

  it("are UV's, with a warning, when none configured can be used", () => {
    expect(captionStyles([{ label: "No colours" }], CONTENT)).toEqual(BUILT_IN);
    expect(captionStyles({ label: "Not a list" }, CONTENT)).toEqual(BUILT_IN);
    expect(console.warn).toHaveBeenCalledTimes(2);
  });

  it("are UV's, without a warning, when configured as an empty list", () => {
    expect(captionStyles([], CONTENT)).toEqual(BUILT_IN);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("are identified by their colours, whatever they're named", () => {
    expect(captionStyleId(BUILT_IN[0])).toBe(
      captionStyleId({ ...BUILT_IN[0], label: "Gwyn ar ddu" })
    );
    expect(captionStyleId(BUILT_IN[0])).not.toBe(captionStyleId(BUILT_IN[1]));
  });
});

describe("chooseCaptionStyle", () => {
  it("is the style with the given id", () => {
    expect(chooseCaptionStyle(BUILT_IN, captionStyleId(BUILT_IN[3]))).toBe(
      BUILT_IN[3]
    );
  });

  it("is the first style for an id none has, or none", () => {
    expect(chooseCaptionStyle(CONFIGURED, captionStyleId(BUILT_IN[3]))).toBe(
      CONFIGURED[0]
    );
    expect(chooseCaptionStyle(CONFIGURED, null)).toBe(CONFIGURED[0]);
  });
});

describe("contrastRatio", () => {
  it("measures contrast as WCAG does", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
    // WCAG's example: #777777 on white is just under 4.5:1.
    expect(contrastRatio("#777777", "#ffffff")).toBeCloseTo(4.48, 2);
  });

  it("is the same whichever colour is given first", () => {
    expect(contrastRatio("#0b2a5b", "#ffe5d0")).toBeCloseTo(
      contrastRatio("#ffe5d0", "#0b2a5b"),
      10
    );
  });
});
