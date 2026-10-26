import { orderCaptionTracks } from "../../src/content-handlers/iiif/modules/uv-captions-module/CaptionTrack";

const track = (label: string, language?: string) => ({
  id: `https://example.org/${label}.vtt`,
  label,
  language,
});

const labels = (tracks: { label?: string }[]) =>
  tracks.map((track) => track.label);

describe("orderCaptionTracks", () => {
  const english = track("English captions", "en");
  const welsh = track("Welsh captions", "cy");
  const french = track("French captions", "fr");
  const swedish = track("Swedish captions", "sv");

  it("lists the tracks in the user's language first, then the rest alphabetically", () => {
    expect(
      labels(orderCaptionTracks([english, swedish, welsh, french], "cy-GB"))
    ).toEqual([
      "Welsh captions",
      "English captions",
      "French captions",
      "Swedish captions",
    ]);
  });

  it("lists an exact match for the user's locale before a base-language one", () => {
    const welshGB = track("Welsh (Britain) captions", "cy-GB");
    expect(
      labels(orderCaptionTracks([english, welsh, welshGB], "cy-GB"))
    ).toEqual([
      "Welsh (Britain) captions",
      "Welsh captions",
      "English captions",
    ]);
  });

  it("keeps several tracks in the user's language in the manifest's order", () => {
    const welshSDH = track("Welsh captions (SDH)", "cy");
    expect(
      labels(orderCaptionTracks([welshSDH, english, welsh], "cy"))
    ).toEqual(["Welsh captions (SDH)", "Welsh captions", "English captions"]);
  });

  it("lists every track alphabetically when none is in the user's language", () => {
    expect(
      labels(orderCaptionTracks([welsh, swedish, english, french], "pl-PL"))
    ).toEqual([
      "English captions",
      "French captions",
      "Swedish captions",
      "Welsh captions",
    ]);
  });

  it("alphabetises by the user's locale's own sort order", () => {
    // Swedish sorts Å after Z; English sorts it with A.
    const tracks = [track("Zulu"), track("Ångström"), track("Apple")];
    expect(labels(orderCaptionTracks(tracks, "sv-SE"))).toEqual([
      "Apple",
      "Zulu",
      "Ångström",
    ]);
    expect(labels(orderCaptionTracks(tracks, "en-GB"))).toEqual([
      "Ångström",
      "Apple",
      "Zulu",
    ]);
  });

  it("ignores case when alphabetising", () => {
    expect(
      labels(orderCaptionTracks([track("welsh"), track("English")], "fr"))
    ).toEqual(["English", "welsh"]);
  });

  it("keeps tracks with the same label in the manifest's order", () => {
    const first = { ...track("Captions"), id: "first" };
    const second = { ...track("Captions"), id: "second" };
    expect(
      orderCaptionTracks([first, second], "en").map((track) => track.id)
    ).toEqual(["first", "second"]);
  });

  it("lists tracks without a language among the rest", () => {
    expect(
      labels(orderCaptionTracks([track("Unlabelled language"), welsh], "cy"))
    ).toEqual(["Welsh captions", "Unlabelled language"]);
  });

  it("leaves the given list as it was", () => {
    const tracks = [welsh, english];
    orderCaptionTracks(tracks, "en");
    expect(tracks).toEqual([welsh, english]);
  });
});
