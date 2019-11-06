const path = require("path");
const webpack = require("webpack");

function resolvePath(p) {
    return path.resolve(__dirname, p)
}

const config = {
    // These are the entry point of our library. We tell webpack to use the name we assign later, when creating the bundle.
    // We also use the name to filter the second entry point for applying code minification via UglifyJS
    entry: {
        'openseadragon' : ['./node_modules/openseadragon/build/openseadragon/openseadragon.js']
    },
    // The output defines how and where we want the bundles. The special value `[name]` in `filename` tells Webpack to use the name we defined above.
    // We target a UMD and name it UV. When including the bundle in the browser it will be accessible at `window.UV`
    output: {
        path: resolvePath('dist-umd'),
        filename: '[name].js',
        //libraryTarget: 'umd',
        library: '[name]'
        //umdNamedDefine: true,
        //chunkFilename: '[name].bundle.js'
    },
    // Add resolve for `tsx` and `ts` files, otherwise Webpack would
    // only look for common JavaScript file extension (.js)
    resolve: {
        extensions: ['.js']
    },
    // Activate source maps for the bundles in order to preserve the original
    // source when the user debugs the application
    //devtool: 'source-map',
    optimization: {
        minimize: false
    },
    plugins: [
        new webpack.DllPlugin({
            name: "[name]",
            path: path.join(__dirname, "dist-umd", "[name]-manifest.json")
        })
    ]
}

if (process.env.NODE_WEBPACK_LIBRARY_PATH) {
    config.output.path = resolvePath(process.env.NODE_WEBPACK_LIBRARY_PATH);
}

if (process.env.NODE_WEBPACK_LIBRARY_TARGET) {
    config.output.libraryTarget = process.env.NODE_WEBPACK_LIBRARY_TARGET;
}

module.exports = config;