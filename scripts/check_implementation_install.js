// Installs the packed universalviewer tarball into an empty app, the way
// implementers do, and fails on any warning or runtime vulnerability that
// comes from UV's dependencies (issue #1938).
//
// Usage: npm run check-implementation-install
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

// Warnings and audit findings still expected on this branch. Each entry
// names the remaining fix; remove it once that fix lands.
const KNOWN_ISSUES = [
  {
    pattern: /xmldom|@universalviewer\/epubjs|@types\/(jszip|localforage)@/,
    fix: "replace xmldom and drop stub types in @universalviewer/epubjs",
  },
  {
    pattern:
      /^audit: (universalviewer|@universalviewer\/uv-ebook-components) .* via @universalviewer\/(uv-ebook-components|epubjs)$/,
    fix: "replace xmldom and drop stub types in @universalviewer/epubjs",
  },
  {
    pattern: /peer dependency "three@|doesn't provide three to/,
    fix: "provide three for @google/model-viewer",
  },
  {
    pattern: /deep-diff@/,
    fix: "drop redux-logger from @universalviewer/aleph",
  },
  {
    pattern: /waveform-panel@npm:\S+ doesn't provide react to zustand@/,
    fix: "declare the react peer in waveform-panel",
  },
  {
    pattern: /fsevents is a dependency of @iiif\/manifold@/,
    fix: "drop the fsevents optional dependency from @iiif/manifold",
  },
];

const repoRoot = path.resolve(__dirname, "..");

const run = (command, args, cwd, env = {}) => {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    encoding: "utf8",
    shell: process.platform === "win32",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.error) {
    throw result.error;
  }
  return result;
};

