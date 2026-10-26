import { readLocaleStrings } from "../../src/Utils";

// Reading a locale file's strings into config (BaseExtension.readLocale),
// for the extension's own config and again once the host's is merged in:
// each "$key" is replaced with its string, which is kept as written.
describe("readLocaleStrings", () => {
  it("replaces each $key with its string, throughout the config", () => {
    expect(
      readLocaleStrings(
        {
          content: { close: "$close" },
          options: {
            captionStyles: [
              {
                label: "$captionWhiteOnBlack",
                color: "#ffffff",
                background: "#000000",
              },
            ],
          },
        },
        { $close: "Close", $captionWhiteOnBlack: "White on black" }
      )
    ).toEqual({
      content: { close: "Close" },
      options: {
        captionStyles: [
          { label: "White on black", color: "#ffffff", background: "#000000" },
        ],
      },
    });
  });

  it("replaces only whole keys, not the start of a longer one", () => {
    expect(
      readLocaleStrings(
        { captions: "$captions", off: "$captionsOff" },
        { $captions: "Captions", $captionsOff: "Off" }
      )
    ).toEqual({ captions: "Captions", off: "Off" });
  });

  it("leaves a $key without a string as written", () => {
    expect(readLocaleStrings({ label: "$unknown" }, { $close: "Close" })).toEqual(
      { label: "$unknown" }
    );
  });

  describe("keeps each string as written", () => {
    it.each([
      ["double quotes", 'Say "hello"'],
      ["a backslash", "C:\\captions"],
      ["a new line", "First line\nSecond line"],
      ["$1, as a regex replacement would use", "$1 off"],
      ["$&, as a regex replacement would use", "Rock $& roll"],
      ["markup", "<script>alert(1)</script>"],
    ])("with %s", (_, value) => {
      expect(
        readLocaleStrings({ label: "$label", other: "unchanged" }, {
          $label: value,
        })
      ).toEqual({ label: value, other: "unchanged" });
    });
  });
});
