let puppeteer;
const { BASE_URL } = require("../../scripts/testBaseUrl");

// Local paged book of static images, with ranges for the Index tab. Modelled
// on these IIIF Cookbook recipes (also credited in the manifest's summary):
// - 0031 Multiple Volumes in a Single Bound Volume (nested ranges); this
//   fixture replaces that recipe's manifest in these tests
//   https://iiif.io/api/cookbook/recipe/0031-bound-multivolume/
// - 0011 Book 'behavior' Variations (the "paged" behavior)
//   https://iiif.io/api/cookbook/recipe/0011-book-3-behavior/
// - 0001 Simplest Manifest - Single Image File (static images, no service)
//   https://iiif.io/api/cookbook/recipe/0001-mvm-image/
const IMAGE_BOOK_MANIFEST = `${BASE_URL}/test-fixtures/image-paged-book-manifest.json`;

// The images on the book's first two canvases.
const FIRST_IMAGE = `${BASE_URL}/test-fixtures/image-fixture-1-euclid-page.jpg`;
const SECOND_IMAGE = `${BASE_URL}/test-fixtures/image-fixture-2-euclid-papyrus.jpg`;

// The URLs of everything the page has fetched.
const fetched = (page) =>
  page.evaluate(() =>
    performance.getEntriesByType("resource").map((entry) => entry.name)
  );

const viewerUrl = (manifestUrl) => {
  //const separator = BASE_URL.includes("#?") ? "&" : "#?";
  return `${BASE_URL}#?manifest=${encodeURIComponent(manifestUrl)}`;
};

