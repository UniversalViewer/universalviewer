// Copies the stylesheets and images under src/ into dist/cjs, keeping their
// paths, for the CommonJS build (build-tsc).
const fs = require("fs");
const path = require("path");

const ASSET = /\.(svg|gif|png|less|css)$/;

const copyFiles = (srcDir, outDir) => {
  const outFromSrc = path.relative(srcDir, outDir);
  if (outFromSrc !== ".." && !outFromSrc.startsWith(`..${path.sep}`)) {
    throw new Error(`${outDir} is inside the source folder ${srcDir}`);
  }

  // Walks real folders and copies regular files only. readdirSync's own
  // recursive option follows symlinked folders, and a symlink could point
  // outside src or loop back into it.
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(file);
      } else if (entry.isFile() && ASSET.test(entry.name)) {
        fs.cpSync(file, path.join(outDir, path.relative(srcDir, file)));
      }
    }
  };
  walk(srcDir);
};

if (require.main === module) {
  copyFiles("src", "dist/cjs");
}

module.exports = { copyFiles };
