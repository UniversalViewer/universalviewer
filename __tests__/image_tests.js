const puppeteer = require("puppeteer");
const { BASE_URL } = require("../scripts/testBaseUrl");

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

const viewerUrl = (manifestUrl) => {
  //const separator = BASE_URL.includes("#?") ? "&" : "#?";
  return `${BASE_URL}#?manifest=${encodeURIComponent(manifestUrl)}`;
};

describe("Universal Viewer", () => {
  let browser;
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

  const waitForXywhChange = async (page, previous) => {
    await page.waitForFunction(
      (prev) => {
        const match = window.location.href.match(/[?&#]xywh=([^&]+)/);
        const current = match ? decodeURIComponent(match[1]) : null;
        return current !== null && current !== prev;
      },
      {},
      previous
    );
  };

  // Navigating to a URL that differs only by #hash doesn't reload the page,
  // and navigating away from a busy viewer can stall, so open the viewer on a
  // fresh page whenever a test needs a clean state.
  const openFreshViewer = async () => {
    if (page) await page.close();
    page = await browser.newPage();
    await page.goto(viewerUrl(IMAGE_BOOK_MANIFEST), {
      waitUntil: "domcontentloaded",
    });
  };

  beforeAll(async () => {
    browser = await puppeteer.launch();
    await openFreshViewer();
  });

  afterAll(async () => {
    await browser.close();
  });

  // Default manifest test
  it("has the correct page title", async () => {
    const title = await page.title();
    expect(title).toBe("Universal Viewer Examples");
  });

  it("loads the viewer images", async () => {
    // The thumbnail's <img> is attached after its #thumb-0 container.
    await page.waitForSelector("#thumb-0 img");
    const imageSrc = await page.$eval("#thumb-0 img", (e) => e.src);
    expect(imageSrc).toEqual(
      expect.stringContaining(
        `${BASE_URL}/test-fixtures/image-fixture-1-euclid-page-thumb.jpg`
      )
    );
  });

  it("can toggle thumbnail label truncation", async () => {
    await page.waitForSelector("#truncateThumbnailLabels");

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
    await page.evaluate(() => {
      document.querySelector(".uv-icon-gallery").click();
    });
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

    await page.evaluate(() => {
      document.querySelector(".uv-icon-two-up").click();
    });
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
    beforeEach(openFreshViewer);

    // can navigate back and forth
    it("can navigate back and forth", async () => {
      await page.waitForSelector(".btn.imageBtn.next", { visible: true });
      await page.waitForSelector(".btn.imageBtn.prev", { visible: true });

      const startValue = getCanvasValue(page.url());

      const isPrevDisabledInitially = await page.$eval(
        ".btn.imageBtn.prev",
        (btn) => btn.disabled
      );
      expect(isPrevDisabledInitially).toBe(true);

      await page.click(".btn.imageBtn.next");
      await waitForCanvasValue(page, 1);

      const nextValue = getCanvasValue(page.url());
      const isPrevDisabledAfterNext = await page.$eval(
        ".btn.imageBtn.prev",
        (btn) => btn.disabled
      );
      expect(isPrevDisabledAfterNext).toBe(false);

      await page.click(".btn.imageBtn.prev");
      await waitForCanvasValue(page, 0);

      const previousValue = getCanvasValue(page.url());
      const isPrevDisabledAgain = await page.$eval(
        ".btn.imageBtn.prev",
        (btn) => btn.disabled
      );
      expect(isPrevDisabledAgain).toBe(true);

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

      const initialUrl = page.url();
      const initialXywh = getXywhValue(initialUrl);

      await page.$eval(".zoomIn.viewportNavButton", (el) => el.click());
      await waitForXywhChange(page, initialXywh);

      const zoomInUrl = page.url();
      const zoomInXywh = getXywhValue(zoomInUrl);

      expect(zoomInXywh).not.toBeNull();
      expect(zoomInXywh).not.toBe(initialXywh);
      expect(zoomInXywh).toMatch(/^-?\d+,-?\d+,\d+,\d+$/);

      await page.$eval(".zoomOut.viewportNavButton", (el) => el.click());
      await waitForXywhChange(page, zoomInXywh);

      const zoomOutUrl = page.url();
      const zoomOutXywh = getXywhValue(zoomOutUrl);

      expect(zoomOutXywh).not.toBeNull();
      expect(zoomOutXywh).not.toBe(zoomInXywh);
      expect(zoomOutXywh).toMatch(/^-?\d+,-?\d+,\d+,\d+$/);
    });

    // rotate image
    it("can rotate image", async () => {
      await page.waitForSelector(".rotate.viewportNavButton", {
        visible: true,
      });

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
      const closeBtn = ".btn.btn-default.close";

      await page.waitForSelector(btn, { visible: true });
      await page.$eval(btn, (el) => el.click());

      await page.waitForSelector(overlay, { visible: true });

      const text = await page.$eval(heading, (el) => el.textContent.trim());
      expect(text).toBe("Adjust image");

      await page.$eval(closeBtn, (el) => el.click());

      const isOverlayVisible = await page.evaluate(() => {
        const isOverlayVisible = document.querySelector(
          "div.overlay.adjustImage"
        );
        const style = window.getComputedStyle(isOverlayVisible);

        return (
          style.getPropertyValue("display") === "none" ||
          style.getPropertyValue("visibility") === "hidden"
        );
      });
      expect(isOverlayVisible).toBe(false);
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

    beforeEach(openFreshViewer);

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
    });

    it("can collapse content", async () => {
      await page.waitForSelector(contentTabs, { visible: true });
      await page.waitForSelector(contentCollapseBtn, { visible: true });

      await page.click(contentCollapseBtn);

      await page.waitForSelector(contentExpandBtn, { visible: true });
      await page.waitForSelector(".leftPanel .tabs", { hidden: true });
    });
  });

  describe("more information panel", () => {
    const moreInfoExpandBtn = ".rightPanel button.expandButton";
    const moreInfoCollapseBtn = ".rightPanel button.collapseButton";
    const moreInfoHeader = ".rightPanel div.header";

    beforeEach(openFreshViewer);

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
