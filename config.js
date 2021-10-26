const metadata = require("./package");

// todo: can this be removed?
module.exports = function() {
  this.name = metadata.name;
  this.header =
    "// " +
    this.name +
    " v" +
    metadata.version +
    " " +
    metadata.homepage +
    "\n";
  this.directories = {
    bower: "./lib",
    build: "./.build",
    dist: "./dist",
    distumd: "./uv-dist-umd",
    extensions: "./src/extensions",
    lib: "./src/lib",
    modules: "./src/modules",
    npm: "./node_modules",
    npmthemes: "./node_modules/@universalviewer",
    src: "./src",
    themes: "./src/themes",
    uv: "uv",
  };
  this.themes = {};
};
