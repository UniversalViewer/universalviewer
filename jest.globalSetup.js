const http = require("http");
const { spawn } = require("child_process");

function waitForServer(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      const request = http.get(url, (response) => {
        response.resume();
        resolve();
      });

      request.on("error", () => {
        if (Date.now() - start >= timeout) {
          reject(new Error(`Server did not start within ${timeout}ms`));
          return;
        }

        setTimeout(check, 500);
      });
    };
    check();
  });
}

module.exports = async () => {
  const server = spawn("npm", ["run", "e2eserve"], {
    shell: true,
    stdio: "inherit",
  });

  globalThis.__UV_E2E_SERVER__ = server;

  await waitForServer("http://localhost:4444");
};
