import {
  getActiveCueText,
  parseCaptionCues,
} from "../../src/content-handlers/iiif/modules/uv-captions-module/Cues";

describe("parseCaptionCues", () => {
  it("reads WebVTT cues, skipping the header and NOTE blocks", () => {
    const vtt = [
      "WEBVTT",
      "",
      "NOTE a comment that is not a cue",
      "",
      "1",
      "00:00:00.000 --> 00:00:20.000",
      "Just before lunch one day, a puppet show was put on at school.",
      "",
      "2",
      "00:00:20.100 --> 00:00:40.000",
      'It was called "Mister Bungle Goes to Lunch".',
    ].join("\n");

    expect(parseCaptionCues(vtt)).toEqual([
      {
        start: 0,
        end: 20,
        text: "Just before lunch one day, a puppet show was put on at school.",
      },
      {
        start: 20.1,
        end: 40,
        text: 'It was called "Mister Bungle Goes to Lunch".',
      },
    ]);
  });

  it("reads SRT cues, with comma millisecond separators and CRLF line endings", () => {
    const srt = [
      "1",
      "00:00:00,000 --> 00:00:20,000",
      "Cafwyd sioe bypedau ei pherfformio yn yr ysgol, ychydig cyn cinio.",
      "",
      "2",
      "00:00:20,100 --> 00:00:40,000",
      'Ei deitl oedd "Mister Bungle Goes to Lunch".',
    ].join("\r\n");

    expect(parseCaptionCues(srt)).toEqual([
      {
        start: 0,
        end: 20,
        text: "Cafwyd sioe bypedau ei pherfformio yn yr ysgol, ychydig cyn cinio.",
      },
      {
        start: 20.1,
        end: 40,
        text: 'Ei deitl oedd "Mister Bungle Goes to Lunch".',
      },
    ]);
  });

  it("reads timestamps without hours and ignores cue settings", () => {
    const vtt = "WEBVTT\n\n01:02.5 --> 1:01:03.250 align:start line:0\n[music]";

    expect(parseCaptionCues(vtt)).toEqual([
      { start: 62.5, end: 3663.25, text: "[music]" },
    ]);
  });

  it("keeps multi-line cue text and strips markup and entities", () => {
    const vtt = [
      "WEBVTT",
      "",
      "00:00:01.000 --> 00:00:02.000",
      "<v Narrator>Fish &amp; chips</v>",
      "<i>for lunch</i> &lt;again&gt;",
    ].join("\n");

    expect(parseCaptionCues(vtt)).toEqual([
      { start: 1, end: 2, text: "Fish & chips\nfor lunch <again>" },
    ]);
  });

  it("skips cues with unreadable or reversed timings, or no text", () => {
    const vtt = [
      "WEBVTT",
      "",
      "not a time --> 00:00:02.000",
      "unreadable",
      "",
      "00:00:05.000 --> 00:00:04.000",
      "reversed",
      "",
      "00:00:06.000 --> 00:00:07.000",
      "",
      "00:00:08.000 --> 00:00:09.000",
      "kept",
    ].join("\n");

    expect(parseCaptionCues(vtt)).toEqual([{ start: 8, end: 9, text: "kept" }]);
  });

  it("ignores a byte order mark", () => {
    expect(
      parseCaptionCues("\uFEFFWEBVTT\n\n00:00:00.000 --> 00:00:01.000\nHi")
    ).toEqual([{ start: 0, end: 1, text: "Hi" }]);
  });
});

describe("getActiveCueText", () => {
  const cues = [
    { start: 0, end: 20, text: "first" },
    { start: 20.1, end: 40, text: "second" },
    { start: 30, end: 35, text: "overlapping" },
  ];

  it("returns the cue showing at a time, from its start up to its end", () => {
    expect(getActiveCueText(cues, 0)).toBe("first");
    expect(getActiveCueText(cues, 19.99)).toBe("first");
    expect(getActiveCueText(cues, 25)).toBe("second");
  });

  it("returns null between cues and outside the file", () => {
    expect(getActiveCueText(cues, 20)).toBeNull();
    expect(getActiveCueText(cues, 40)).toBeNull();
    expect(getActiveCueText(cues, -1)).toBeNull();
  });

  it("joins overlapping cues on separate lines", () => {
    expect(getActiveCueText(cues, 32)).toBe("second\noverlapping");
  });
});
