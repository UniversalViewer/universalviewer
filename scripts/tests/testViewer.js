const { BASE_URL } = require("./testBaseUrl");

const oneUpButton = ".btn.imageBtn.one-up";

// The viewer publishes a double-click 100ms later (the debounce in
// OpenSeadragonCenterPanel). Browsers run timers with an equal delay in
// the order they were set, so this resolves after any pending publish.
const afterDoubleClickDebounce = (page) =>
  page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 100)));

// Pulls #iiif_annotations element
const annotationTargets = (page) =>
  page.$eval("#iiif_annotations", (el) =>
    el.value ? JSON.parse(el.value).map(({ target }) => target) : []
  );

// Waits for annotations to be in the querySelector
const waitForAnnotationOn = (page, canvas) =>
  page.waitForFunction(
    (path) => document.querySelector("#iiif_annotations").value.includes(path),
    {},
    `/canvas/${canvas}#`
  );

// Waits for page to finish loadding and then double click action.
const doubleClickViewer = async (page) => {
  await page.waitForSelector(".openseadragon-canvas", { visible: true });
  const box = await (await page.$(".openseadragon-canvas")).boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  // Nothing may cover the viewer at the point of double-click.
  const onViewer = await page.evaluate(
    (px, py) =>
      !!document.elementFromPoint(px, py)?.closest(".openseadragon-canvas"),
    x,
    y
  );
  expect(onViewer).toBe(true);
  await page.mouse.click(x, y, { count: 2 });
};

// The center panel titles the player above the media. The mediaelement panel
// uses the manifest's label (MediaElementCenterPanel.createUI), while the AV
// panel uses the current range's label, falling back to the canvas'
// (AVCenterPanel._setTitle).
const expectPanelTitle = async (page, expected) => {
  await page.waitForSelector(".centerPanel h1.title", { visible: true });
  await page.waitForFunction(() => {
    const title = document.querySelector(".centerPanel h1.title");
    return title && title.textContent.trim().length > 0;
  });

  const title = await page.$eval(".centerPanel h1.title", (el) =>
    el.textContent.trim()
  );
  expect(title).toBe(expected);
};

// The examples page URL that opens manifestUrl, optionally with locales.
const viewerUrl = (manifestUrl, locales) => {
  const url = `${BASE_URL}#?manifest=${encodeURIComponent(manifestUrl)}`;
  return locales ? `${url}&locales=${locales}` : url;
};

// Wait for One-Up View to fully load.
const waitForOneUp = (page) =>
  page.waitForFunction(
    (sel) =>
      document.querySelector(sel)?.getAttribute("aria-pressed") === "true",
    {},
    oneUpButton
  );

module.exports = {
  afterDoubleClickDebounce,
  annotationTargets,
  waitForAnnotationOn,
  doubleClickViewer,
  expectPanelTitle,
  viewerUrl,
  waitForOneUp,
};
