import { chooseCaptionTrack } from "../src/content-handlers/iiif/modules/uv-captions-module/CaptionTrack";

describe("chooseCaptionTrack", () => {
  const english = { id: "https://example.org/a/en.vtt", language: "en" };
  const welsh = { id: "https://example.org/a/cy.srt", language: "cy" };
  const unlabelled = { id: "https://example.org/a/unknown.vtt" };
  const tracks = [english, welsh, unlabelled];

  it("shows nothing while captions are off", () => {
    expect(chooseCaptionTrack(tracks, null)).toBeUndefined();
  });

  it("shows the very track chosen", () => {
    expect(chooseCaptionTrack(tracks, welsh)).toBe(welsh);
    expect(chooseCaptionTrack(tracks, unlabelled)).toBe(unlabelled);
  });

  it("shows another canvas' track in the chosen language", () => {
    const otherWelsh = { id: "https://example.org/b/cy.vtt", language: "cy" };
    expect(chooseCaptionTrack(tracks, otherWelsh)).toBe(welsh);
  });

  it("matches the language exactly, then by base language", () => {
    expect(chooseCaptionTrack(tracks, { id: "other", language: "cy-GB" })).toBe(
      welsh
    );
    expect(
      chooseCaptionTrack([{ id: "gb", language: "cy-GB" }, welsh], {
        id: "other",
        language: "cy-GB",
      })
    ).toEqual({ id: "gb", language: "cy-GB" });
  });

  it("shows nothing when no track is in the chosen language", () => {
    expect(
      chooseCaptionTrack(tracks, { id: "other", language: "sv" })
    ).toBeUndefined();
    expect(chooseCaptionTrack([], welsh)).toBeUndefined();
  });

  it("only matches a track with no language by its id", () => {
    expect(
      chooseCaptionTrack([unlabelled], {
        id: "https://example.org/b/unknown.vtt",
      })
    ).toBeUndefined();
  });
});
