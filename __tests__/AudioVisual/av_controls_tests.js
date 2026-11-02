let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl, waitUntilStill } = require("../../scripts/testViewer");
const testTiming = require("../../scripts/testTiming");

// Each player's controls, held to the same accessibility checks: each control
// named, with its tooltip, in the user's language; every control shown and in
// reach on any device, and at least 44px square to tap; the timeline and
// volume presented as sliders, named in the user's language, with their
// values; and keyboard steps of 5 seconds and 10%. The AV component plays
// manifests with ranges, and has previous, next and 20-second skip buttons;
// the MediaElement extension plays manifests without, and has a full screen
// button instead.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

// The devices each player's controls should fit.
const SIZES = [
  ["a desktop", { width: 1440, height: 900 }],
  ["a laptop", { width: 1024, height: 768 }],
  ["a tablet", { width: 768, height: 1024, isMobile: true, hasTouch: true }],
  ["a phone", { width: 390, height: 844, isMobile: true, hasTouch: true }],
  ["a small phone", { width: 320, height: 568, isMobile: true, hasTouch: true }],
];

const PHONE = SIZES.find(([name]) => name === "a phone")[1];
const TABLET = SIZES.find(([name]) => name === "a tablet")[1];

const PLAYERS = [
  [
    "the AV component",
    {
      manifest: fixture("ranges-captioned-video-manifest.json"),
      // The player in use: the AV component keeps one per canvas.
      root: ".iiif-av-component .player:not([style*='none'])",
      buttons: ".controls-container button",
      names: {
        en: [
          "Previous",
          "Back 20 seconds",
          "Play",
          "Forward 20 seconds",
          "Next",
          "Mute",
          "Captions: Off",
        ],
        cy: [
          "Blaenorol",
          "Yn ôl 20 eiliad",
          "Chwarae",
          "Ymlaen 20 eiliad",
          "Nesaf",
          "Mudo",
          "Capsiynau: I ffwrdd",
        ],
      },
      play: "button:has(.av-icon-play)",
      mute: ".volume-mute",
      media: ".iiif-av-component video",
      time: ".canvas-time",
      sliders: {
        timeline: ".canvas-timeline-container .ui-slider-handle",
        volume: ".volume-slider .ui-slider-handle",
      },
      controls: {
        captions: ".captions-button",
        previous: "button:has(.av-icon-previous)",
        "back 20 seconds": "button:has(.av-icon-fast-rewind)",
        play: "button:has(.av-icon-play)",
        "forward 20 seconds": "button:has(.av-icon-fast-forward)",
        next: "button:has(.av-icon-next)",
        time: ".time-display",
        mute: ".volume-mute",
        volume: ".volume-slider .ui-slider-handle",
        // The track: its handle ignores the pointer, which seeks wherever the
        // track is pressed. (Keyboard users move the handle.)
        timeline: ".canvas-timeline-container",
      },
      skipForward: "button:has(.av-icon-fast-forward)",
      // An auto-advance manifest, whose canvases it plays as one timeline,
      // with a player of its own, shown in the index view.
      timeline: {
        manifest: fixture("ranges-multi-canvas-captioned-video-manifest.json"),
        root: ".iiif-av-component .player.virtual:not([style*='none'])",
        view: ".leftPanel .index.tab",
      },
    },
  ],
  [
    "the MediaElement player",
    {
      manifest: fixture("captioned-video-manifest.json"),
      root: ".mejs__container",
      buttons: ".mejs__controls button",
      names: {
        en: ["Play", "Mute", "Captions: Off", "Full Screen"],
        cy: ["Chwarae", "Mudo", "Capsiynau: I ffwrdd", "Sgrin lawn"],
      },
      play: ".mejs__playpause-button button",
      mute: ".mejs__volume-button button",
      media: ".mejs__container video",
      time: ".mejs__currenttime",
      sliders: {
        timeline: ".mejs__time-total",
        volume: ".mejs__horizontal-volume-slider",
      },
      controls: {
        play: ".mejs__playpause-button button",
        time: ".mejs__currenttime",
        // The track: pressing anywhere on it seeks there.
        timeline: ".mejs__time-total",
        mute: ".mejs__volume-button button",
        volume: ".mejs__horizontal-volume-slider",
        captions: ".captions-button",
        fullscreen: ".mejs__fullscreen-button button",
      },
      // Android lets pages set the volume, so it has the volume slider. iOS
      // and iPadOS don't (only the device's buttons can), so they have only
      // the mute button, rather than a slider that does nothing. Since
      // iPadOS 13, an iPad presents itself as a Mac, so is told apart by its
      // touch screen.
      devices: [
        [
          "an Android phone",
          {
            viewport: PHONE,
            userAgent:
              "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36",
          },
          { mute: "ok", volume: "ok" },
        ],
        [
          "an iPhone",
          {
            viewport: PHONE,
            userAgent:
              "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
          },
          { mute: "ok", volume: "not shown" },
        ],
        [
          "an iPad",
          {
            viewport: TABLET,
            userAgent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
            touchPoints: 5,
          },
          { mute: "ok", volume: "not shown" },
        ],
      ],
    },
  ],
];

