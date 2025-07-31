/**
 * @jest-environment jsdom
 */

import { HlsFormat } from "../src/media-formats/hls-format";

describe("HlsFormat", () => {
  class HlsClassMock {
    loadSource() {}
    attachMedia() {}
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when hls.js is included", () => {
    test.skip("hls attaches the media element", () => {
      // TODO: find replacement for - vitest.stubGlobals(HlsClassMock, "Hls")
      const attachMediaSpy = jest.spyOn(HlsClassMock.prototype, "attachMedia");
      const loadSourceSpy = jest.spyOn(HlsClassMock.prototype, "loadSource");
      const format = new HlsFormat("audio/x-mpegurl");
      format.attachTo(window.HTMLMediaElement.prototype);
      expect(loadSourceSpy).toHaveBeenCalled();
      expect(attachMediaSpy).toHaveBeenCalled();
    });
  });

  describe("when hls.js is not included", () => {
    test("hls attaches the media element", () => {
      const attachMediaSpy = jest.spyOn(HlsClassMock.prototype, "attachMedia");
      const loadSourceSpy = jest.spyOn(HlsClassMock.prototype, "loadSource");
      const format = new HlsFormat("audio/x-mpegurl");
      format.attachTo(window.HTMLMediaElement.prototype);
      expect(loadSourceSpy).not.toHaveBeenCalled();
      expect(attachMediaSpy).not.toHaveBeenCalled();
    });
  });
});
