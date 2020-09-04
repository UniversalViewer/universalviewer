import { XYWH } from "./XYWH";

describe("XYWH", () => {
  const xywh = new XYWH(0, 5, 100, 95);

  it("has accessors available", () => {
    expect(xywh.x).toEqual(0);
    expect(xywh.y).toEqual(5);
    expect(xywh.w).toEqual(100);
    expect(xywh.h).toEqual(95);
  });

  describe("toString", () => {
    it("is in format x,y,w,h", () => {
      expect(xywh.toString()).toEqual("0,5,100,95");
    });
  });

  describe("fromString", () => {
    it("creates with arguments in correct order", () => {
      expect(XYWH.fromString(xywh.toString()).toString()).toEqual(
        xywh.toString()
      );
    });
  });
});
