import { describe, expect, test } from "vitest";
import { formatTime } from "../src/helpers/format-time";

describe("format time", () => {
  test.each([
    // Bad numbers.
    [NaN, "00:00"],
    [Infinity, "00:00"],
    [-Infinity, "00:00"],
    [+0, "00:00"],
    [-0, "00:00"],
    [-1000, "00:00"],
    [0.0000000000000000001, "00:00"],
    [0.000000000000001, "00:00"],
    [5.000000000000001, "00:06"],
    // Normal numbers.
    [0, "00:00"],
    [1, "00:01"],
    [59, "00:59"],
    [60, "01:00"],
    [119, "01:59"],
    [123.456789, "02:04"],
  ])(`formatTime(%s) to equal %s`, (input, expected) => {
    expect(formatTime(input)).toEqual(expected);
  });
});
