import { beforeAll, describe, expect, Mock, vitest, test } from "vitest";
import { Manifest } from "manifesto.js";
import beethoven from "./fixtures/beethoven.json";
import { compositeMediaFromCanvases } from "../src/helpers/composite-media-from-canvases";
import { createTimePlansFromManifest } from "../src/helpers/create-time-plans-from-manifest";
import { TimePlanPlayer } from "../src/elements/timeplan-player";
import { timelineTime } from "../src/helpers/relative-time";

beforeAll(() => {
  window.HTMLMediaElement.prototype.load = vitest.fn();
  window.HTMLMediaElement.prototype.play = vitest.fn(() => {
    return Promise.resolve();
  });
  window.HTMLMediaElement.prototype.pause = vitest.fn();
  window.HTMLMediaElement.prototype.addTextTrack = vitest.fn();
});

function mockElements(elements: any[]) {
  const list: Array<{
    play: Mock;
    pause: Mock;
    buffering: boolean;
    paused: boolean;
  }> = [];
  for (const el of elements) {
    const mocks = {
      buffering: false,
      paused: true,
      play: vitest.fn(() => {
        el.getRawElement().dispatchEvent(new Event("play"));
        (el.getRawElement() as any).paused = false;
        return Promise.resolve();
      }),
      pause: vitest.fn(() => {
        el.getRawElement().dispatchEvent(new Event("pause"));
        (el.getRawElement() as any).paused = false;
      }),
    };
    Object.defineProperty(el.getRawElement(), "paused", {
      writable: true,
      value: false,
    });
    Object.defineProperty(el.getRawElement(), "readyState", {
      writable: true,
      value: 3,
    });
    Object.defineProperty(mocks, "buffering", {
      set(value: boolean) {
        (el.getRawElement() as any).readyState = value ? 0 : 4;
      },
      get() {
        return el.getRawElement().readyState === 4;
      },
    });
    el.element.play = mocks.play;
    el.element.pause = mocks.pause;
    list.push(mocks);
  }
  return list;
}

describe("Composite media", () => {
  test("creating composite media from canvases", async () => {
    const manifest = new Manifest(beethoven);

    const [composite] = compositeMediaFromCanvases(
      manifest.getSequenceByIndex(0).getCanvases(),
      {}
    );
    const timeplan = createTimePlansFromManifest(manifest);

    const mocks = mockElements(composite.elements);

    const player = new TimePlanPlayer(composite, timeplan, (rangeId, stops) => {
      //
    });

    expect(player.currentStop.rangeId).toEqual(
      "https://api.bl.uk/metadata/iiif/ark:/81055/tvdc_100005114784.0x000005"
    );
    expect(player.media.activeElement).toEqual(composite.elements[0]);
    expect(player.media.activeElement?.source.start).toEqual(0);
    expect(player.media.activeElement?.source.end).toEqual(211.04);

    player.play();

    expect(player._time).toEqual(0);
    expect(player.media.activeElement).toEqual(composite.elements[0]);
    expect(mocks[0].play).toHaveBeenCalledOnce();

    await player.advanceToTime(timelineTime(300));

    expect(player._time).toEqual(300);
    expect(player.media.activeElement).toEqual(composite.elements[1]);
    expect(mocks[0].pause).toHaveBeenCalledOnce();
    expect(mocks[1].play).toHaveBeenCalledOnce();

    await player.next();
    expect(player._time).toEqual(967.76);
    expect(player.media.activeElement).toEqual(composite.elements[3]);
    expect(mocks[1].pause).toHaveBeenCalledOnce();
    expect(mocks[3].play).toHaveBeenCalledOnce();

    mocks[7].buffering = true;

    const promise = player.next();
    expect(player._time).toEqual(1825.08);
    expect(player.media.activeElement).toEqual(composite.elements[7]);
    expect(mocks[3].pause).toHaveBeenCalledOnce();

    await player.advanceToTime(timelineTime(1825.079999923706), false);
    await player.advanceToTime(timelineTime(1825.08899974823), false);
    await player.advanceToTime(timelineTime(1825.115999698639), false);

    expect(player.media.activeElement?.getRawElement().readyState).toEqual(0);

    mocks[7].buffering = false;

    expect(player.media.activeElement?.getRawElement().readyState).toEqual(4);

    await promise;

    expect(mocks[7].play).toHaveBeenCalled();

    // Reset for going backwards.
    mocks[0].pause.mockClear();
    mocks[1].pause.mockClear();
    mocks[3].pause.mockClear();
    mocks[4].pause.mockClear();
    mocks[7].pause.mockClear();
    mocks[0].play.mockClear();
    mocks[1].play.mockClear();
    mocks[4].play.mockClear();
    mocks[3].play.mockClear();
    mocks[7].play.mockClear();

    // Now start advancing time.
    await player.advanceToTime(timelineTime(1825.279999923706), false);
    await player.advanceToTime(timelineTime(1825.28899974823), false);
    await player.advanceToTime(timelineTime(1825.215999698639), false);

    expect(mocks[7].play).not.toHaveBeenCalled();
    expect(mocks[7].pause).not.toHaveBeenCalled();
    expect(player._time).toEqual(1825.215999698639);

    await player.previous();
    expect(player._time).toEqual(967.76);
    expect(player.media.activeElement).toEqual(composite.elements[3]);
    expect(mocks[7].pause).toHaveBeenCalledOnce();
    expect(mocks[3].play).toHaveBeenCalled();

    await player.previous();
    expect(player._time).toEqual(0);
    expect(player.media.activeElement).toEqual(composite.elements[0]);
    expect(mocks[3].pause).toHaveBeenCalled();
    expect(mocks[0].play).toHaveBeenCalled();
  });
});
