/**
 * @jest-environment jsdom
 */

import { canPlayHls } from "../src/helpers/can-play-hls";

describe("Universal Viewer", () => {
  describe("canPlayHls", () => {
    describe("with a browser that natively supports HLS", () => {
      beforeEach(() => {
        window.HTMLMediaElement.prototype.canPlayType = jest.fn((_type) => {
          return "probably";
        });
      });

      test("returns true", () => {
        expect(canPlayHls()).toBeTruthy();
      });
    });

    describe("with a browser that does not natively support HLS", () => {
      beforeEach(() => {
        window.HTMLMediaElement.prototype.canPlayType = jest.fn((_type) => {
          return "";
        });
      });

      test("returns false", () => {
        expect(canPlayHls()).toBeFalsy();
      });
    });

    describe("with a browser that does not natively support HLS but is using HLS.js", () => {
      beforeEach(() => {
        class Hls {
          isSupported() {
            return true;
          }
        }

        window.HTMLMediaElement.prototype.canPlayType = jest.fn((_type) => {
          return "";
        });
        window.Hls = new Hls();
      });

      test("returns true", () => {
        expect(canPlayHls()).toBeTruthy();
      });
    });
  });
});
