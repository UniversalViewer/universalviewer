import type { CaptionsContent } from "./CaptionsControl";

// A colour combination for captions, with its name in the captions menu.
// The colours are any CSS colours.
export interface CaptionStyle {
  label: string;
  background: string;
  color: string;
}

// UV's own colour combinations, offered unless the host configures its own
// (the captionStyles option), and named by the player's content. Each has at
// least AAA (7:1) contrast between its text and background, so captions stay
// legible, including for people with low vision or colour blindness.
export const BUILT_IN_CAPTION_STYLES: {
  nameKey: keyof CaptionsContent;
  background: string;
  color: string;
}[] = [
  { nameKey: "captionWhiteOnBlack", background: "#000000", color: "#ffffff" },
  { nameKey: "captionBlackOnWhite", background: "#ffffff", color: "#000000" },
  {
    nameKey: "captionDarkBlueOnPeach",
    background: "#ffe5d0",
    color: "#0b2a5b",
  },
  { nameKey: "captionDarkRedOnMint", background: "#d4f5e4", color: "#5c0f2e" },
  {
    nameKey: "captionDarkPurpleOnYellow",
    background: "#fff6c2",
    color: "#3b1453",
  },
];

const isCaptionStyle = (style: any): style is CaptionStyle =>
  !!style &&
  ["label", "background", "color"].every(
    (key) => typeof style[key] === "string" && style[key] !== ""
  );

// The styles a player offers: the host's, as configured, or UV's own when
// it configures none that can be used.
export const captionStyles = (
  configured: unknown,
  content: CaptionsContent
): CaptionStyle[] => {
  const list = Array.isArray(configured) ? configured : [];
  const valid = list.filter(isCaptionStyle);

  if (
    configured !== undefined &&
    (!Array.isArray(configured) || valid.length < list.length)
  ) {
    console.warn(
      "captionStyles should be a list of { label, color, background }, each a non-empty string; leaving out those that aren't."
    );
  }

  return valid.length
    ? valid.map(({ label, background, color }) => ({
        label,
        background,
        color,
      }))
    : BUILT_IN_CAPTION_STYLES.map(({ nameKey, background, color }) => ({
        label: content[nameKey],
        background,
        color,
      }));
};

// Identifies a style by its colours, so a choice carries over to players
// whose styles have other names (e.g. in another language).
export const captionStyleId = ({ color, background }: CaptionStyle): string =>
  `${color} on ${background}`;

// The style with the given id, or the first.
export const chooseCaptionStyle = (
  styles: CaptionStyle[],
  id: string | null
): CaptionStyle =>
  styles.find((style) => captionStyleId(style) === id) || styles[0];

// WCAG relative luminance of a #rrggbb colour.
const luminance = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// The WCAG contrast ratio between two #rrggbb colours, from 1 to 21.
export const contrastRatio = (a: string, b: string): number => {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
};
