const puppeteer = require("puppeteer");
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl } = require("../../scripts/testViewer");

// Each player's controls: the playback buttons, the time display, the volume
// control and the captions control. The AV component plays manifests with
// ranges, and the MediaElement extension manifests without.
const MANIFEST = `${BASE_URL}/test-fixtures/ranges-captioned-video-manifest.json`;
const MEDIAELEMENT_MANIFEST = `${BASE_URL}/test-fixtures/captioned-video-manifest.json`;

// The devices each player's controls should fit.
const SIZES = [
  ["a desktop", { width: 1440, height: 900 }],
  ["a laptop", { width: 1024, height: 768 }],
  ["a tablet", { width: 768, height: 1024, isMobile: true, hasTouch: true }],
  ["a phone", { width: 390, height: 844, isMobile: true, hasTouch: true }],
  ["a small phone", { width: 320, height: 568, isMobile: true, hasTouch: true }],
];

describe("AV component controls", () => {
  let browser;
  let context;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  // Loads the manifest as a new visitor and waits for the player's controls.
  const load = async ({ locales } = {}) => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    await page.goto(viewerUrl(MANIFEST, locales), {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(".iiif-av-component .captions-button", {
      visible: true,
    });
    return page.$(".iiif-av-component .controls-container");
  };

  // Each button in the controls, by its accessible name (what screen readers
  // announce) and its tooltip.
  const buttons = async (controls) => {
    const names = [];
    for (const button of await controls.$$("button")) {
      const { name } = await page.accessibility.snapshot({ root: button });
      names.push({ name, title: await button.evaluate((b) => b.title) });
    }
    return names;
  };

  const button = (controls, icon) =>
    controls.$(`button:has(.${icon}), button.${icon}`);

  const accessibleName = async (element) =>
    (await page.accessibility.snapshot({ root: element })).name;

  // In the order they're shown, which is the order keyboard and screen reader
  // users reach them.
  it("names every control, and its tooltip, in the user's language", async () => {
    const english = await buttons(await load());
    expect(english).toEqual(
      [
        "Previous",
        "Back 20 seconds",
        "Play",
        "Forward 20 seconds",
        "Next",
        "Mute",
        "Captions: Off",
      ].map((name) => ({ name, title: name }))
    );

    const welsh = await buttons(await load({ locales: "cy-GB" }));
    expect(welsh).toEqual(
      [
        "Blaenorol",
        "Yn ôl 20 eiliad",
        "Chwarae",
        "Ymlaen 20 eiliad",
        "Nesaf",
        "Mudo",
        "Capsiynau: I ffwrdd",
      ].map((name) => ({ name, title: name }))
    );
  }, 90000);

  it("never shows 'undefined'", async () => {
    await load();
    const player = await page.$(".iiif-av-component .player");
    const undefinedText = await player.evaluate((player) =>
      [player, ...player.querySelectorAll("*")]
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
    const controls = await load();
    const play = await button(controls, "av-icon-play");
    await page.evaluate(() =>
      document
        .querySelectorAll(".iiif-av-component video")
        .forEach((video) => (video.muted = true))
    );

    await play.click();
    await page.waitForFunction((b) => b.title === "Pause", {}, play);
    expect(await accessibleName(play)).toBe("Pause");

    await play.click();
    await page.waitForFunction((b) => b.title === "Play", {}, play);
    expect(await accessibleName(play)).toBe("Play");
  }, 60000);

  it("names the mute button for what it will do", async () => {
    const controls = await load();
    const mute = await button(controls, "volume-mute");

    await mute.click();
    await page.waitForFunction((b) => b.title === "Unmute", {}, mute);
    expect(await accessibleName(mute)).toBe("Unmute");

    await mute.click();
    await page.waitForFunction((b) => b.title === "Mute", {}, mute);
    expect(await accessibleName(mute)).toBe("Mute");
  }, 60000);

  // FITTING ANY SIZE
  const CONTROLS = {
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
  };

  const SLIDER_HANDLES = {
    timeline: ".canvas-timeline-container .ui-slider-handle",
    volume: ".volume-slider .ui-slider-handle",
  };

  // Loads the manifest on a device of the given size and waits for the
  // player's layout to settle.
  const loadOn = async (viewport) => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    await page.setViewport({ deviceScaleFactor: 1, ...viewport });
    await page.goto(viewerUrl(MANIFEST), { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".iiif-av-component .captions-button", {
      visible: true,
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return page.$(".iiif-av-component .player:not([style*='none'])");
  };

  // For each control: whether it can be seen and reached, i.e. it's laid
  // out, on screen, and the topmost element at its centre (so nothing covers
  // it and no container clips it); and its size.
  const reachability = (player) =>
    player.evaluate((player, controls) => {
      const result = {};
      for (const [name, selector] of Object.entries(controls)) {
        const el = player.querySelector(selector);
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
    }, CONTROLS);

  describe.each(SIZES)("on %s", (_, viewport) => {
    it("shows every control, uncovered and unclipped", async () => {
      const player = await loadOn(viewport);
      const ok = Object.fromEntries(
        Object.keys(CONTROLS).map((name) => [name, "ok"])
      );
      expect(await reachability(player)).toEqual(ok);
    }, 60000);

    if (viewport.hasTouch) {
      it("makes every button at least 44px square, to tap", async () => {
        const player = await loadOn(viewport);
        const small = await player.$$eval(
          ".controls-container button",
          (buttons) =>
            buttons
              .map((b) => {
                const { width, height } = b.getBoundingClientRect();
                return { label: b.title, width, height };
              })
              .filter(({ width, height }) => width < 44 || height < 44)
        );
        expect(small).toEqual([]);
      }, 60000);

      it("skips 20 seconds for one tap", async () => {
        const player = await loadOn(viewport);
        const forward = await player.$(CONTROLS["forward 20 seconds"]);
        const box = await forward.boundingBox();
        await page.touchscreen.tap(
          box.x + box.width / 2,
          box.y + box.height / 2
        );
        await page.waitForFunction(
          (player) =>
            player.querySelector(".canvas-time").textContent !== "00:00",
          {},
          player
        );
        await new Promise((resolve) => setTimeout(resolve, 500));
        // 20 seconds on, not 40 (as when a tap was also taken as a click),
        // allowing for the clock having moved on a moment since.
        const [minutes, seconds] = (
          await player.$eval(".canvas-time", (el) => el.textContent)
        )
          .split(":")
          .map(Number);
        const time = minutes * 60 + seconds;
        expect(time).toBeGreaterThanOrEqual(20);
        expect(time).toBeLessThan(25);
      }, 60000);
    }
  });

  // THE SLIDERS
  const slider = async (player, selector) => {
    const handle = await player.$(selector);
    const node = await page.accessibility.snapshot({ root: handle });
    return {
      role: node.role,
      name: node.name,
      valuetext: await handle.evaluate((h) => h.getAttribute("aria-valuetext")),
    };
  };

  it("presents the timeline and volume as sliders, with their values", async () => {
    const player = await loadOn(SIZES[0][1]);

    expect(await slider(player, SLIDER_HANDLES.timeline)).toEqual({
      role: "slider",
      name: "Playback position",
      valuetext: "00:00 of 09:32",
    });
    expect(await slider(player, SLIDER_HANDLES.volume)).toEqual({
      role: "slider",
      name: "Volume",
      valuetext: "100%",
    });
  }, 60000);

  it("moves through the media with the keyboard, 5 seconds at a time", async () => {
    const player = await loadOn(SIZES[0][1]);
    const time = () => player.$eval(".canvas-time", (el) => el.textContent);

    await (await player.$(SLIDER_HANDLES.timeline)).focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    expect(await time()).toBe("00:10");

    await page.keyboard.press("ArrowLeft");
    expect(await time()).toBe("00:05");
    expect(
      await player.$eval(SLIDER_HANDLES.timeline, (h) =>
        h.getAttribute("aria-valuetext")
      )
    ).toBe("00:05 of 09:32");

    await page.keyboard.press("Home");
    expect(await time()).toBe("00:00");
  }, 60000);

  it("changes the volume with the keyboard, 10% at a time", async () => {
    const player = await loadOn(SIZES[0][1]);
    const handle = await player.$(SLIDER_HANDLES.volume);

    await handle.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");

    expect(await handle.evaluate((h) => h.getAttribute("aria-valuetext"))).toBe(
      "80%"
    );
    expect(
      await page.$eval(".iiif-av-component video", (video) => video.volume)
    ).toBeCloseTo(0.8, 5);
  }, 60000);

  it("names the sliders in the user's language", async () => {
    await load({ locales: "cy-GB" });
    const player = await page.$(
      ".iiif-av-component .player:not([style*='none'])"
    );

    expect((await slider(player, SLIDER_HANDLES.timeline)).name).toBe(
      "Safle chwarae"
    );
    expect((await slider(player, SLIDER_HANDLES.volume)).name).toBe(
      "Lefel sain"
    );
  }, 60000);
});

// The MediaElement extension's controls, as they are today. Unlike the AV
// component's: UV doesn't translate mediaelement's own labels (only the
// captions control's), so they're tested in English; its buttons are smaller
// than 44px square; it has no buttons to skip 20 seconds; and its keyboard
// steps are mediaelement's own. A video's volume slider only appears over the
// mute button, so isn't among the controls that should always be in view.
describe("MediaElement controls", () => {
  let browser;
  let context;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  // Loads the manifest as a new visitor, on a device of the given size, and
  // waits for the player's controls and their layout to settle.
  const load = async (viewport = SIZES[0][1]) => {
    if (context) {
      await context.close();
    }
    context = await browser.createBrowserContext();
    page = await context.newPage();
    await page.setViewport({ deviceScaleFactor: 1, ...viewport });
    await page.goto(viewerUrl(MEDIAELEMENT_MANIFEST), {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(".mejs__controls .captions-button", {
      visible: true,
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return page.$(".mejs__container");
  };

  const accessibleName = async (element) =>
    (await page.accessibility.snapshot({ root: element })).name;

  const CONTROLS = {
    play: ".mejs__playpause-button button",
    time: ".mejs__currenttime",
    timeline: ".mejs__time-total",
    mute: ".mejs__volume-button button",
    captions: ".captions-button",
    fullscreen: ".mejs__fullscreen-button button",
  };

  // In the order they're shown, which is the order keyboard and screen reader
  // users reach them.
  it("names every control", async () => {
    const player = await load();
    const names = [];
    for (const button of await player.$$(".mejs__controls button")) {
      names.push(await accessibleName(button));
    }
    expect(names).toEqual(["Play", "Mute", "Captions: Off", "Fullscreen"]);
  }, 60000);

  it("never shows 'undefined'", async () => {
    const player = await load();
    const undefinedText = await player.evaluate((player) =>
      [player, ...player.querySelectorAll("*")]
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
    await load();
    const play = await page.$(CONTROLS.play);
    await page.evaluate(() =>
      document
        .querySelectorAll(".mejs__container video")
        .forEach((video) => (video.muted = true))
    );

    await play.click();
    await page.waitForFunction(
      (b) => b.getAttribute("aria-label") === "Pause",
      {},
      play
    );
    expect(await accessibleName(play)).toBe("Pause");

    await play.click();
    await page.waitForFunction(
      (b) => b.getAttribute("aria-label") === "Play",
      {},
      play
    );
    expect(await accessibleName(play)).toBe("Play");
  }, 60000);

  it("names the mute button for what it will do", async () => {
    await load();
    const mute = await page.$(CONTROLS.mute);

    await mute.click();
    await page.waitForFunction(
      (b) => b.getAttribute("aria-label") === "Unmute",
      {},
      mute
    );
    expect(await accessibleName(mute)).toBe("Unmute");

    await mute.click();
    await page.waitForFunction(
      (b) => b.getAttribute("aria-label") === "Mute",
      {},
      mute
    );
    expect(await accessibleName(mute)).toBe("Mute");
  }, 60000);

  // For each control: whether it can be seen and reached, i.e. it's laid
  // out, on screen, and the topmost element at its centre (so nothing covers
  // it and no container clips it).
  const reachability = (player) =>
    player.evaluate((player, controls) => {
      const result = {};
      for (const [name, selector] of Object.entries(controls)) {
        const el = player.querySelector(selector);
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
    }, CONTROLS);

  describe.each(SIZES)("on %s", (_, viewport) => {
    it("shows every control, uncovered and unclipped", async () => {
      const player = await load(viewport);
      const ok = Object.fromEntries(
        Object.keys(CONTROLS).map((name) => [name, "ok"])
      );
      expect(await reachability(player)).toEqual(ok);
    }, 60000);
  });

  it("presents the timeline and volume as sliders, by name", async () => {
    const player = await load();
    // mediaelement gives the timeline its name and value while it's focused
    // and paused.
    await player.$eval(CONTROLS.timeline, (timeline) => timeline.focus());
    const sliders = await player.$$eval(
      ".mejs__time-total, .mejs__volume-slider",
      (sliders) =>
        sliders.map((slider) => ({
          role: slider.getAttribute("role"),
          name: slider.getAttribute("aria-label"),
        }))
    );
    expect(sliders).toEqual([
      { role: "slider", name: "Time Slider" },
      { role: "slider", name: "Volume Slider" },
    ]);
  }, 60000);
});
