let puppeteer;
const { BASE_URL } = require("../scripts/tests/testBaseUrl");
const { viewerUrl } = require("../scripts/tests/testViewer");

// Local single-model manifest for the model-viewer extension. Modelled on
// IIIF Cookbook 0608 Simplest Manifest - Single 3D Model, adapted from a
// Presentation 4 Scene to a Presentation 3 Canvas.
// https://iiif.io/api/cookbook/recipe/0608-mvm-3d/
const MODEL_MANIFEST = `${BASE_URL}/test-fixtures/model-manifest.json`;

describe("Universal Viewer", () => {
  let browser;
  let page;
  let errors;

  beforeAll(async () => {
    puppeteer = (await import("puppeteer")).default;
    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("3D model", () => {
    // The examples page shows the extension's latest target, which ends in
    // #orbit=theta,phi,radius once the model is visible and after each
    // camera change.
    const target = () => page.$eval("#iiif_target", (el) => el.value);
    const orbit = async () =>
      (await target())
        .match(/#orbit=([^,]+),([^,]+),([^,]+)$/)
        .slice(1)
        .map(Number);

    beforeEach(async () => {
      page = await browser.newPage();
      errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      // An unanswered alert (e.g. "Unable to load manifest") blocks the page,
      // so record and dismiss it.
      page.on("dialog", async (dialog) => {
        errors.push(dialog.message());
        await dialog.dismiss();
      });
      await page.goto(viewerUrl(MODEL_MANIFEST), {
        waitUntil: "domcontentloaded",
      });
      await page.waitForFunction(() =>
        document.querySelector("#iiif_target").value.includes("#orbit=")
      );
    });

    afterEach(async () => {
      await page.close();
    });

    it("loads and renders the model", async () => {
      const model = await page.$eval("model-viewer", (viewer) => {
        const canvas = viewer.shadowRoot.querySelector("canvas");
        return {
          src: viewer.src,
          loaded: viewer.loaded,
          width: canvas.width,
          height: canvas.height,
        };
      });

      expect(model.src).toBe(
        `${BASE_URL}/test-fixtures/model-fixture-1-box.glb`
      );
      expect(model.loaded).toBe(true);
      expect(model.width).toBeGreaterThan(0);
      expect(model.height).toBeGreaterThan(0);
      expect(errors).toEqual([]);
    });

    it("publishes the new orbit when the model is dragged", async () => {
      const previous = await target();
      const [theta, phi, radius] = await orbit();

      const box = await (await page.$("model-viewer")).boundingBox();
      const y = box.y + box.height / 2;
      await page.mouse.move(box.x + box.width / 2, y);
      await page.mouse.down();
      await page.mouse.move(box.x + (box.width * 3) / 8, y, { steps: 10 });
      await page.mouse.up();

      await page.waitForFunction(
        (value) => document.querySelector("#iiif_target").value !== value,
        {},
        previous
      );
      const [newTheta, newPhi, newRadius] = await orbit();

      // Dragging left by an eighth of the viewer's width turns the camera
      // about 1.53 rad (88°) around the model; require at least half that.
      // A horizontal drag leaves the camera's height (phi) and distance alone.
      expect(newTheta - theta).toBeGreaterThan(0.75);
      expect(newPhi).toBeCloseTo(phi, 3);
      expect(newRadius).toBeCloseTo(radius, 3);
      expect(errors).toEqual([]);
    });
  });
});
