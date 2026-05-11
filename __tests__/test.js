test.skip("Configuration options", () => {});

const puppeteer = require("puppeteer");
const { BASE_URL } = require("../scripts/testBaseUrl");

// Cookbook manifest for viewer control tests
const COOKBOOK_MANIFEST =
  "https://iiif.io/api/cookbook/recipe/0031-bound-multivolume/manifest.json";

// PDF manifest for PDF-specific behaviour
const PDF_MANIFEST =
  "https://digital.library.villanova.edu/Item/vudl:294631/Manifest";

const viewerUrl = (manifestUrl) => {
  const separator = BASE_URL.includes("?") ? "&" : "?";

  return `${BASE_URL}${separator}manifest=${encodeURIComponent(manifestUrl)}`;
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

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(BASE_URL);
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

  // COOKBOOK MANIFEST TEST
  describe("viewer controls", () => {
    beforeEach(async () => {
      await page.goto(viewerUrl(COOKBOOK_MANIFEST));
    });

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

      const initialRot = await getRotationFromNavigator();

      await page.click(".rotate.viewportNavButton");
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
      await page.click(btn);

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

    beforeEach(async () => {
      await page.goto(viewerUrl(COOKBOOK_MANIFEST));
    });

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

    beforeEach(async () => {
      await page.goto(viewerUrl(COOKBOOK_MANIFEST));
    });

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

  // PDF MANIFEST TEST
  describe("PDF manifest", () => {
    beforeEach(async () => {
      await page.goto(viewerUrl(PDF_MANIFEST), {
        waitUntil: "domcontentloaded",
      });
    });

    it("loads PDF manifest successfully", async () => {
      expect(page.url()).toContain(encodeURIComponent(PDF_MANIFEST));

      await page.waitForSelector(".uv", { visible: true });

      const pageText = await page.evaluate(() => document.body.innerText);

      expect(pageText).not.toContain("Unable to load");
      expect(pageText).not.toContain("Error loading");
    });
  });
});
