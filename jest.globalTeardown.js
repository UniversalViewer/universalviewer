const { execFileSync } = require("child_process");

module.exports = async () => {
  const server = globalThis.__UV_E2E_SERVER__;

  if (!server || server.killed) {
    return;
  }

  if (process.platform === "win32") {
    try {
      execFileSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], {
        stdio: "ignore",
      });
    } catch {}
  } else {
    server.kill();
  }
};
