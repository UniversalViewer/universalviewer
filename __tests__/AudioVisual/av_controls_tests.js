let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl } = require("../../scripts/testViewer");

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
  // layout to settle, and returns the player in use.
  const load = async ({
    locales,
    viewport = SIZES[0][1],
    userAgent,
    touchPoints,
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
    await page.setViewport({ deviceScaleFactor: 1, ...viewport });
    await page.goto(viewerUrl(player.manifest, locales), {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(`${player.root} .captions-button`, {
      visible: true,
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return page.$(player.root);
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

  // The current time shown, waiting up to 2s for the one expected: the
  // MediaElement player seeks just after a key press, and shows the new time
  // once the media has moved there.
  const expectTime = async (root, expected) => {
    const time = () => root.$eval(player.time, (el) => el.textContent);
    for (let i = 0; i < 20 && (await time()) !== expected; i++) {
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
          const root = await load({ viewport });
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
          await new Promise((resolve) => setTimeout(resolve, 500));
          // 20 seconds on, not 40 (as when a tap was also taken as a click),
          // allowing for the clock having moved on a moment since.
          const [minutes, seconds] = (
            await root.$eval(player.time, (el) => el.textContent)
          )
            .split(":")
            .map(Number);
          const time = minutes * 60 + seconds;
          expect(time).toBeGreaterThanOrEqual(20);
          expect(time).toBeLessThan(25);
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

  it("moves through the media with the keyboard, 5 seconds at a time", async () => {
    const root = await load();
    const timeline = await root.$(player.sliders.timeline);

    await timeline.focus();
    await page.keyboard.press("ArrowRight");
    await expectTime(root, "00:05");
    await page.keyboard.press("ArrowRight");
    await expectTime(root, "00:10");

    await page.keyboard.press("ArrowLeft");
    await expectTime(root, "00:05");
    expect((await slider(root, "timeline")).valuetext).toBe("00:05 of 09:32");

    await page.keyboard.press("Home");
    await expectTime(root, "00:00");
  }, 60000);

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
