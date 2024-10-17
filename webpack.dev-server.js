const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const express = require("express");
const webpack = require("webpack");
const pkg = require("./package.json");

const config = {
  entry: {
    UV: ["./src/index.ts"],
  },
  mode: "development",
  devtool: "eval-source-map",
  output: {
    libraryTarget: "umd",
    library: "UV",
    umdNamedDefine: true,
    chunkFilename: "[name].[contenthash].js",
    globalObject: "this",
  },
  resolve: {
    alias: {
      jquery: require.resolve("jquery/dist/jquery.js"),
    },
    extensions: [".ts", ".tsx", ".js"],
    fallback: {
      zlib: false,
      stream: false,
    },
  },
  module: {
    rules: [
      { test: /\.js$/, loader: "source-map-loader", enforce: "pre" },
      {
        test: /\.ts$/,
        use: [{ loader: "ts-loader" }],
      },
      {
        test: /\.tsx$/,
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
            },
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
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    static: path.join(__dirname),
    open: true,
    compress: true,
    port: 8080,
    onListening(devServer) {
      devServer.app.use("/docs", express.static(path.join(__dirname, "docs")));
      devServer.app.use(
        "/iiif-collection.json",
        express.static(path.join(__dirname, "src", "iiif-collection.json"))
      );
      devServer.app.use(
        "/youtube-collection.json",
        express.static(path.join(__dirname, "src", "youtube-collection.json"))
      );
      devServer.app.use(
        "/uv-iiif-config.json",
        express.static(path.join(__dirname, "src", "uv-iiif-config.json"))
      );
      devServer.app.use(
        "/uv-youtube-config.json",
        express.static(path.join(__dirname, "src", "uv-youtube-config.json"))
      );
      devServer.app.use(
        "/uv.css",
        express.static(path.join(__dirname, "src", "uv.css"))
      );
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      PACKAGE_VERSION: `${pkg.version} (development)`,
    }),
    new HtmlWebpackPlugin({
      title: "UV Examples",
      template: "./src/index.html",
      minify: false,
      inject: "head",
    }),
    new HtmlWebpackPlugin({
      title: "UV Examples",
      template: "./src/uv.html",
      filename: "uv.html",
      minify: false,
      inject: "head",
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
    }),
  ],
  ignoreWarnings: [/Failed to parse source map/],
};

module.exports = config;
