const webpack = require('webpack');
const { resolvePath, createThemeConfig } = require('./webpack-helpers');
const pkg = require('./package.json');

const config = [{
  entry: {
    UV: ["./src/index.ts"],
  },
  output: {
    path: resolvePath(".build/uv-dist-umd"),
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
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            }
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                strictMath: true,
              },
              additionalData: '@theme: "uv-en-gb-theme";',
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      PACKAGE_VERSION: pkg.version,
    }),
  ]
}];

config.push(createThemeConfig('uv-en-gb-theme', require.resolve('@universalviewer/uv-en-gb-theme/theme.less')));
config.push(createThemeConfig('uv-cy-gb-theme', require.resolve('@universalviewer/uv-cy-gb-theme/theme.less')));

if (process.env.NODE_WEBPACK_LIBRARY_PATH) {
  config.output.path = resolvePath(process.env.NODE_WEBPACK_LIBRARY_PATH);
}

if (process.env.NODE_WEBPACK_LIBRARY_TARGET) {
  config.output.libraryTarget = process.env.NODE_WEBPACK_LIBRARY_TARGET;
}

module.exports = config;