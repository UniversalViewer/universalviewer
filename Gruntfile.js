// var configure = require("./tasks/configure");
var c = require("./config");
var config = new c();

module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      themes: config.directories.themes,
      build: config.directories.build,
      dist: config.directories.dist,
      distumd: config.directories.distumd,
      extension: config.directories.src + "/extensions/*/.build/*",
    },

    copy: {
      build: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              // Hopefully this is only needed for demo.
              config.directories.src + "/_headers",
              config.directories.src + "/collection.json",
              config.directories.src + "/favicon.ico",
              config.directories.src + "/index.html",
              config.directories.src + "/mobile.html",
              config.directories.src + "/uv-config.json",
              config.directories.src + "/uv.css",
              config.directories.src + "/uv.html",
            ],
            dest: config.directories.build + "/",
          },
          // extension configuration files
          {
            expand: true,
            src: ["src/extensions/**/.build/*.config.json"],
            dest: config.directories.build + "/uv-assets/config/",
            rename: function(dest, src) {
              // get the extension name from the src string.
              // src/extensions/[extension]/[locale].config.json
              var reg = /extensions\/(.*)\/.build\/(.*.config.json)/;
              var extensionName = src.match(reg)[1];
              var fileName = src.match(reg)[2];
              return dest + extensionName + "." + fileName;
            },
          },
        ],
      },
      dist: {
        // copy contents of /.build to /dist
        files: [
          {
            cwd: config.directories.build,
            expand: true,
            src: ["**"],
            dest: config.directories.dist,
          },
        ],
      },
    },

    configure: {
      apply: {
        options: {
          default: "en-GB",
        },
      },
    },

    webpack: {
      main: function() {
        var config = require("./webpack.config.js");
        config.mode = grunt.option("dist") ? "production" : "development";
        if (config.mode === "development") {
          config.devtool = "source-map";
        }
        return config;
      },
    },
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-webpack");

  // configure(grunt);

  grunt.registerTask("default", ["build"]);

  grunt.registerTask("build", "", function() {
    grunt.task.run(
      // Cleans builds the extension config
      "clean:extension",
      "configure:apply",
      // Cleans the .build folder
      "clean:build",
      // Runs webpack.
      "webpack",
      // Copies remaining non-webpack managed files:
      //  - html + fixtures for demo
      //  - JSON configuration
      //  - bundle.js
      "copy:build",
      // Cleans and copies .build to dist
      "clean:dist",
      "copy:dist",
    );
  });
};
