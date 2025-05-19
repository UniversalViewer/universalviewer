// eslint.config.js
const { defineConfig } = require("eslint/config");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const reactPlugin = require("eslint-plugin-react");
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
    },
    rules: {
      semi: "error",
      "prefer-const": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  prettierConfig,
]);
