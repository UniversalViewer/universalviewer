import { describe, test, expect } from "vitest";
import { TimePlanPlayer } from "../src/elements/timeplan-player";
import { CompositeMediaElement } from "../src/elements/composite-media-element";
import { timelineTime } from "../src/helpers/relative-time";
import { plan5 } from "./fixtures/plan-5";
import { plan12 } from "./fixtures/plan-12";
import { plan16 } from "./fixtures/plan-16";
import { plan18 } from "./fixtures/plan-18";
import row3 from "./fixtures/row3.json";
import row4 from "./fixtures/row4.json";
import row9 from "./fixtures/row9.json";
import row10 from "./fixtures/row10.json";
import shortRange from "./fixtures/short-range.json";
import beethoven from "./fixtures/beethoven.json";
import { createTimePlansFromManifest } from "../src/helpers/create-time-plans-from-manifest";
import { Manifest } from "manifesto.js";
import { TimePlan } from "../src/types/time-plan";
import { TimeStop } from "../src/types/time-stop";

describe("Time plan", () => {
  const mediaElements = new CompositeMediaElement([]);

  describe("Create valid timeplans", function () {
    function validTimeStop(item: TimePlan, stop: TimeStop) {
      expect(stop.canvasIndex).toBeDefined();
      // expect(stop.canvasId).toBeDefined();
      expect(item.canvases[stop.canvasIndex]).toBeDefined();
      // expect(item.canvases[stop.canvasIndex]).toContain(stop.canvasId);
    }

    function validTimePlan(item: TimePlan) {
      if (item.type === "time-plan") {
        for (const stop of item.stops) {
          validTimeStop(item, stop);
        }
        for (const stop of item.items) {
          if (stop.type === "time-stop") {
            validTimeStop(item, stop);
          } else {
            validTimePlan(stop);
          }
        }
      }
    }

    test("row 3 contains valid canvas indexes", () => {
      const manifest = new Manifest(row3);
      const plan = createTimePlansFromManifest(manifest);

      validTimePlan(plan as any);

      expect(plan).toMatchSnapshot();
    });
    test("row 4 contains valid canvas indexes", () => {
      const manifest = new Manifest(row4);
      const plan = createTimePlansFromManifest(manifest);

      validTimePlan(plan as any);
    });
    test("row 9 contains valid canvas indexes", () => {
      const manifest = new Manifest(row9);
      const plan = createTimePlansFromManifest(manifest);

      validTimePlan(plan as any);
    });

    test("row 10 contains valid canvas indexes", () => {
      const manifest = new Manifest(row10);
      const plan = createTimePlansFromManifest(manifest);

      validTimePlan(plan as any);
    });

    test("beethoven contains valid canvas indexes", () => {
      const manifest = new Manifest(beethoven);
      const plan = createTimePlansFromManifest(manifest);

      validTimePlan(plan as any);
    });

    test("Short range contains valid canvas indexes", () => {
      const manifest = new Manifest(shortRange);
      const plan = createTimePlansFromManifest(manifest);

      validTimePlan(plan as any);

      expect(plan).toMatchSnapshot();
    });
  });

  describe("Fixture 5 bugs", () => {
    test("next then previous", async () => {
      const player = new TimePlanPlayer(mediaElements, plan5);

      // On the first top level.
      expect(player.currentStop.rangeId).toEqual(
        `http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000007`
      );

      player.next();
      player.next();
      expect(player.currentStop.rangeId).toEqual(
        `http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000009`
      );

      player.previous();
      expect(player.currentStop.rangeId).toEqual(
        `http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000007`
      );
    });
    test("going halfway through first range, then clicking back", () => {
      const player = new TimePlanPlayer(mediaElements, plan5, (rangeId) => {
        player.setRange(rangeId);
      });

      // Go to 1:30
      player.setRange(
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000007"
      );
      player.setTime(timelineTime(1.5 * 60));

      expect(player.currentRange).toEqual(
        `http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000007`
      );

      // Click previous
      player.previous();

      // The time should be zero and the range should not have changed.
      expect(player.getTime()).toEqual(0);
      expect(player.currentRange).toEqual(
        `http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000007`
      );

      // Clicking it again
      player.previous();

      // Now we should be on the top.
      expect(player.getTime()).toEqual(0);
      expect(player.currentRange).toEqual(
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000002/top"
      );
    });
    test("Can sequentially go through all of the ranges", async () => {
      const player = new TimePlanPlayer(mediaElements, plan5, (rangeId) => {
        player.setRange(rangeId);
      });

      await player.setTime(timelineTime(0));

      const iterations = 20;
      const times: number[] = [];
      const ranges: string[] = [];

      for (let i = 0; i < iterations; i++) {
        await player.next();
        times.push(player.getTime());
        ranges.push(player.currentRange);
      }

      expect(times).toMatchInlineSnapshot(`
        [
          0,
          148.76,
          276.59999999999997,
          457.9599999999999,
          562.3599999999999,
          767.1999999999998,
          1117.2399999999998,
          1117.2399999999998,
          1202.4399999999998,
          1370.9999999999995,
          1370.9999999999995,
          1608.3599999999997,
          1775.2399999999998,
          1965.2399999999998,
          2062.12,
          2185.8,
          2328.04,
          2590.84,
          2703.48,
          2703.48,
        ]
      `);
      expect(ranges).toMatchInlineSnapshot(`
        [
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000007",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000009",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00000b",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00000d",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00000f",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000011",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000013",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000014",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000015",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000019",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00001a",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00001b",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00001c",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00001d",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00001e",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00001f",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000020",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000021",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000021",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000021",
        ]
      `);
    });
    test("going back from top range should stay on top range", () => {
      const player = new TimePlanPlayer(mediaElements, plan5, (rangeId) => {
        player.setRange(rangeId);
      });

      player.setRange(
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000002/top"
      );
      player.setTime(timelineTime(0));
      player.previous();

      expect(player.currentRange).toEqual(
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000002/top"
      );
      expect(player.getTime()).toEqual(0);
    });
    test("backwards through ranges", () => {
      const player = new TimePlanPlayer(mediaElements, plan5, (rangeId) => {
        player.setRange(rangeId);
      });

      player.setRange(
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000021"
      );
      player.setTime(timelineTime(2703.48));

      const iterations = 20;
      const times: number[] = [];
      const ranges: string[] = [];

      for (let i = 0; i < iterations; i++) {
        player.previous();
        times.push(player.getTime());
        ranges.push(player.currentRange);
      }

      expect(times).toMatchInlineSnapshot(`
        [
          2590.84,
          2328.04,
          2185.8,
          2062.12,
          1965.2399999999998,
          1775.2399999999998,
          1608.3599999999997,
          1370.9999999999995,
          1370.9999999999995,
          1202.4399999999998,
          1117.2399999999998,
          1117.2399999999998,
          767.1999999999998,
          562.3599999999999,
          457.9599999999999,
          276.59999999999997,
          148.76,
          0,
          0,
          0,
        ]
      `);
      expect(ranges).toMatchInlineSnapshot(`
        [
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000021",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000020",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00001f",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00001e",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00001d",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00001c",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00001b",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00001a",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000019",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000015",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000014",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000013",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000011",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00000f",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00000d",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x00000b",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000009",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000007",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000002/top",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000002/top",
        ]
      `);
    });
    test("bug: cannot go back to first", () => {
      const player = new TimePlanPlayer(mediaElements, plan5, (rangeId) => {
        player.setRange(rangeId);
      });

      player.setRange(
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100082592360.0x000021"
      );
      player.setTime(timelineTime(2 * 60 + 30));

      player.previous();

      expect(player.getTime()).toEqual(0);
    });
  });

  describe("Fixture 12 bugs", () => {
    test("going past half way point and then clicking back", () => {
      const player = new TimePlanPlayer(mediaElements, plan12, (rangeId) => {
        player.setRange(rangeId);
      });
      player.setTime(timelineTime(47 * 60), true);
      player.setRange(
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006"
      );

      expect(player.currentRange).toEqual(
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006"
      );
      expect(player.getTime()).toEqual(47 * 60);

      player.previous();

      expect(player.getTime()).toEqual(0);
      expect(player.currentRange).toMatchInlineSnapshot(
        `"http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006"`
      );

      player.previous();

      expect(player.getTime()).toEqual(0);
      expect(player.currentRange).toMatchInlineSnapshot(
        `"http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000002/top"`
      );
    });
    test("going to 37, clicking next and then previous", () => {
      const player = new TimePlanPlayer(mediaElements, plan12, (rangeId) => {
        player.setRange(rangeId);
      });
      player.setTime(timelineTime(37 * 60), true);
      player.setRange(
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006"
      );

      expect(player.currentRange).toEqual(
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006"
      );
      expect(player.getTime()).toEqual(37 * 60);

      player.previous();

      expect(player.currentRange).toEqual(
        `http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100085750596.0x000006`
      );
      expect(player.getTime()).toEqual(0);
    });
  });

  describe("Fixture 16 bugs", () => {
    /**
     * Playing the 15th recording (Scarlet-headed Blackbird, Brazil, 2003). It should transition from the end of
     * side/file 1 into the start of side/file 2 as the recording continues over the tape side. Instead, when it
     * reaches 00:31:18 (the end of S1), it then replays the audio from the beginning of S1. If I collapse the player
     * after the 00:31:18 mark, the player continues to play but delivers the correct audio to the full player. If I
     * return to the full player from there, the correct audio delivered from the compressed player continues to play.
     * Using the Previous button from there takes the play-head back, incorrectly, to midway through the range.
     * Selecting Previous again has no effect. When clicking on the timeline to jump past the 00:31:18 mark, it seems
     * to play the correct audio after 31:18 , but is wrong whenever I let it play naturally.
     */
    test("It should transition from the end of side/file 1 into the start of side/file 2", () => {
      const player = new TimePlanPlayer(mediaElements, plan16, (rangeId) => {
        player.setRange(rangeId);
      });

      player.setRange(
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000022"
      );

      // Just before.
      player.advanceToTime(timelineTime(31 * 60 + 17));
      expect(player.currentStop.canvasIndex).toEqual(14);

      // Set time and range.
      player.advanceToTime(timelineTime(31 * 60 + 19));
      expect(player.currentStop.canvasIndex).toEqual(15);
    });
    test("Previous button takes the play-head back to the start of the range", () => {
      const player = new TimePlanPlayer(mediaElements, plan16, (rangeId) => {
        player.setRange(rangeId);
      });

      player.setRange(
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000022"
      );

      player.advanceToTime(timelineTime(31 * 60 + 17));
      expect(player.currentStop.canvasIndex).toEqual(14);

      player.advanceToTime(timelineTime(31 * 60 + 19));
      expect(player.currentStop.canvasIndex).toEqual(15);

      player.previous();
      expect(player.getTime()).toEqual(1361.4);
      expect(player.currentStop.canvasIndex).toEqual(14);
    });
    test("sequentially through ranges", async () => {
      const player = new TimePlanPlayer(mediaElements, plan16, (rangeId) => {
        player.setRange(rangeId);
      });

      await player.setTime(timelineTime(0));

      const iterations = plan16.items.length + 2;
      const times: number[] = [];
      const ranges: string[] = [];

      for (let i = 0; i < iterations; i++) {
        await player.next();
        times.push(player.getTime());
        ranges.push(player.currentRange);
      }

      expect(times).toMatchInlineSnapshot(`
        [
          0,
          97.04,
          165.8,
          280.8,
          363.68,
          463.64,
          636.24,
          674.36,
          741.16,
          962.72,
          1045.72,
          1151.76,
          1211.24,
          1236.48,
          1361.4,
          2113.48,
          2196.08,
          2659.68,
          2670.2799999999997,
          2781.5599999999995,
          2879.4799999999996,
          3025.159999999999,
          3194.7599999999993,
          3250.879999999999,
          3407.7599999999993,
          3537.3599999999997,
          3636.5199999999995,
          3755.24,
          3755.24,
        ]
      `);
      expect(ranges).toMatchInlineSnapshot(`
        [
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000006",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000008",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x00000a",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x00000c",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x00000e",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000010",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000012",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000014",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000016",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000018",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x00001a",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x00001c",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x00001e",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000020",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000022",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000025",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000027",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000029",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x00002b",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x00002d",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x00002f",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000031",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000033",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000035",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000037",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x000039",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x00003b",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x00003b",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100094400914.0x00003b",
        ]
      `);
    });
  });

  describe("Fixture 17 bugs", () => {
    /**
     * More odd behaviour with the above example: Next and Previous buttons works fine in the full player for that
     * range (which spans two files), but when collapsing to the compressed player, the Next button takes the
     * playhead to the end of the first file instead of the end of the range
     */
    test.todo("Same as Fixture 16");
  });

  describe("Fixture 18 bugs", () => {
    /**
     * Player not advancing past first child recording: stops unexpectedly
     */
    test("backwards through ranges", () => {
      const player = new TimePlanPlayer(mediaElements, plan18, (rangeId) => {
        player.setRange(rangeId);
      });

      player.setRange(
        "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009"
      );
      player.setTime(timelineTime(2667.8));

      const iterations = 4;
      const times: number[] = [];
      const ranges: string[] = [];

      for (let i = 0; i < iterations; i++) {
        player.previous();
        times.push(player.getTime());
        ranges.push(player.currentRange);
      }

      expect(times).toMatchInlineSnapshot(`
        [
          88.11999999999989,
          0,
          0,
          0,
        ]
      `);
      expect(ranges).toMatchInlineSnapshot(`
        [
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000009",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000007",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
          "http://api.bl.uk/metadata/iiif/ark:/81055/vdc_100048367656.0x000002/top",
        ]
      `);
    });
  });

  describe("Fixture 20 bugs", () => {
    /**
     * Playback stops partway through the recording
     */
    test.todo("Bug: Playback stops partway through the recording");
  });

  describe("Fixture 26 bugs", () => {
    /**
     * Using the Next button in the full player moves the playhead to the correct points, but using the Previous button
     * moves the focus out of the recording entirely."
     */
    test.todo(
      "Bug: using the Previous button moves the focus out of the recording entirely."
    );
  });

  describe("Fixture 29 bugs", () => {
    /**
     * Advancing past the first recording in the Index does not work
     */
    test.todo(
      "Bug: Advancing past the first recording in the Index does not work"
    );
  });

  describe("Fixture 31 bugs", () => {
    /**
     * "Select Pathetan pélog barang wanta from the Index
     * Letting the playhead advance into the next recording plays back the wrong file/range; using the navigation
     * buttons plays back the correct file/range"
     *
     * (No fixture yet)
     */
    test.todo("Bug: plays back the wrong range when letting it advance");
  });

  describe("Fixture 35 bugs", () => {
    /**
     * Playback stops unexpectedly at the penultimate child recording for the first parent
     */
    test.todo(
      "Bug: Playback stops unexpectedly at the penultimate child recording for the first parent"
    );
  });

  describe("Fixture 37 bugs", () => {
    /**
     * Selecting the first child recording for the second parent from the Index does not work
     *
     * (No fixture yet)
     */
    test.todo(
      "Bug: Selecting the first child recording for the second parent from the Index does not work"
    );
  });

  describe("Fixture 43 bugs", () => {
    test.todo(
      "Bug: Advancing past the first recording from the Index does not work"
    );
  });

  describe("Fixture 49 bugs", () => {
    /**
     * Letting the end of the first range end naturally causes the player to deliver the wrong audio for the second
     * range (basically a repeat of the first recording). Using the navigation in the index instead delivers the
     * correct audio
     */
    test.todo("Bug: Not advancing audio correctly");
  });
});
