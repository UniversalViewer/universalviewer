const { BASE_URL } = require("./testBaseUrl");

// The examples page URL that opens manifestUrl, optionally with locales.
const viewerUrl = (manifestUrl, locales) => {
  const url = `${BASE_URL}#?manifest=${encodeURIComponent(manifestUrl)}`;
  return locales ? `${url}&locales=${locales}` : url;
};

module.exports = { viewerUrl };
