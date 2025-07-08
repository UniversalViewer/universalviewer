import { beforeEach, describe, expect, vitest, test } from "vitest";
import { HlsFormat } from "../src/media-formats/hls-format";

describe("HlsFormat", () => {
  class HlsClassMock {
    loadSource() {}
    attachMedia() {}
  }

  afterEach(() => {
    vitest.unstubAllGlobals();
  });

  describe("when hls.js is included", () => {
    test("hls attaches the media element", () => {
      vitest.stubGlobal("Hls", HlsClassMock);
      const attachMediaSpy = vitest.spyOn(
        HlsClassMock.prototype,
        "attachMedia"
      );
      const loadSourceSpy = vitest.spyOn(HlsClassMock.prototype, "loadSource");
      const format = new HlsFormat();
      format.attachTo();
      expect(loadSourceSpy).toHaveBeenCalled();
      expect(attachMediaSpy).toHaveBeenCalled();
    });
  });

  describe("when hls.js is not included", () => {
    test("hls attaches the media element", () => {
      const attachMediaSpy = vitest.spyOn(
        HlsClassMock.prototype,
        "attachMedia"
      );
      const loadSourceSpy = vitest.spyOn(HlsClassMock.prototype, "loadSource");
      const format = new HlsFormat();
      format.attachTo();
      expect(loadSourceSpy).not.toHaveBeenCalled();
      expect(attachMediaSpy).not.toHaveBeenCalled();
    });
  });
});
