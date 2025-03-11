const fs = require('fs');
const path = require('path');

// Read in parameters to choose which type of validation to run
let args = process.argv.slice(2);
let runType = args[0];
if (!['checkLocaleUsage', 'compareLocales'].includes(runType)) {
    console.log('No parameter or no valid run type. Please use checkLocaleUsage or compareLocales');
}

// Define all locales and primary locale
const allLocales = ['cy-GB', 'en-GB', 'fr-FR', 'pl-PL', 'sv-SE'];
const primaryLocale = 'en-GB';

// List of all UV modules
const uvModules = [
  'uv-av-extension',
  'uv-ebook-extension',
  'uv-model-viewer-extension',
  'uv-pdf-extension',
  'uv-aleph-extension',
  'uv-default-extension',
  'uv-mediaelement-extension',
  'uv-openseadragon-extension'
];

const checkLocaleUsage = () => {
    // Read primary locale file.
    let localeData = readLocaleFile(primaryLocale);
    // replace all values with a 0
    // we will increment the value for each key found in the module config files
    let localeKeys = Object.keys(localeData).reduce((acc, key) => {
        acc[key] = 0;
        return acc;
    }, {});

    // Loop through all UV modules.
    uvModules.forEach(module => {
        let config = readModuleConfig(module);
        // Recursively extract all locale values from any "content" objects.
        let contentLocaleValues = extractContentLocaleValues(config);
        // For each locale value found, if it exists in the primary locale keys, increment its count.
        contentLocaleValues.forEach(val => {
            if (val in localeKeys) {
                localeKeys[val]++;
            }
        });
    });

    console.log("Final locale keys count:", localeKeys);
    console.log("Unused locale keys:", getUnusedLocaleKeys(localeKeys));
};

const getUnusedLocaleKeys = (localeKeys) => {
    return Object.entries(localeKeys).filter(([key, value]) => value === 0);
}

// Recursively extract all values in any "content" object that are strings starting with "$"
const extractContentLocaleValues = (obj) => {
    let values = [];
    for (const [prop, value] of Object.entries(obj)) {
        if (prop === 'content' && typeof value === 'object' && value !== null) {
            Object.values(value).forEach(item => {
                if (typeof item === 'string' && item.startsWith('$')) {
                    values.push(item); // keep the value as is (with "$")
                }
            });
        } else if (typeof value === 'object' && value !== null) {
            values = values.concat(extractContentLocaleValues(value));
        }
    }
    return values;
};

const readLocaleFile = (lang) => {
    const localeDir = path.join(__dirname, '../src/locales');
    const localeFiles = fs.readdirSync(localeDir).filter(file => file.endsWith(`${lang}.json`));
    if (localeFiles.length === 0) {
        throw new Error(`No locale file found for language ${lang}`);
    }
    const filePath = path.join(localeDir, localeFiles[0]);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
};

const readModuleConfig = (module) => {
    const configPath = path.join(__dirname, `../src/content-handlers/iiif/extensions/${module}/config/config.json`);
    const configContent = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configContent);
};

const compareLocales = () => {
    const primaryLocaleData = readLocaleFile(primaryLocale);

    for (let locale of allLocales) {
        if (locale === primaryLocale) {
            continue;
        }
        const localeData = readLocaleFile(locale);
        // Compare primary locale keys with each other locale's keys.
        // If a key is missing in the other locale, log an error.
        for (let key of Object.keys(primaryLocaleData)) {
            if (!(key in localeData)) {
                console.error(`Key "${key}" missing in locale "${locale}"`);
            }
        }
    }
};

if (runType === 'checkLocaleUsage') {
    checkLocaleUsage();
}
if (runType === 'compareLocales') {
    compareLocales();
}