const fs = require("fs");
const path = require("path");

// Read in parameters to choose which type of validation to run
const args = process.argv.slice(2);
const runType = args[0];

// Define primary locale
const primaryLocale = "en-GB.json";

const checkLocaleUsage = () => {
  // get a list of all UV extensions
  const uvExtensions = getUVExtensions();

  // Read primary locale file.
  const localeData = readLocaleFile(primaryLocale);
  // replace all values with a 0
  // we will increment the value for each key found in the extension config files
  const localeKeys = Object.keys(localeData).reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  // Loop through all UV extensions.
  uvExtensions.forEach((extension) => {
    const config = readExtensionConfig(extension);
    // Recursively extract all locale values from any "content" objects.
    const contentLocaleValues = extractContentLocaleValues(config);
    // For each locale value found, if it exists in the primary locale keys, increment its count.
    contentLocaleValues.forEach((val) => {
      if (val in localeKeys) {
        localeKeys[val]++;
      }
    });
  });

  console.log("Final locale keys count:", localeKeys);
  console.log("Unused locale keys:", getUnusedLocaleKeys(localeKeys));
};

const checkHardCodedStrings = () => {
  const missing = [];
  // get a list of all UV extensions
  const uvExtensions = getUVExtensions();

  // Loop through all UV extensions.
  uvExtensions.forEach((extension) => {
    const config = readExtensionConfig(extension);
    // Recursively extract all locale values from any "content" objects.
    const contentLocaleValues = extractContentLocaleValues(config);
    // For each locale value found, if it exists in the primary locale keys, increment its count.
    contentLocaleValues.forEach((val) => {
      // if val does not start with $
      const hasStartingDelimiter = keyStartsWithDollar(val);
      if (!hasStartingDelimiter) {
        missing.push({ extension: extension, key: val });
      }
    });
  });

  console.log("missing locale keys:", missing);
};

const keyStartsWithDollar = (val) => {
  if (val.substring(0, 1) !== "$") {
    return false;
  }

  return true;
};

const getUVExtensions = () => {
  const extensions = [];
  // get a list of all UV extensions
  const directoryPath = path.join(
    __dirname,
    "../src/content-handlers/iiif/extensions/"
  );

  try {
    const files = fs.readdirSync(directoryPath);

    files.forEach(function (file) {
      const dir = file.substring(0, 2);
      // only get directories that start with 'uv'
      if (dir === "uv") {
        extensions.push(file);
      }
    });
  } catch (err) {
    console.log("Unable to scan directory: " + err);
  }

  return extensions;
};

const getUVLocales = () => {
  const localeDir = path.join(__dirname, "../src/locales");
  const localeFiles = fs.readdirSync(localeDir);
  return localeFiles;
};

const getUnusedLocaleKeys = (localeKeys) => {
  return Object.entries(localeKeys).filter(([key, value]) => value === 0);
};

// Recursively extract all values in any "content" object that are strings starting with "$"
const extractContentLocaleValues = (obj) => {
  let values = [];
  for (const [prop, value] of Object.entries(obj)) {
    if (prop === "content" && typeof value === "object" && value !== null) {
      Object.values(value).forEach((item) => {
        if (typeof item === "string") {
          values.push(item);
        }
      });
    } else if (typeof value === "object" && value !== null) {
      values = values.concat(extractContentLocaleValues(value));
    }
  }
  return values;
};

const readLocaleFile = (lang) => {
  const localeDir = path.join(__dirname, "../src/locales");
  const localeFiles = fs
    .readdirSync(localeDir)
    .filter((file) => file.endsWith(`${lang}`));
  if (localeFiles.length === 0) {
    throw new Error(`No locale file found for language ${lang}`);
  }
  const filePath = path.join(localeDir, localeFiles[0]);
  const fileContent = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContent);
};

const readExtensionConfig = (extension) => {
  const configPath = path.join(
    __dirname,
    `../src/content-handlers/iiif/extensions/${extension}/config/config.json`
  );
  const configContent = fs.readFileSync(configPath, "utf8");
  return JSON.parse(configContent);
};

const missingTranslations = () => {
  const primaryLocaleData = readLocaleFile(primaryLocale);
  const allLocales = getUVLocales();

  for (const locale of allLocales) {
    if (locale === primaryLocale) {
      continue;
    }
    const localeData = readLocaleFile(locale);
    // Compare primary locale keys with each other locale's keys.
    // If a key is missing in the other locale, log an error.
    for (const key of Object.keys(primaryLocaleData)) {
      if (!(key in localeData)) {
        console.error(`Key "${key}" missing in locale "${locale}"`);
      }
    }
  }
};

switch (runType) {
  case "checkLocaleUsage":
    checkLocaleUsage();
    break;
  case "missingTranslations":
    missingTranslations();
    break;
  case "hardCodedStrings":
    checkHardCodedStrings();
    break;
  default:
    console.error(
      "No parameter or no valid run type. Please use checkLocaleUsage, missingTranslations or hardCodedStrings"
    );
    break;
}
