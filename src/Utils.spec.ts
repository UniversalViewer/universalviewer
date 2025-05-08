import { propertiesChanged } from "./Utils";

describe("Utils", () => {
  it("correctly detects manifestindex changes", () => {
    const propChanged: boolean = propertiesChanged(
      { manifestIndex: 0 },
      { manifestIndex: 1 },
      ["manifestIndex"]
    );
    expect(propChanged).toEqual(true);
  });
});