const runOrThrow = (command, args, cwd, env) => {
  const result = run(command, args, cwd, env);
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed:\n${result.stdout}${result.stderr}`
    );
  }
  return result;
};

const createImplementationApp = (workDir, name, tarball) => {
  const appDir = path.join(workDir, name);
  fs.mkdirSync(appDir);
  fs.writeFileSync(
    path.join(appDir, "package.json"),
    JSON.stringify(
      {
        name,
        version: "1.0.0",
        private: true,
        license: "MIT",
        dependencies: { universalviewer: `file:${tarball}` },
      },
      null,
      2
    )
  );
  return appDir;
};

const outputLines = (result) =>
  `${result.stdout}\n${result.stderr}`.split("\n").map((line) => line.trim());

// Yarn 1 reproduces the peer warnings implementers reported; it prefixes
// each one with the dependency chain, starting at universalviewer.
const yarn1Findings = (workDir, tarball) => {
  const appDir = createImplementationApp(
    workDir,
    "yarn1-implementation",
    tarball
  );
  const result = runOrThrow(
    "npx",
    [
      "--yes",
      "yarn@1.22.22",
      "install",
      "--non-interactive",
      "--ignore-scripts",
    ],
    appDir
  );
  return outputLines(result)
    .filter((line) => /^warning .*universalviewer/.test(line))
    .map((line) => `yarn 1: ${line}`);
};

const yarn4AuditFinding = ({ value, children }) => {
  const { Severity, Issue, Dependents } = children;
  const versions = children["Tree Versions"].join(", ");
  return `yarn 4 audit: ${value}@${versions} (${Severity}) ${Issue} via ${Dependents.join(", ")}`;
};

// Yarn 4 set up the way some implementations install UV: the
// node-modules linker, with scripts disabled as in their Docker build.
const yarn4Findings = (workDir, tarball) => {
  const appDir = createImplementationApp(
    workDir,
    "yarn4-implementation",
    tarball
  );
  fs.writeFileSync(
    path.join(appDir, ".yarnrc.yml"),
    "nodeLinker: node-modules\n"
  );
  fs.writeFileSync(path.join(appDir, "yarn.lock"), "");
  const yarn4 = (args, runner = runOrThrow) =>
    runner(
      "npx",
      ["--yes", "-p", "@yarnpkg/cli-dist@4.18.0", "yarn", ...args],
      appDir,
      {
        YARN_ENABLE_SCRIPTS: "false",
        YARN_ENABLE_IMMUTABLE_INSTALLS: "false",
        YARN_ENABLE_TELEMETRY: "false",
        // Yarn colours its output on GitHub Actions even without a terminal,
        // which stops KNOWN_ISSUES from matching.
        YARN_ENABLE_COLORS: "false",
      }
    );
  const install = yarn4(["install"]);
  // Install sums up peer problems in one line; this marks each unmet one ✘.
  const peers = yarn4(["explain", "peer-requirements"]);
  // fsevents (a macOS file watcher UV has no use for) makes yarn 4 add
  // node-gyp, whose advisories depend on the implementation's lockfile, so
  // fsevents itself is flagged.
  const fsevents = yarn4(["why", "fsevents"], run);
  // Covers node-gyp, which npm doesn't add. Prints one JSON object per line
  // and exits non-zero when it finds anything.
  const audit = yarn4(
    ["npm", "audit", "--json", "--recursive", "--environment", "production"],
    run
  );
  return [
    ...outputLines(install)
      .filter((line) => /YN0002|YN0060/.test(line))
      .map((line) => `yarn 4: ${line}`),
    ...outputLines(peers)
      .filter((line) => line.includes("✘"))
      .map((line) => `yarn 4: ${line}`),
    // Untrimmed, so only the top-level lines (the dependents) match.
    ...fsevents.stdout
      .split("\n")
      .filter((line) => /^[├└]─ /.test(line))
      .map(
        (line) => `yarn 4: fsevents is a dependency of ${line.slice(3).trim()}`
      ),
    ...audit.stdout
      .split("\n")
      .filter((line) => line.startsWith("{"))
      .map((line) => yarn4AuditFinding(JSON.parse(line))),
  ];
};

const esmBuildFinding =
  (kind) =>
  ({ text, location }) =>
    `esm build ${kind}: ${location ? `${location.file}: ` : ""}${text}`;

// Bundles the esbuild example's entry against the installed UV, the way an
// implementation builds from UV's ESM output (the "module" entry).
const esmBuildFindings = (appDir) => {
  fs.cpSync(
    path.join(repoRoot, "npm-examples", "esbuild", "src"),
    path.join(appDir, "src"),
    { recursive: true }
  );
  try {
    const { warnings } = require("esbuild").buildSync({
      absWorkingDir: appDir,
      entryPoints: ["src/index.ts"],
      outdir: "dist",
      bundle: true,
      write: false,
      logLevel: "silent",
    });
    return warnings.map(esmBuildFinding("warning"));
  } catch (error) {
    if (!error.errors) {
      throw error;
    }
    return [
      ...error.errors.map(esmBuildFinding("error")),
      ...error.warnings.map(esmBuildFinding("warning")),
    ];
  }
};

// npm 7+ installs peers itself, so it shows deprecations and peer conflicts.
// The app depends only on UV, so every warning comes from UV's tree. The
// audit runs here too, against the same install; it exits non-zero when it
// finds anything, so it uses run rather than runOrThrow.
const npmFindings = (workDir, tarball) => {
  const appDir = createImplementationApp(
    workDir,
    "npm-implementation",
    tarball
  );
  const install = runOrThrow(
    "npm",
    ["install", "--ignore-scripts", "--no-fund", "--no-audit"],
    appDir
  );
  const audit = run("npm", ["audit", "--omit=dev", "--json"], appDir);
  const vulnerabilities = JSON.parse(audit.stdout).vulnerabilities || {};
  return [
    ...outputLines(install)
      .filter((line) => /^npm warn (deprecated|ERESOLVE|peer)/i.test(line))
      .map((line) => `npm: ${line}`),
    ...Object.values(vulnerabilities).map(
      ({ name, severity, via }) =>
        `audit: ${name} (${severity}) via ${via
          .map((source) => (typeof source === "string" ? source : source.title))
          .join("; ")}`
    ),
    // Reuses this install to bundle UV's ESM output.
    ...esmBuildFindings(appDir),
  ];
};

const main = () => {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "uv-implementation-"));
  try {
    const pack = runOrThrow(
      "npm",
      ["pack", "--ignore-scripts", "--json", "--pack-destination", workDir],
      repoRoot
    );
    const tarball = path.join(workDir, JSON.parse(pack.stdout)[0].filename);

    const findings = [
      ...yarn1Findings(workDir, tarball),
      ...yarn4Findings(workDir, tarball),
      ...npmFindings(workDir, tarball),
    ];

    let known = 0;
    let unexpected = 0;
    findings.forEach((finding) => {
      const issue = KNOWN_ISSUES.find(({ pattern }) => pattern.test(finding));
      if (issue) {
        known++;
        console.log(`known (${issue.fix}): ${finding}`);
      } else {
        unexpected++;
        console.error(`UNEXPECTED: ${finding}`);
      }
    });
    console.log(
      `${findings.length} findings: ${known} known, ${unexpected} unexpected`
    );
    process.exitCode = unexpected > 0 ? 1 : 0;
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
};

main();
