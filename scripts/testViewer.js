const { BASE_URL } = require("./testBaseUrl");

// The example page's URL for viewing a manifest, optionally in UV locales
// (e.g. "cy-GB").
const viewerUrl = (manifestUrl, locales) => {
  const url = `${BASE_URL}#?manifest=${encodeURIComponent(manifestUrl)}`;
  return locales ? `${url}&locales=${locales}` : url;
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

module.exports = {
  viewerUrl,
  expectPanelTitle,
  closeAttribution,
  waitUntilStill,
  applyConfig,
};
