({
    baseUrl: "src/",
    paths: {
        requireLib: '../node_modules/requirejs/require'
    },
    mainConfigFile: "src/app.js",
    name: "app",
    out: "src/build.js",
    generateSourceMaps: true,
    preserveLicenseComments: false,
    skipSemiColonInsertion: true, //https://github.com/requirejs/r.js/issues/799#issuecomment-148635527
    include: ["requireLib"]
})