const { BASE_URL } = require("../scripts/testBaseUrl");

const FIRST_THUMB_SRC =
  "https://iiif.wellcomecollection.org/image/b18035723_0001.JP2/full/90,/0/default.jpg";

// Applies custom config through the examples page's Configuration tab:
// the #customConfig JSON is merged into the viewer config by a
// uv.on("configure") handler when the Apply Configurations button
// re-initialises the viewer.
const applyCustomConfig = async (config) => {
  await page.evaluate((cfg) => {
    document.getElementById("customConfig").value = cfg;
    document.getElementById("clearStorageCheckbox").checked = true;
    document.getElementById("setConfigButton").click();
  }, JSON.stringify(config));
};

describe("Configuration options", () => {
  describe("thumb cache invalidation", () => {
    beforeEach(async () => {
      await page.goto(BASE_URL);
      await page.waitForSelector("#thumb-0 img");
    });

    it("when set to false does not provide timestamp", async () => {
      await applyCustomConfig({
        modules: {
          contentLeftPanel: {
            options: { thumbsCacheInvalidation: { enabled: false } },
          },
        },
      });

      // wait for the viewer to re-render thumbs without the timestamp
      await page.waitForFunction(
        (src) => {
          const img = document.querySelector("#thumb-0 img");
          return img && img.src === src;
        },
        {},
        FIRST_THUMB_SRC
      );

      const imageSrc = await page.$eval("#thumb-0 img", (e) => e.src);
      expect(imageSrc).toEqual(FIRST_THUMB_SRC);
    });

    it("has a configurable parameter type", async () => {
      await applyCustomConfig({
        modules: {
          contentLeftPanel: {
            options: { thumbsCacheInvalidation: { paramType: "#" } },
          },
        },
      });

      // wait for the viewer to re-render thumbs with a #t= timestamp
      await page.waitForFunction(
        (src) => {
          const img = document.querySelector("#thumb-0 img");
          return img && img.src.startsWith(`${src}#t=`);
        },
        {},
        FIRST_THUMB_SRC
      );

      const imageSrc = await page.$eval("#thumb-0 img", (e) => e.src);
      expect(imageSrc).toEqual(
        expect.stringContaining(`${FIRST_THUMB_SRC}#t=`)
      );
    });
  });
});
