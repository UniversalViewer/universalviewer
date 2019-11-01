const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function resolvePath(p) {
    return path.resolve(__dirname, p)
}

const config = {
    // These are the entry point of our library. We tell webpack to use the name we assign later, when creating the bundle.
    // We also use the name to filter the second entry point for applying code minification via UglifyJS
    entry: {
        'UV': ['./src/index.ts'],
        'AVExtension': ['./src/extensions/uv-av-extension/Extension.ts'],
        'DefaultExtension': ['./src/extensions/uv-default-extension/Extension.ts'],
        'MediaElementExtension': ['./src/extensions/uv-mediaelement-extension/Extension.ts'],
        'OpenSeadragonExtension': ['./src/extensions/uv-openseadragon-extension/Extension.ts'],
        'PDFExtension': ['./src/extensions/uv-pdf-extension/Extension.ts'],
        'VirtexExtension': ['./src/extensions/uv-virtex-extension/Extension.ts']
    },
    // The output defines how and where we want the bundles. The special value `[name]` in `filename` tells Webpack to use the name we defined above.
    // We target a UMD and name it UV. When including the bundle in the browser it will be accessible at `window.UV`
    output: {
        path: resolvePath('dist-umd'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'UV',
        umdNamedDefine: true
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        }
    },
    node: {
        net: 'empty'
    },
    // Add resolve for `tsx` and `ts` files, otherwise Webpack would
    // only look for common JavaScript file extension (.js)
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    // Activate source maps for the bundles in order to preserve the original
    // source when the user debugs the application
    //devtool: 'source-map',
    optimization: {
        minimize: false,
        concatenateModules: true
    },
    // Webpack doesn't understand TypeScript files and a loader is needed.
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    { loader: 'awesome-typescript-loader' }
                ]
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin()
    ]
}

if (process.env.NODE_WEBPACK_LIBRARY_PATH) {
    config.output.path = resolvePath(process.env.NODE_WEBPACK_LIBRARY_PATH);
}

if (process.env.NODE_WEBPACK_LIBRARY_TARGET) {
    config.output.libraryTarget = process.env.NODE_WEBPACK_LIBRARY_TARGET;
}

module.exports = config;