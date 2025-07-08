import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.{test,tests,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    environment: "jsdom",
    globals: true,
  },
});
