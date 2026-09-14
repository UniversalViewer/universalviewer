// scripts/generate-version.mjs

import fs from "node:fs";
import pkg from "../package.json" with { type: "json" };

const contents = `// This file is generated. Do not edit.
export const version = ${JSON.stringify(pkg.version)};
`;

fs.writeFileSync("src/version.ts", contents);
console.log(`Generated src/version.ts: ${pkg.version}`);
