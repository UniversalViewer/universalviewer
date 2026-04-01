test.skip("Configuration options", () => {});

const puppeteer = require("puppeteer");

describe("Universal Viewer", () => {
  let browser;
  let page;

  const getRotValue = (url) => {
    const match =
      url.match(/[?&#]rot=([^&]+)/) ||
      url.match(/[?&#]rotation=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  const normalizeRot = (value) => {
    const num = Number(value ?? 0);
    return ((num % 360) + 360) % 360;
  };

  const getCanvasValue = (url) => {
    const match =
      url.match(/(?:^|[?&#])cv=(\d+)/) ||
      url.match(/(?:^|[?&#])canvas=(\d+)/) ||
      url.match(/(?:^|[?&#])page=(\d+)/);
    
    return match ? Number(match[1]) : null;
  };

  const getXywhValue = (url) => {
    const match = url.match(/[?&#]xywh=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };
  
  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://localhost:4444");
  });

  afterAll(async () => {
    await browser.close();
  });

  it("has the correct page title", async () => {
    const title = await page.title();
    expect(title).toBe("Universal Viewer Examples");
  });

  it("loads the viewer images", async () => {
    await page.waitForSelector("#thumb-0");
    const imageSrc = await page.$eval("#thumb-0 img", (e) => e.src);
    expect(imageSrc).toEqual(
      expect.stringContaining(
        "https://iiif.wellcomecollection.org/image/b18035723_0001.JP2/full/90,/0/default.jpg"
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
    // gallery view is not default view
    const galleryViewBeforeToggle = await page.evaluate(() => {
      const galleryViewOverlay = document.querySelector(
        ".iiif-gallery-component .header"
      );
      return getComputedStyle(galleryViewOverlay).overflowX;
    });
    expect(galleryViewBeforeToggle).toBe("hidden");

    // gallery toggle icon is visible
    await page.waitForSelector(".uv-icon-gallery");
    const galleryViewToggle = await page.evaluate(() => {
      const toggle = document.querySelector(".uv-icon-gallery");
      return getComputedStyle(toggle).overflowX;
    });
    expect(galleryViewToggle).toBe("visible");

    // gallery view can be toggled on
    await page.evaluate(() => {
      document.querySelector(".uv-icon-gallery").click();
    });
    const galleryViewAfterToggle = await page.evaluate(() => {
      const galleryViewOverlay = document.querySelector(
        ".iiif-gallery-component"
      );
      return getComputedStyle(galleryViewOverlay).overflowX;
    });
    expect(galleryViewAfterToggle).toBe("visible");

    // gallery view can be toggled off
    await page.evaluate(() => {
      document.querySelector(".uv-icon-two-up").click();
    });
    const galleryViewAfterTwoUpToggle = await page.evaluate(() => {
      const galleryViewOverlay = document.querySelector(
        ".iiif-gallery-component .header"
      );
      return getComputedStyle(galleryViewOverlay).overflowX;
    });
    expect(galleryViewAfterTwoUpToggle).toBe("hidden");
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

  describe("viewer controls", () => {
    afterEach(async () => {
      await page.goto("http://localhost:4444");
    });

    // navigate to next image
    it("can navigate to next image", async () => {
      await page.waitForSelector(".btn.imageBtn.next", { visible: true });

      const urlBefore = page.url();
      const before = getCanvasValue(urlBefore);

      await page.click(".btn.imageBtn.next");
      await page.waitForFunction(
        (prev) => window.location.href !== prev,
        {},
        urlBefore
      );
      const urlAfter = page.url();
      const after = getCanvasValue(urlAfter);
      expect(urlAfter).not.toBe(urlBefore);
      if (before !== null && after !== null) {
        expect(after).toBe(before + 1);
      }
    });

    // navigate to previous image
    it("can navigate to previous image", async () => {
      await page.waitForSelector(".btn.imageBtn.next", { visible: true });
      await page.waitForSelector(".btn.imageBtn.prev", { visible: true });

      const startUrl = page.url();
      const startValue = getCanvasValue(startUrl);

      await page.click(".btn.imageBtn.next");
      await page.waitForFunction(
        (prev) => window.location.href !== prev,
        {},
        startUrl
      );

      const nextUrl = page.url();
      const nextValue = getCanvasValue(nextUrl);

      await page.click(".btn.imageBtn.prev");
      await page.waitForFunction(
        (prev) => window.location.href !== prev,
        {},
        nextUrl
      );

      const previousUrl = page.url();
      const previousValue = getCanvasValue(previousUrl);

      expect(previousUrl).not.toBe(nextUrl);

      if (
        startValue !== null &&
        nextValue !== null &&
        previousValue !== null
      ) {
        expect(nextValue).toBe(startValue + 1);
        expect(previousValue).toBe(startValue);
      }
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

      await page.click(".zoomIn.viewportNavButton");
      await page.waitForFunction(
        (prev) => window.location.href !== prev,
        {},
        initialUrl
      );

      const zoomInUrl = page.url();
      const zoomInXywh = getXywhValue(zoomInUrl);

      expect(zoomInXywh).not.toBeNull();
      expect(zoomInXywh).not.toBe(initialXywh);
      expect(zoomInXywh).toMatch(/^-?\d+,-?\d+,\d+,\d+$/);

      await page.click(".zoomOut.viewportNavButton");
      await page.waitForFunction(
        (prev) => window.location.href !== prev,
        {},
        zoomInUrl
      );

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

      const initialUrl = page.url();
      const initialRot = getRotValue(initialUrl);

      await page.click(".rotate.viewportNavButton");

      await page.waitForFunction(
        (prev) => window.location.href !== prev,
        {},
        initialUrl
      );

      const rotatedRot = getRotValue(page.url());

      if (initialRot !== null && rotatedRot !== null) {
        expect(normalizeRot(rotatedRot)).toBe(normalizeRot(initialRot) + 90);
      }
    });

    // open and close adjust image control
    it("can open and close adjust image control", async () => {
      const btn = "button.viewportNavButton.adjustImage";
      const overlay = "div.overlay.adjustImage";
      const heading = "div.overlay.adjustImage .content .heading";
      const closeBtn = ".btn.btn-default.close";

      await page.waitForSelector(btn, { visible: true });
      await page.click(btn);

      await page.waitForSelector(overlay, { visible: true });

      const text = await page.$eval(heading, (el) => el.textContent.trim());
      expect(text).toBe("Adjust image");

      await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        if (el) el.click();
      }, closeBtn);

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
});
