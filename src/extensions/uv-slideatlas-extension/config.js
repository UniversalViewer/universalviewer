var c = require("../../../config");
var config = new c();

module.exports = {
  sync: {
    dependencies: [
      {
        cwd: config.directories.npm,
        expand: true,
        flatten: true,
        src: "slideatlas-viewer/dist/*",
        dest: "./src/extensions/uv-slideatlas-extension/lib"
      }
    ]
  }
};
