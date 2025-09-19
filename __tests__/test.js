test.skip("Configuration options", () => {});

const puppeteer = require("puppeteer");

describe("Universal Viewer", () => {
  let browser;
  let page;

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
});
