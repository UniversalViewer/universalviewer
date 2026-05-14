const fs = require("fs");
const path = require("path");

const localConfigPath = path.resolve(__dirname, "testBaseUrl.local.json");

// default fallback
let BASE_URL = "http://localhost:4444";

// environment variable
if (process.env.BASE_URL) {
  BASE_URL = process.env.BASE_URL
}

// local config file
if (fs.existsSync(localConfigPath)) {
  try {
    const localConfig = JSON.parse(
      fs.readFileSync(localConfigPath, "utf8")
    );

    if (localConfig && localConfig.BASE_URL) {
      BASE_URL = localConfig.BASE_URL;
    } 
  } catch (err) {
    console.warn(
      "Invalid testBaseUrl.local.json, using default BASE_URL"
    );
  }
}
module.exports = { BASE_URL };