describe.each(PLAYERS)("Controls in %s", (_, player) => {
  let browser;
  let context;
  let page;

  beforeAll(async () => {
    puppeteer = (await import("puppeteer")).default;
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  // Loads the manifest as a new visitor, in the given locales and on a device
  // of the given size (and, to be taken for a particular one, its user agent
  // and number of touch points), waits for the player's controls and their
  // layout to settle, and returns the player in use. Another manifest can be
  // given, with its player and the view to show it in; and the page's clock
  // can tick on a millisecond each time it's read (`tickingClock`), as it
  // can when the machine is busy.
  const load = async ({
    locales,
    viewport = SIZES[0][1],
    userAgent,
    touchPoints,
    manifest = player.manifest,
    root = player.root,
    view,
    tickingClock,
  } = {}) => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    if (userAgent) {
      await page.setUserAgent(userAgent);
    }
    if (touchPoints) {
      await page.evaluateOnNewDocument((touchPoints) => {
        Object.defineProperty(Navigator.prototype, "maxTouchPoints", {
          get: () => touchPoints,
        });
      }, touchPoints);
    }
    if (tickingClock) {
      await testTiming.tickingClock(page);
    }
    await page.setViewport({ deviceScaleFactor: 1, ...viewport });
    await page.goto(viewerUrl(manifest, locales), {
      waitUntil: "domcontentloaded",
    });
    if (view) {
      await page.waitForSelector(view, { visible: true });
      await page.click(view);
    }
    await page.waitForSelector(`${root} .captions-button`, {
      visible: true,
    });
    // The player is laid out again as it loads, moving its controls, and a
    // click or tap aimed at where a control was can miss it.
    await waitUntilStill(page, `${root} .captions-button`);
    return page.$(root);
  };

  // What screen readers announce an element as.
  const accessibleName = async (element) =>
    (await page.accessibility.snapshot({ root: element })).name;

  // Each button in the controls, by its accessible name and its tooltip.
  const buttons = async (root) => {
    const names = [];
    for (const button of await root.$$(player.buttons)) {
      names.push({
        name: await accessibleName(button),
        title: await button.evaluate((b) => b.title),
      });
    }
    return names;
  };

  // The current time shown, waiting up to 10s for the one expected: the
  // MediaElement player seeks just after a key press, and shows the new time
  // once the media has moved there, which can be slow while other tests run.
  const expectTime = async (root, expected) => {
    const time = () => root.$eval(player.time, (el) => el.textContent);
    for (let i = 0; i < 100 && (await time()) !== expected; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    expect(await time()).toBe(expected);
  };

  // In the order they're shown, which is the order keyboard and screen reader
  // users reach them.
  it("names every control, and its tooltip, in the user's language", async () => {
    expect(await buttons(await load())).toEqual(
      player.names.en.map((name) => ({ name, title: name }))
    );
    expect(await buttons(await load({ locales: "cy-GB" }))).toEqual(
      player.names.cy.map((name) => ({ name, title: name }))
    );
  }, 90000);

  it("never shows 'undefined'", async () => {
    const root = await load();
    const undefinedText = await root.evaluate((root) =>
      [root, ...root.querySelectorAll("*")]
        .flatMap((el) => [
          el.getAttribute("title"),
          el.getAttribute("aria-label"),
          el.children.length ? null : el.textContent,
        ])
        .filter((text) => text && text.includes("undefined"))
    );
    expect(undefinedText).toEqual([]);
  }, 60000);

  it("names the play button for what it will do", async () => {
    const root = await load();
    const play = await root.$(player.play);
    await page.evaluate(
      (media) =>
        document
          .querySelectorAll(media)
          .forEach((video) => (video.muted = true)),
      player.media
    );

    await play.click();
    await page.waitForFunction((b) => b.title === "Pause", {}, play);
    expect(await accessibleName(play)).toBe("Pause");

    await play.click();
    await page.waitForFunction((b) => b.title === "Play", {}, play);
    expect(await accessibleName(play)).toBe("Play");
  }, 60000);

  it("names the mute button for what it will do", async () => {
    const root = await load();
    const mute = await root.$(player.mute);

    await mute.click();
    await page.waitForFunction((b) => b.title === "Unmute", {}, mute);
    expect(await accessibleName(mute)).toBe("Unmute");

    await mute.click();
    await page.waitForFunction((b) => b.title === "Mute", {}, mute);
    expect(await accessibleName(mute)).toBe("Mute");
  }, 60000);

  // FITTING ANY SIZE
  // For each control: whether it can be seen and reached, i.e. it's laid
  // out, on screen, and the topmost element at its centre (so nothing covers
  // it and no container clips it).
  const reachability = (root) =>
    root.evaluate((root, controls) => {
      const result = {};
      for (const [name, selector] of Object.entries(controls)) {
        const el = root.querySelector(selector);
        const box = el && el.getBoundingClientRect();
        if (!box || !box.width || !box.height) {
          result[name] = "not shown";
          continue;
        }
        const x = box.left + box.width / 2;
        const y = box.top + box.height / 2;
        const onScreen =
          box.left >= 0 &&
          box.top >= 0 &&
          box.right <= innerWidth &&
          box.bottom <= innerHeight;
        const top = document.elementFromPoint(x, y);
        const reachable = !!top && (top === el || el.contains(top));
        result[name] = !onScreen
          ? "off screen"
          : !reachable
            ? `covered or clipped (by ${top && top.className})`
            : "ok";
      }
      return result;
    }, player.controls);

  describe.each(SIZES)("on %s", (_, viewport) => {
    it("shows every control, uncovered and unclipped", async () => {
      const root = await load({ viewport });
      const ok = Object.fromEntries(
        Object.keys(player.controls).map((name) => [name, "ok"])
      );
      expect(await reachability(root)).toEqual(ok);
    }, 60000);

    if (viewport.hasTouch) {
      it("makes every button at least 44px square, to tap", async () => {
        const root = await load({ viewport });
        const small = await root.$$eval(player.buttons, (buttons) =>
          buttons
            .map((b) => {
              const { width, height } = b.getBoundingClientRect();
              return { label: b.title, width, height };
            })
            .filter(({ width, height }) => width < 44 || height < 44)
        );
        expect(small).toEqual([]);
      }, 60000);

      if (player.skipForward) {
        it("skips 20 seconds for one tap", async () => {
          // With the page's clock ticking on as it's read, so a clock that
          // moved on while paused would show a second past.
          const root = await load({ viewport, tickingClock: true });
          const forward = await root.$(player.skipForward);
          const box = await forward.boundingBox();
          await page.touchscreen.tap(
            box.x + box.width / 2,
            box.y + box.height / 2
          );
          await page.waitForFunction(
            (root, time) => root.querySelector(time).textContent !== "00:00",
            {},
            root,
            player.time
          );
          // Time for a click the tap might also be taken as.
          await new Promise((resolve) => setTimeout(resolve, 500));
          // 20 seconds on, not 40 (as when a tap was also taken as a click).
          expect(await root.$eval(player.time, (el) => el.textContent)).toBe(
            "00:20"
          );
        }, 60000);
      }
    }
  });

  // ON TOUCH DEVICES
  if (player.devices) {
    describe.each(player.devices)("on %s", (_, device, expected) => {
      it("shows the volume controls that work on it", async () => {
        const root = await load(device);
        const { mute, volume } = await reachability(root);
        expect({ mute, volume }).toEqual(expected);
      }, 60000);
    });
  }

  // THE SLIDERS
  const slider = async (root, which) => {
    const handle = await root.$(player.sliders[which]);
    const node = await page.accessibility.snapshot({ root: handle });
    return {
      role: node.role,
      name: node.name,
      valuetext: await handle.evaluate((h) => h.getAttribute("aria-valuetext")),
    };
  };

  it("presents the timeline and volume as sliders, with their values", async () => {
    const root = await load();

    expect(await slider(root, "timeline")).toEqual({
      role: "slider",
      name: "Playback position",
      valuetext: "00:00 of 09:32",
    });
    expect(await slider(root, "volume")).toEqual({
      role: "slider",
      name: "Volume",
      valuetext: "100%",
    });
  }, 60000);

  // Moves through the media with the timeline's keys, checking the time shown
  // after each, and the slider's value. With the page's clock ticking on as
  // it's read (see load), the time shown is where the keys moved to, not a
  // second past: the player's clock doesn't move on while it's paused.
  const expectKeySteps = async (root, valuetext) => {
    const timeline = await root.$(player.sliders.timeline);
    // The keys seek within the media's duration, so do nothing until it's
    // known.
    await page.waitForFunction(
      (media) => document.querySelector(media).readyState >= 1,
      {},
      player.media
    );

    await timeline.focus();
    await page.keyboard.press("ArrowRight");
    await expectTime(root, "00:05");
    await page.keyboard.press("ArrowRight");
    await expectTime(root, "00:10");

    await page.keyboard.press("ArrowLeft");
    await expectTime(root, "00:05");
    expect((await slider(root, "timeline")).valuetext).toEqual(valuetext);

    await page.keyboard.press("Home");
    await expectTime(root, "00:00");
  };

  it("moves through the media with the keyboard, 5 seconds at a time", async () => {
    const root = await load({ tickingClock: true });
    await expectKeySteps(root, "00:05 of 09:32");
  }, 60000);

  if (player.timeline) {
    it("moves through a timeline with the keyboard, 5 seconds at a time", async () => {
      const root = await load({ ...player.timeline, tickingClock: true });
      await expectKeySteps(root, "00:05 of 28:37");
    }, 60000);

    // A pause within a second of the last is put off half a second; play
    // pressed meanwhile should still play. The presses are made with the
    // page's clock held still, so the second pause is always within a
    // second of the first, however slowly they're made.
    it("keeps playing a timeline when play is pressed just after pause", async () => {
      const root = await load(player.timeline);
      const playing = () =>
        page.evaluate(() =>
          [...document.querySelectorAll(".iiif-av-component video")].some(
            (video) => !video.paused
          )
        );
      // Pressed by the pointer first, so the page may play media when it's
      // pressed from within the page after.
      await (await root.$(`.controls-container ${player.play}`)).click();
      await page.waitForFunction(() =>
        [...document.querySelectorAll(".iiif-av-component video")].some(
          (video) => !video.paused
        )
      );
      // The same button plays and pauses (its title says which it will do).
      await root.evaluate(async (root) => {
        const button = root.querySelector(
          ".controls-container button:has(.av-icon-play)"
        );
        const playing = () =>
          [...document.querySelectorAll(".iiif-av-component video")].some(
            (video) => !video.paused
          );
        // Waits up to 10s for the media to be playing or paused, as wanted;
        // fails otherwise, so a press that didn't take isn't passed over.
        const until = async (wanted) => {
          for (let i = 0; i < 100 && playing() !== wanted; i++) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          if (playing() !== wanted) {
            throw new Error(
              `The media was still ${wanted ? "paused" : "playing"} after 10s`
            );
          }
        };
        const now = Date.now;
        const held = now();
        Date.now = () => held;
        try {
          button.click();
          await until(false);
          button.click();
          await until(true);
          button.click();
          button.click();
        } finally {
          Date.now = now;
        }
      });
      // Past when a put-off pause would have taken effect.
      await new Promise((resolve) => setTimeout(resolve, 1500));
      expect(await playing()).toBe(true);
      expect(
        await root.$eval(
          ".controls-container button:has(.av-icon-play)",
          (button) => button.title
        )
      ).toBe("Pause");
    }, 60000);
  }

  it("changes the volume with the keyboard, 10% at a time", async () => {
    const root = await load();
    const volume = await root.$(player.sliders.volume);

    await volume.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");

    expect((await slider(root, "volume")).valuetext).toBe("80%");
    expect(
      await page.$eval(player.media, (video) => video.volume)
    ).toBeCloseTo(0.8, 5);
  }, 60000);

  it("names the sliders in the user's language", async () => {
    const root = await load({ locales: "cy-GB" });

    expect((await slider(root, "timeline")).name).toBe("Safle chwarae");
    expect((await slider(root, "volume")).name).toBe("Lefel sain");
  }, 60000);
});
