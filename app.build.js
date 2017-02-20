({
    baseUrl: "src/",
    paths: {
        requireLib: '../node_modules/requirejs/require'
    },
    mainConfigFile: "src/app.js",
    name: "app",
    out: "build/app.js",
    preserveLicenseComments: false,
    include: ["requireLib"],
    uglify: {
        no_mangle: true
    }
})