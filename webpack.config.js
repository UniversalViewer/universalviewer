const path = require("path");
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

function resolvePath(p) {
    return path.resolve(__dirname, p)
}

const config = {
    // These are the entry point of our library. We tell webpack to use the name we assign later, when creating the bundle.
    // We also use the name to filter the second entry point for applying code minification via UglifyJS
    entry: {
        "UV": ["./src/index.ts"]
    },
    externals: {
        "node-fetch": "fetch",
        "fetch-cookie": "fetch",
        "tough-cookie": "fetch"
    },
    // The output defines how and where we want the bundles. The special value `[name]` in `filename` tells Webpack to use the name we defined above.
    // We target a UMD and name it UV. When including the bundle in the browser it will be accessible at `window.UV`
    output: {
        path: resolvePath("dist-umd"),
        publicPath: "dist-umd/",
        libraryTarget: "umd",
        library: "UV",
        umdNamedDefine: true,
        chunkFilename: "[name].[contenthash].js"
    },
    // Add resolve for `tsx` and `ts` files, otherwise Webpack would
    // only look for common JavaScript file extension (.js)
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    // Webpack doesn't understand TypeScript files and a loader is needed.
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    { loader: "ts-loader" }
                ]
            }
        ]
    }
    // plugins: [
    //     new BundleAnalyzerPlugin()
    // ]
}

if (process.env.NODE_WEBPACK_LIBRARY_PATH) {
    config.output.path = resolvePath(process.env.NODE_WEBPACK_LIBRARY_PATH);
}

if (process.env.NODE_WEBPACK_LIBRARY_TARGET) {
    config.output.libraryTarget = process.env.NODE_WEBPACK_LIBRARY_TARGET;
}

module.exports = config;