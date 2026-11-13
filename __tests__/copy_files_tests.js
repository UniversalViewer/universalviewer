const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const { copyFiles } = require("../scripts/copy_files");

// build-tsc copies the stylesheets and images that the compiled dist/cjs
// modules import, keeping their paths under src/.
const ASSET = /\.(svg|gif|png|less|css)$/;

describe("copy-files", () => {
  let out;

  beforeAll(() => {
    out = fs.mkdtempSync(path.join(os.tmpdir(), "uv-copy-files-"));
    copyFiles("src", out);
  });

  afterAll(() => {
    fs.rmSync(out, { recursive: true, force: true });
  });

  it("copies every stylesheet and image in src unchanged", () => {
    const tracked = execFileSync("git", ["ls-files", "src"], {
      encoding: "utf8",
    })
      .split("\n")
      .filter((file) => ASSET.test(file));
    expect(tracked.length).toBeGreaterThan(0);

    for (const file of tracked) {
      const copy = path.join(out, path.relative("src", file));
      const same =
        fs.existsSync(copy) &&
        fs.readFileSync(copy).equals(fs.readFileSync(file));
      expect([file, same]).toEqual([file, true]);
    }
  });

  it("copies nothing else", () => {
    const copied = fs
      .readdirSync(out, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name);
    expect(copied.filter((name) => !ASSET.test(name))).toEqual([]);
  });
});

describe("copy-files guards", () => {
  let tmp;
  let src;
  let out;

  // Everything the copy wrote, files and folders, relative to out.
  const copied = () => fs.readdirSync(out, { recursive: true }).sort();
  const expected = ["theme", path.join("theme", "a.css")];

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "uv-copy-guards-"));
    src = path.join(tmp, "src");
    out = path.join(tmp, "out");
    fs.mkdirSync(path.join(src, "theme"), { recursive: true });
    fs.writeFileSync(path.join(src, "theme", "a.css"), "a {}");
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it("skips a folder whose name looks like an asset", () => {
    fs.mkdirSync(path.join(src, "folder.css"));
    fs.writeFileSync(path.join(src, "folder.css", "notes.txt"), "");
    copyFiles(src, out);
    expect(copied()).toEqual(expected);
  });

  it("skips a symlink, which could point outside src", () => {
    fs.writeFileSync(path.join(tmp, "outside.png"), "");
    fs.symlinkSync(path.join(tmp, "outside.png"), path.join(src, "link.png"));
    copyFiles(src, out);
    expect(copied()).toEqual(expected);
  });

  it("finishes when a symlink loops back to src", () => {
    fs.symlinkSync(src, path.join(src, "theme", "loop"));
    copyFiles(src, out);
    expect(copied()).toEqual(expected);
  });

  it("refuses to copy into a folder inside src", () => {
    expect(() => copyFiles(src, path.join(src, "out"))).toThrow(
      "inside the source"
    );
  });
});
