const path = require("path");
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

function resolvePath(p) {
  return path.resolve(__dirname, p);
}

const config = {
  entry: {
    UV: ["./src/index.ts"],
  },
  output: {
    path: resolvePath("uv-dist-umd"),
    publicPath: "/uv-dist-umd/",
    libraryTarget: "umd",
    library: "UV",
    umdNamedDefine: true,
    chunkFilename: "[name].[contenthash].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{ loader: "ts-loader" }],
      },
    ],
  },
  // plugins: [
  //     new BundleAnalyzerPlugin()
  // ]
};

if (process.env.NODE_WEBPACK_LIBRARY_PATH) {
  config.output.path = resolvePath(process.env.NODE_WEBPACK_LIBRARY_PATH);
}

if (process.env.NODE_WEBPACK_LIBRARY_TARGET) {
  config.output.libraryTarget = process.env.NODE_WEBPACK_LIBRARY_TARGET;
}

module.exports = config;
