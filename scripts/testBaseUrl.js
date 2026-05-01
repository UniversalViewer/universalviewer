const fs = require("fs");
const path = require("path");

const localConfigPath = path.resolve(__dirname, "testBaseUrl.local.json");

let BASE_URL = "http://localhost:4444";

if (fs.existsSync(localConfigPath)) {
  try {
    const localConfig = JSON.parse(
      fs.readFileSync(localConfigPath, "utf8")
    );

    if (localConfig.BASE_URL) {
      BASE_URL = localConfig.BASE_URL;
    } 
  } catch (err) {
    console.warn(
      "Invalid testBaseUrl.local.json, using default BASE_URL"
    );
  }
}
module.exports = { BASE_URL };