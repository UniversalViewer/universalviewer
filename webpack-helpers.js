const path = require("path");

export function resolvePath(p) {
  return path.resolve(__dirname, p);
}
