import path from "path";
import { build } from "esbuild";
import { lessLoader } from "esbuild-plugin-less";
import svg from "esbuild-plugin-svg";
import fs from "fs";
import LessPluginCleanCSS from "less-plugin-clean-css";

const pkg = JSON.parse(fs.readFileSync("./package.json").toString());

// These are NPM packages that don't work with external bundlers without configuration.
// To avoid confusion, this will ensure they are included in the ESM bundle.
const bundledPackages = [
  "jquery",
  "jsviews",
  "xss",
  "@iiif/vocabulary"
];

// This plugin will ensure that mediaelement css is loaded correctly. It's currently using a webpack specific
// format.
let resolveMediaElement = {
  name: "resolve-media-element",
  setup(build) {
    // Hack for resolution of webpack specific.
    build.onResolve({ filter: /~mediaelement/ }, (args) => {
      const t = args.path.split("~mediaelement")[1];
      return {
        path: path.join(process.cwd(), "./node_modules/mediaelement", t),
      };
    });
  },
};

async function main() {
  await build({
    // Enables code splitting, similar to webpack.
    splitting: true,
    outdir: path.resolve(process.cwd(), "dist/esm"),
    entryPoints: [path.resolve(process.cwd(), "src/index.ts")],
    bundle: true,
    target: "es2020",
    format: "esm",
    globalName: "UV",
    minify: true,
    external: [
      ...Object.keys(pkg.dependencies).filter(
        (t) => t.indexOf(bundledPackages) !== -1
      ),
    ],
    plugins: [
      resolveMediaElement,
      lessLoader({
        paths: [
          "node_modules/",
          "./src/content-handlers/iiif/modules/uv-shared-module/img",
          "./src/content-handlers/iiif/modules/uv-pagingheaderpanel-module/img",
          "./src/content-handlers/iiif/modules/uv-openseadragoncenterpanel-module/img",
          "./src/content-handlers/iiif/modules/uv-searchfooterpanel-module/img",
        ],
        math: "always",
        javascriptEnabled: true,
        plugins: [
          new LessPluginCleanCSS({
            advanced: true,
            level: 2,
          }),
        ],
      }),
      svg(),
    ],
    loader: {
      ".ts": "ts",
      ".png": "dataurl",
      ".gif": "dataurl",
    },
  });
}

main();
