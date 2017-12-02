({
    baseUrl: "src/",
    paths: {
        requireLib: "../node_modules/requirejs/require"
    },
    mainConfigFile: "src/app.js",
    name: "app",
    out: "src/build.js",
    preserveLicenseComments: false,
    include: ["requireLib"],
    uglify: {
        no_mangle: true
    }
})