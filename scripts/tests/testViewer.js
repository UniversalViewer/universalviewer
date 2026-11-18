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

// Applies config through the examples page's Configuration tab, optionally
// clearing what the viewer remembers first, and waits for the viewer it
// starts again with it (its "created" event). The page keeps its viewer to
// itself, so UV.init is wrapped for the one restart, to listen on the new
// viewer. The page's window.UV property is swapped out and put back as it
// was (not assigned), so a spec's own setter for it (as in
// extension_choice_tests.js) doesn't wrap it again.
const applyConfig = (page, config, { clearStorage = false } = {}) =>
  page.evaluate(
    (config, clearStorage) =>
      new Promise((resolve) => {
        const property = Object.getOwnPropertyDescriptor(window, "UV");
        const UV = window.UV;
        Object.defineProperty(window, "UV", {
          configurable: true,
          writable: true,
          value: {
            ...UV,
            init: (...args) => {
              Object.defineProperty(window, "UV", property);
              const uv = UV.init(...args);
              uv.on("created", () => resolve(), false);
              return uv;
            },
          },
        });
        document.getElementById("customConfig").value = JSON.stringify(config);
        document.getElementById("clearStorageCheckbox").checked = clearStorage;
        document.getElementById("setConfigButton").click();
      }),
    config,
    clearStorage
  );

// Waits for annotations to be in the querySelector
const waitForAnnotationOn = (page, canvas) =>
  page.waitForFunction(
    (path) => document.querySelector("#iiif_annotations").value.includes(path),
    {},
    `/canvas/${canvas}#`
  );

// Wait for One-Up View to fully load.
const waitForOneUp = (page) =>
  page.waitForFunction(
    (sel) =>
      document.querySelector(sel)?.getAttribute("aria-pressed") === "true",
    {},
    oneUpButton
  );

// Closes the attribution box (the manifest's requiredStatement), as a user
// would, if it's shown: it can cover the player's controls (e.g.
// mediaelement's play button, when the left panel shows several canvases'
// thumbnails). Once closed, it stays closed for that manifest.
const closeAttribution = async (page) => {
  const close = await page
    .waitForSelector(".attribution .header .close", {
      visible: true,
      timeout: 5000,
    })
    .catch(() => null);
  if (!close) {
    return;
  }
  // Clicked in the page rather than where puppeteer last saw it: the panels
  // can still be moving (as the player is sized), and a click there misses.
  for (let tries = 0; tries < 3; tries++) {
    await page
      .$eval(".attribution .header .close", (button) => button.click())
      .catch(() => undefined);
    const hidden = await page
      .waitForSelector(".attribution", { hidden: true, timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    if (hidden) {
      return;
    }
  }
  throw new Error("The attribution box wouldn't close");
};

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

// Waits for an element (a selector, or an element's handle) to stop moving:
// the panels move as the player is sized for its media (e.g. the AV
// component's controls move down, and it lays its players out again as they
// load), and a click aimed at where the element was can miss it, especially
// when the machine is busy. Gives up after 10 seconds, leaving the test to
// find out what's wrong.
const waitUntilStill = async (page, element) => {
  const handle = () =>
    typeof element === "string" ? page.$(element) : element;
  const position = async () =>
    JSON.stringify(await (await handle()).boundingBox());
  let last = await position();
  for (let waited = 0; waited < 10000; waited += 250) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const now = await position();
    if (now === last) {
      return;
    }
    last = now;
  }
};

module.exports = {
  afterDoubleClickDebounce,
  annotationTargets,
  applyConfig,
  waitForAnnotationOn,
  waitForOneUp,
  closeAttribution,
  doubleClickViewer,
  expectPanelTitle,
  viewerUrl,
  waitUntilStill,
};
