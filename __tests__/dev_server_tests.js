let puppeteer;
const http = require("http");
const { spawn } = require("child_process");

// `npm start` serves the examples page through webpack-dev-server, which the
// other specs don't use (they load the built dist/). Port 8181 keeps clear of
// a developer's own `npm start` on 8080.
const PORT = 8181;
const DEV_URL = `http://localhost:${PORT}`;

// The paged-book fixture from the dev server's static root (the repo), so
// the page fetches its manifest from its own origin.
const MANIFEST = `${DEV_URL}/src/test-fixtures/image-paged-book-manifest.json`;

const get = (path) =>
  new Promise((resolve, reject) => {
    http
      .get(`${DEV_URL}${path}`, (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => (body += chunk));
        response.on("end", () =>
          resolve({ status: response.statusCode, body })
        );
      })
      .on("error", reject);
  });

describe("Dev server", () => {
  let server;
  let output = "";
  let browser;

  beforeAll(async () => {
    puppeteer = (await import("puppeteer")).default;
    browser = await puppeteer.launch();
    // detached gives npm, npx and webpack their own process group, so
    // afterAll can stop all of them.
    server = spawn(
      "npm",
      ["start", "--", "--no-open", "--port", String(PORT)],
      { detached: true }
    );
    // Resolves once webpack reports the first compile (with or without
    // errors), or fails if the server exits first.
    await new Promise((resolve, reject) => {
      const onOutput = (data) => {
        output += data;
        if (/webpack [\d.]+ compiled/.test(output)) resolve();
      };
      server.stdout.on("data", onOutput);
      server.stderr.on("data", onOutput);
      server.on("exit", (code) =>
        reject(new Error(`npm start exited with ${code}:\n${output}`))
      );
    });
  }, 300000);

  afterAll(async () => {
    await browser.close();
    const exited = new Promise((resolve) => server.on("close", resolve));
    process.kill(-server.pid);
    await exited;
  });

  it("compiles without errors", () => {
    expect(output).not.toMatch(/ERROR/);
  });

  it("serves the examples page", async () => {
    const page = await get("/");
    expect(page.status).toBe(200);
    expect(page.body.match(/<title>(.*)<\/title>/)[1]).toBe(
      "Universal Viewer Examples"
    );
    expect(page.body.includes('<script defer src="UV.js">')).toBe(true);
  });

  it("serves the files mounted in onListening", async () => {
    for (const path of [
      "/uv.css",
      "/uv-iiif-config.json",
      "/iiif-collection.json",
      "/mejs-controls.svg",
    ]) {
      expect([path, (await get(path)).status]).toEqual([path, 200]);
    }
  });

  it("renders a manifest in the browser", async () => {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    // The dev server's live-reload client logs "connected" once its socket
    // is open. Failed requests are recorded by URL below, so skip the
    // console's URL-less copy of them.
    let clientConnected;
    const connected = new Promise((resolve) => (clientConnected = resolve));
    page.on("console", (message) => {
      const text = message.text();
      if (text === "[webpack-dev-server] connected") clientConnected();
      if (
        message.type() === "error" &&
        !text.startsWith("Failed to load resource")
      ) {
        errors.push(text);
      }
    });
    // The dev server doesn't serve src/favicon.ico at the root.
    page.on("response", (response) => {
      if (
        response.status() >= 400 &&
        !response.url().endsWith("/favicon.ico")
      ) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });
    // An unanswered alert (e.g. "Unable to load manifest") blocks the page,
    // so record and dismiss it.
    page.on("dialog", async (dialog) => {
      errors.push(dialog.message());
      await dialog.dismiss();
    });
    // Successful rendering
    await page.goto(`${DEV_URL}#?manifest=${encodeURIComponent(MANIFEST)}`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector("#thumb-0 img");
    await connected;

    expect(errors).toEqual([]);
  });
});