describe("Universal Viewer", () => {
  let browser;
  let context;
  let page;

  const getRotationFromNavigator = async () => {
    return await page.evaluate(() => {
      const el = document.querySelector(".displayregioncontainer");
      if (!el) return 0;

      const transform = el.style.transform || "";
      const match = transform.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/);
      if (!match) return 0;

      const deg = Number(match[1]);
      return ((deg % 360) + 360) % 360;
    });
  };

  const waitForRotation = async (expectedRotation) => {
    await page.waitForFunction(
      (expected) => {
        const el = document.querySelector(".displayregioncontainer");
        if (!el) return false;

        const transform = el.style.transform || "";
        const match = transform.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/);
        const current = match ? Number(match[1]) : 0;

        return ((current % 360) + 360) % 360 === expected;
      },
      {},
      expectedRotation
    );
  };

  const getCanvasValue = (url) => {
    const match = url.match(/(?:^|[?&#])(cv|canvas|page)=([^&#]*)/);
    if (!match) return 0;

    const rawValue = match[2];
    if (rawValue === "") return 0;

    const value = Number(rawValue);
    if (Number.isNaN(value)) return 0;

    return value;
  };

  const waitForCanvasValue = async (page, expected) => {
    await page.waitForFunction(
      (expectedValue) => {
        const match = window.location.href.match(
          /(?:^|[?&#])(cv|canvas|page)=([^&#]*)/
        );
        if (!match) return expectedValue === 0;

        const rawValue = match[2];
        if (rawValue === "") return expectedValue === 0;

        const value = Number(rawValue);
        return value === expectedValue;
      },
      {},
      expected
    );
  };

  const getXywhValue = (url) => {
    const match = url.match(/[?&#]xywh=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  // The region shown (xywh), once it's other than `previous` and has stopped
  // changing: the viewer updates it as it animates a zoom, and first as it
  // opens the image.
  const settledXywh = async (page, previous = null) => {
    let last;
    for (let waited = 0; waited < 15000; waited += 250) {
      const current = getXywhValue(page.url());
      if (current !== null && current !== previous && current === last) {
        return current;
      }
      last = current;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error(`The region shown didn't settle (last: ${last})`);
  };

  // A region's width and height.
  const regionSize = (xywh) => {
    const [, , w, h] = xywh.split(",").map(Number);
    return { w, h };
  };

  // Each test opens the viewer as a new visitor: in a new browser context,
  // so nothing a test does (including what the viewer remembers in
  // localStorage) carries over to another, whatever order they run in.
  const openFreshViewer = async () => {
    if (context) await context.close();
    context = await browser.createBrowserContext();
    page = await context.newPage();

    await page.goto(viewerUrl(IMAGE_BOOK_MANIFEST), {
      waitUntil: "domcontentloaded",
    });
  };

  beforeAll(async () => {
    puppeteer = (await import("puppeteer")).default;
    browser = await puppeteer.launch();
  });

  beforeEach(openFreshViewer);

  afterAll(async () => {
    await browser.close();
  });

  // The viewer runs on the examples page, not a page of its own, so this only
  // shows the test server is serving that page.
  it("opens on the examples page", async () => {
    const title = await page.title();
    expect(title).toBe("Universal Viewer Examples");
  });

  it("loads the viewer images", async () => {
    // The thumbnail's <img> is attached after its #thumb-0 container. It has
    // loaded once it's complete with a width.
    await page.waitForSelector("#thumb-0 img");
    await page.waitForFunction(() => {
      const img = document.querySelector("#thumb-0 img");
      return img.complete && img.naturalWidth > 0;
    });
    const imageSrc = await page.$eval("#thumb-0 img", (e) => e.src);
    expect(imageSrc).toEqual(
      expect.stringContaining(
        `${BASE_URL}/test-fixtures/image-fixture-1-euclid-page-thumb.jpg`
      )
    );

    // The main viewer has opened the first canvas's image: it has fetched it
    // and shows a region of it.
    await settledXywh(page);
    expect(await fetched(page)).toContain(FIRST_IMAGE);
  });

  it("can toggle thumbnail label truncation", async () => {
    await page.waitForSelector("#truncateThumbnailLabels");
    await page.waitForSelector(".thumbsView .thumbs .thumb .info .label");

    const isCheckedBeforeToggle = await page.$eval(
      "#truncateThumbnailLabels",
      (checkbox) => checkbox.checked
    );
    expect(isCheckedBeforeToggle).toBe(true);

    const labelOverflowBeforeToggle = await page.evaluate(() => {
      const label = document.querySelector(
        ".thumbsView .thumbs .thumb .info .label"
      );
      return getComputedStyle(label).overflowX;
    });
    expect(labelOverflowBeforeToggle).toBe("hidden");

    await page.evaluate(() => {
      document.querySelector("#truncateThumbnailLabels").click();
    });

    const isCheckedAfterToggle = await page.$eval(
      "#truncateThumbnailLabels",
      (checkbox) => checkbox.checked
    );
    expect(isCheckedAfterToggle).toBe(false);

    // The thumbnails are drawn again without truncation.
    await page.waitForSelector(".thumbsView .thumbs:not(.truncate-labels)");
    const labelOverflowAfterToggle = await page.evaluate(() => {
      const label = document.querySelector(
        ".thumbsView .thumbs .thumb .info .label"
      );
      return getComputedStyle(label).overflowX;
    });
    expect(labelOverflowAfterToggle).toBe("visible");
  });

  it("can toggle gallery view", async () => {
    const galleryButton = ".btn.imageBtn.gallery";
    const twoUpButton = ".btn.imageBtn.two-up";
    // The gallery view's component is only created once gallery view is
    // first opened; the multi-select dialogue has its own hidden one.
    const gallery = ".galleryView .iiif-gallery-component";
    const thumbsView = ".leftPanel .thumbsView";

    const ariaPressed = (selector) =>
      page.$eval(selector, (el) => el.getAttribute("aria-pressed"));
    const isVisible = (selector) =>
      page.evaluate((sel) => {
        const el = document.querySelector(sel);
        return !!el && el.offsetParent !== null;
      }, selector);

    // The header hides the gallery and paging buttons at Puppeteer's default
    // 800px width, so use a desktop-sized viewport to click them as a user.
    await page.setViewport({ width: 1280, height: 800 });

    // Gallery view is not the default: the sidebar thumbnails show instead.
    await page.waitForSelector(galleryButton, { visible: true });
    await page.waitForSelector(thumbsView, { visible: true });
    expect(await ariaPressed(galleryButton)).toBe("false");
    expect(await isVisible(gallery)).toBe(false);

    // Toggling gallery view on shows every canvas in the gallery and hides
    // the sidebar thumbnails.
    await page.click(galleryButton);
    await page.waitForSelector(gallery, { visible: true });
    await page.waitForSelector(thumbsView, { hidden: true });
    await page.waitForFunction(
      (sel) =>
        document.querySelector(sel).getAttribute("aria-pressed") === "true",
      {},
      galleryButton
    );
    expect(await page.$$eval(`${gallery} .thumb`, (els) => els.length)).toBe(6);

    // Choosing two-up toggles gallery view off again.
    await page.click(twoUpButton);
    await page.waitForSelector(gallery, { hidden: true });
    await page.waitForSelector(thumbsView, { visible: true });
    await page.waitForFunction(
      (sel) =>
        document.querySelector(sel).getAttribute("aria-pressed") === "false",
      {},
      galleryButton
    );
    expect(await ariaPressed(twoUpButton)).toBe("true");
  });

  it("labels gallery thumbnail size controls", async () => {
    // Scope to the gallery view, which is only created once gallery view is
    // first opened. The multi-select dialogue renders its own (hidden)
    // gallery component with the same controls.
    const gallery = ".galleryView .iiif-gallery-component";
    const galleryButton = ".btn.imageBtn.gallery";
    // The header hides the gallery button at Puppeteer's default 800px width.
    await page.setViewport({ width: 1280, height: 800 });
    await page.waitForSelector(galleryButton, { visible: true });
    await page.click(galleryButton);
    await page.waitForSelector(`${gallery} .size-down`, { visible: true });

    const labels = await page.$$eval(
      [
        `${gallery} .size-down`,
        `${gallery} input[type='range'][name='size']`,
        `${gallery} .size-up`,
      ].join(", "),
      (controls) =>
        controls.map((control) => control.getAttribute("aria-label"))
    );

    expect(labels).toEqual([
      "Decrease thumbnail size",
      "Thumbnail size",
      "Increase thumbnail size",
    ]);
  });

  it("settings button is visible", async () => {
    await page.waitForSelector(".btn.imageBtn.settings");

    const isSettingsButtonVisible = await page.evaluate(() => {
      const settingsButton = document.querySelector(".btn.imageBtn.settings");
      const style = window.getComputedStyle(settingsButton);
      return (
        style.getPropertyValue("visibility") !== "hidden" &&
        style.getPropertyValue("display") !== "none"
      );
    });

    expect(isSettingsButtonVisible).toBe(true);
  });

  // VIEWER CONTROLS
  describe("viewer controls", () => {
    // can navigate back and forth
    it("can navigate back and forth", async () => {
      await page.waitForSelector(".btn.imageBtn.next", { visible: true });
      await page.waitForSelector(".btn.imageBtn.prev", { visible: true });

      // Whether the prev button is disabled, once it's as expected (it's
      // updated after the URL), or after 5 seconds.
      const isPrevDisabled = async (expected) => {
        await page
          .waitForFunction(
            (expected) =>
              document.querySelector(".btn.imageBtn.prev").disabled ===
              expected,
            { timeout: 5000 },
            expected
          )
          .catch(() => undefined);
        return page.$eval(".btn.imageBtn.prev", (btn) => btn.disabled);
      };

      // Which thumbnails are selected, once they're as expected (they're
      // updated after the URL), or after 5 seconds.
      const selectedThumbs = async (expected) => {
        const selected = () =>
          page.$$eval(".thumbsView .thumb.selected", (thumbs) =>
            thumbs.map((thumb) => thumb.closest(".thumb-container").id)
          );
        for (let waited = 0; waited < 5000; waited += 250) {
          if ((await selected()).join() === expected.join()) break;
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
        return selected();
      };

      const startValue = getCanvasValue(page.url());
      expect(await isPrevDisabled(true)).toBe(true);
      expect(await selectedThumbs(["thumb-0"])).toEqual(["thumb-0"]);
      const startXywh = await settledXywh(page);

      await page.click(".btn.imageBtn.next");
      await waitForCanvasValue(page, 1);

      const nextValue = getCanvasValue(page.url());
      expect(await isPrevDisabled(false)).toBe(false);
      // The book is "paged": its first page is shown alone, then the next
      // two canvases side by side.
      expect(await selectedThumbs(["thumb-1", "thumb-2"])).toEqual([
        "thumb-1",
        "thumb-2",
      ]);
      // The second canvas's image is opened, and the region shown changes
      // from the first page's.
      await settledXywh(page, startXywh);
      expect(await fetched(page)).toContain(SECOND_IMAGE);

      await page.click(".btn.imageBtn.prev");
      await waitForCanvasValue(page, 0);

      const previousValue = getCanvasValue(page.url());
      expect(await isPrevDisabled(true)).toBe(true);

      expect(startValue).toBe(0);
      expect(nextValue).toBe(1);
      expect(previousValue).toBe(0);
    });

    // zoom in and zoom out
    it("can zoom in and zoom out", async () => {
      await page.waitForSelector(".zoomIn.viewportNavButton", {
        visible: true,
      });
      await page.waitForSelector(".zoomOut.viewportNavButton", {
        visible: true,
      });

      // The region shown once the image has opened, before zooming.
      const initialXywh = await settledXywh(page);

      await page.$eval(".zoomIn.viewportNavButton", (el) => el.click());
      const zoomInXywh = await settledXywh(page, initialXywh);
      expect(zoomInXywh).toMatch(/^-?\d+,-?\d+,\d+,\d+$/);

      // Zooming in shows less of the image.
      expect(regionSize(zoomInXywh).w).toBeLessThan(regionSize(initialXywh).w);
      expect(regionSize(zoomInXywh).h).toBeLessThan(regionSize(initialXywh).h);

      await page.$eval(".zoomOut.viewportNavButton", (el) => el.click());
      const zoomOutXywh = await settledXywh(page, zoomInXywh);
      expect(zoomOutXywh).toMatch(/^-?\d+,-?\d+,\d+,\d+$/);

      // Zooming out shows more.
      expect(regionSize(zoomOutXywh).w).toBeGreaterThan(regionSize(zoomInXywh).w);
      expect(regionSize(zoomOutXywh).h).toBeGreaterThan(regionSize(zoomInXywh).h);
    });

    // rotate image
    it("can rotate image", async () => {
      await page.waitForSelector(".rotate.viewportNavButton", {
        visible: true,
      });

      // Read once the image has opened.
      await settledXywh(page);
      const initialRot = await getRotationFromNavigator();

      await page.$eval(".rotate.viewportNavButton", (el) => el.click());
      await waitForRotation(90);

      const rotatedRot = await getRotationFromNavigator();
      expect(initialRot).toBe(0);
      expect(rotatedRot).toBe(90);
    });

    // open and close adjust image control
    it("can open and close adjust image control", async () => {
      const btn = "button.viewportNavButton.adjustImage";
      const overlay = "div.overlay.adjustImage";
      const heading = "div.overlay.adjustImage .content .heading";

      await page.waitForSelector(btn, { visible: true });
      await page.$eval(btn, (el) => el.click());

      await page.waitForSelector(overlay, { visible: true });

      const text = await page.$eval(heading, (el) => el.textContent.trim());
      expect(text).toBe("Adjust image");

      // This dialogue's own Close button: every dialogue's close button has
      // the same classes, and its Reset button is a copy of Close, before it.
      await page.$eval(overlay, (dialogue) => {
        const buttons = dialogue.querySelectorAll(".buttons .close");
        buttons[buttons.length - 1].click();
      });

      await page.waitForSelector(overlay, { hidden: true });
    });
  });

  describe("content panel", () => {
    const contentExpandBtn = "button.expandButton";
    const contentCollapseBtn = "button.collapseButton";
    const contentTabs = "div.leftPanel";
    const contentIndexTab = ".index.tab";
    const contentIndexActiveTab = ".index.tab.on";
    const contentThumbnailsTab = ".thumbs.tab";
    const contentThumbnailsActiveTab = ".thumbs.tab.on";

    // switch content tabs and collapse content panel
    it("can switch content tabs", async () => {
      await page.waitForSelector(contentThumbnailsActiveTab, { visible: true });

      await page.click(contentIndexTab);
      await page.waitForSelector(contentIndexActiveTab, { visible: true });

      expect(
        await page.$eval(contentIndexTab, (el) => el.classList.contains("on"))
      ).toBe(true);

      expect(
        await page.$eval(contentThumbnailsTab, (el) =>
          el.classList.contains("on")
        )
      ).toBe(false);

      // The index of the book's ranges shows in place of the thumbnails.
      const index = ".leftPanel .views .treeView";
      await page.waitForSelector(index, { visible: true });
      await page.waitForSelector(".leftPanel .thumbsView", { hidden: true });
      expect(await page.$eval(index, (el) => el.innerText)).toContain(
        "Ancient sources"
      );
    });

    it("can collapse content", async () => {
      await page.waitForSelector(contentTabs, { visible: true });
      await page.waitForSelector(contentCollapseBtn, { visible: true });

      await page.click(contentCollapseBtn);

      await page.waitForSelector(contentExpandBtn, { visible: true });
      await page.waitForSelector(".leftPanel .tabs", { hidden: true });
    });

    // The panel opens as the viewer starts, taking 300ms to. Collapsed
    // within that time (clicked as soon as it starts opening), it ends up
    // collapsed, says so, and stays so.
    it("can collapse content while it's still opening", async () => {
      const clickedWhileOpening = await page.evaluate(
        () =>
          new Promise((resolve) => {
            const collapse = () => {
              const panel = document.querySelector(".leftPanel");
              if (!panel || !panel.classList.contains("open")) {
                return false;
              }
              const opening = !panel.classList.contains("open-finished");
              panel.querySelector(".collapseButton").click();
              resolve(opening);
              return true;
            };
            if (!collapse()) {
              const observer = new MutationObserver(() => {
                if (collapse()) {
                  observer.disconnect();
                }
              });
              observer.observe(document.body, {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: ["class"],
              });
            }
          })
      );
      expect(clickedWhileOpening).toBe(true);

      const collapsed = {
        open: false,
        // The viewer lays itself out for an open panel.
        laidOutOpen: false,
        collapseExpanded: "false",
        expandExpanded: "false",
      };
      const panelState = () =>
        page.$eval(".leftPanel", (panel) => ({
          open: panel.classList.contains("open"),
          laidOutOpen: panel.parentElement.classList.contains("leftPanelOpen"),
          collapseExpanded: panel
            .querySelector(".collapseButton")
            .getAttribute("aria-expanded"),
          expandExpanded: panel
            .querySelector(".expandButton")
            .getAttribute("aria-expanded"),
        }));
      await page.waitForSelector(`.leftPanel ${contentExpandBtn}`, {
        visible: true,
      });
      // Gives both toggles time to finish.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      expect(await panelState()).toEqual(collapsed);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      expect(await panelState()).toEqual(collapsed);
    }, 30000);
  });

  describe("more information panel", () => {
    const moreInfoExpandBtn = ".rightPanel button.expandButton";
    const moreInfoCollapseBtn = ".rightPanel button.collapseButton";
    const moreInfoHeader = ".rightPanel div.header";

    it("can expand and collapse moreInformation panel", async () => {
      await page.waitForSelector(moreInfoExpandBtn, { visible: true });
      await page.click(moreInfoExpandBtn);

      // verify expanded state and header
      await page.waitForSelector(moreInfoCollapseBtn, { visible: true });
      await page.waitForSelector(moreInfoHeader, { visible: true });

      const headers = await page.$$eval(moreInfoHeader, (els) =>
        els.map((el) => el.textContent.trim())
      );

      expect(headers).toContain("About the item");

      await page.click(moreInfoCollapseBtn);
      await page.waitForSelector(moreInfoExpandBtn, { visible: true });
      await page.waitForSelector(moreInfoHeader, { hidden: true });
    });
  });
});
