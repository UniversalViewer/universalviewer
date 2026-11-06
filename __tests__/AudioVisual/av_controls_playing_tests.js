let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");
const { viewerUrl, waitUntilStill } = require("../../scripts/testViewer");

// Each player's controls stay in view while it plays. In the AV component,
// when the canvas has no label (as in IIIF Cookbook recipe 0026), the panel
// has no title until a range plays, whose label then takes up room above the
// player. The MediaElement extension plays manifests without ranges, so has
// no range title to make room for.
const fixture = (name) => `${BASE_URL}/test-fixtures/${name}`;

const PLAYERS = [
  {
    player: "mediaelement (manifests without ranges)",
    manifest: "captioned-video-manifest.json",
    play: ".mejs__playpause-button button",
    controls: ".mejs__controls button",
    controlCount: 4,
    // mediaelement hides a video's controls while it plays unless the
    // pointer is over the player.
    hover: ".mejs__container",
  },
  {
    player: "the AV component (manifests with ranges)",
    manifest: "ranges-unlabelled-canvas-video-manifest.json",
    play: ".iiif-av-component .controls-container button:has(.av-icon-play)",
    controls: ".iiif-av-component .controls-container button",
    // Previous, play, next, fast forward, fast rewind and mute (no captions
    // button: the manifest has no captions).
    controlCount: 6,
    rangeTitle: "Feeding the chicks",
  },
];

describe.each(PLAYERS)("Controls in $player while playing", (player) => {
  let browser;
  let page;

  beforeAll(async () => {
    puppeteer = (await import("puppeteer")).default;
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  });

  // Each test has its own page, as the tests run in random order, and one
  // that's played the media would leave it playing for the next. Loading the
  // viewer can be slow while other tests run, so it has 60s.
  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(viewerUrl(fixture(player.manifest)), {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(player.play, { visible: true });
  }, 60000);

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  // The controls shown (by class), and those of them cut off by the panel
  // or covered, by class and why.
  const controlsInView = async () => {
    if (player.hover) {
      await page.hover(player.hover);
      // mediaelement fades its controls in, and keeps them offscreen until
      // they've faded in.
      await page.waitForFunction(
        () => !document.querySelector(".mejs__controls.mejs__offscreen")
      );
    }
    return page.evaluate((selector) => {
      const panel = document
        .querySelector(".centerPanel .content")
        .getBoundingClientRect();
      const shown = Array.from(document.querySelectorAll(selector)).filter(
        (button) => button.offsetParent
      );
      const problems = shown
        .map((button) => {
          const { x, y, width, height, top, bottom } =
            button.getBoundingClientRect();
          const seen = document.elementFromPoint(x + width / 2, y + height / 2);
          const name = button.className || button.innerHTML;
          if (top < panel.top) {
            return `${name}: ${panel.top - top}px above the panel`;
          }
          if (bottom > panel.bottom) {
            return `${name}: ${bottom - panel.bottom}px below the panel`;
          }
          if (!(seen === button || button.contains(seen))) {
            return `${name}: covered by ${seen && seen.className}`;
          }
          return null;
        })
        .filter(Boolean);
      return {
        shown: shown.map(
          (button) =>
            button.getAttribute("aria-label") ||
            button.title ||
            button.className
        ),
        problems,
      };
    }, player.controls);
  };

  // Every control is shown (none hidden, which the check for being in view
  // would otherwise skip), and in view.
  const expectEveryControlInView = async () => {
    const { shown, problems } = await controlsInView();
    expect(shown).toHaveLength(player.controlCount);
    expect(problems).toEqual([]);
  };

  it("shows every control before playing", async () => {
    await expectEveryControlInView();
  });

  it("keeps every control in view once playing", async () => {
    // The player is still being laid out as it loads (its controls move),
    // and a click aimed at where the play button was can miss it.
    await waitUntilStill(page, player.play);
    await page.click(player.play);
    if (player.rangeTitle) {
      // Playing shows the range's title above the player.
      await page.waitForFunction(
        (title) =>
          document.querySelector(".centerPanel h1.title").textContent.trim() ===
          title,
        {},
        player.rangeTitle
      );
    } else {
      await page.waitForFunction(() =>
        Array.from(document.querySelectorAll(".centerPanel video")).some(
          (video) => !video.paused
        )
      );
    }
    // Gives the panel time to lay out.
    await new Promise((resolve) => setTimeout(resolve, 500));
    await expectEveryControlInView();
  });
});
