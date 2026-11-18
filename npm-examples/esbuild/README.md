# Universal Viewer with esbuild

This example shows how to bundle the Universal Viewer (UV) into your own page with [esbuild](https://esbuild.github.io/). It uses UV's ES module build, the `module` entry in UV's `package.json`.

[`src/index.ts`](src/index.ts) does three things:

```ts
import { init } from "universalviewer";
import "universalviewer/dist/esm/index.css";

init(container, { manifest: "https://…/manifest" });
```

esbuild bundles it into `dist/bundle.js` and `dist/bundle.css`, and the example serves the result at http://localhost:3001.

## Before you start

You need Node 22.15 or higher.

The example installs UV from this repository (`"universalviewer": "../../"` in [`package.json`](package.json)) rather than from npm. So build UV's ES module output first. From the repository root:

```
npm install
npm run build-es
```

`npm run build-es` writes `dist/esm`. Run it again whenever you change UV's source, so the example picks up your changes.

## Run the example

```
cd npm-examples/esbuild
npm install
npm start
```

Then open http://localhost:3001.

- `npm start` rebuilds when `src/` changes and reloads the page.
- `npm run build` builds once. It also starts the server, so it keeps running until you stop it with Ctrl+C.

## Files

- [`src/index.ts`](src/index.ts): creates the viewer. Change the `manifest` URL here to open a different IIIF manifest.
- [`src/main.css`](src/main.css): page styles. UV fills its container, so the container needs a height; here it fills the window.
- [`esbuild.mjs`](esbuild.mjs): writes `dist/index.html`, sets the esbuild options, and starts the server on port 3001.

## Using this in your own project

Install UV from npm instead of from this repository:

```
npm install universalviewer
```

The same two imports, `universalviewer` and `universalviewer/dist/esm/index.css`, then work in your own esbuild setup.
