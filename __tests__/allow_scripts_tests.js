const lock = require("../package-lock.json");
const { allowScripts = {} } = require("../package.json");

// npm 11 lists dependencies whose install scripts aren't covered by
// package.json's allowScripts, and a later npm will block them. CI runs an
// older npm that ignores the field, so this reads the lockfile instead.
describe("allowScripts", () => {
  it("approves or denies every dependency with an install script", () => {
    const pending = Object.entries(lock.packages)
      .filter(([, entry]) => entry.hasInstallScript)
      .map(([key, entry]) => {
        const name = entry.name ?? key.split("node_modules/").pop();
        return { name, version: entry.version };
      })
      .filter(
        ({ name, version }) =>
          allowScripts[name] === undefined &&
          allowScripts[`${name}@${version}`] === undefined
      )
      .map(({ name, version }) => `${name}@${version}`);
    expect(pending).toEqual([]);
  });
});
