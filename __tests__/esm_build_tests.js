import path from "node:path";
import { buildSync } from "esbuild";

const repoRoot = path.resolve(import.meta.dirname, "..");

// Bundles the esbuild example's entry against dist/esm (the package's
// "module" entry), the way an implementation's esbuild build does. Run
// `npm run build-es` first so dist/esm is current.
describe("ESM build", () => {
  it("bundles the esbuild example without errors or warnings", () => {
    // Throws, listing each error, if the bundle fails.
    const { warnings } = buildSync({
      absWorkingDir: path.join(repoRoot, "npm-examples", "esbuild"),
      entryPoints: ["src/index.ts"],
      outdir: "dist",
      bundle: true,
      write: false,
      logLevel: "silent",
      alias: { universalviewer: repoRoot },
    });

    expect(warnings).toEqual([]);
  });
});
