const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const express = require('express')
const webpack = require('webpack');
const pkg = require('./package.json');

const config = {
  entry: {
    UV: ["./src/index.ts"],
  },
  mode: 'development',
  output: {
    libraryTarget: "umd",
    library: "UV",
    umdNamedDefine: true,
    chunkFilename: "[name].[contenthash].js",
    globalObject: 'this'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    fallback: {
      "zlib": false,
      "stream": false,
    }
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
  devServer: {
    static: path.join(__dirname),
    client: {
      progress: true,
    },
    open: true,
    compress: true,
    port: 8080,
    onListening(devServer) {
      devServer.app.use('/collection.json',
          express.static(path.join(__dirname, 'src', 'collection.json')));
      devServer.app.use('/uv-config.json',
          express.static(path.join(__dirname, 'src', 'uv-config.json')));
      devServer.app.use('/uv.css',
          express.static(path.join(__dirname, 'src', 'uv.css')));
      devServer.app.use('/uv-assets/config',
          express.static(path.join(__dirname, 'dist', 'uv-assets', 'config')));
      devServer.app.use('/uv-assets/themes',
          express.static(path.join(__dirname, 'dist', 'uv-assets', 'themes')));
      devServer.app.use('/uv-assets/img',
          express.static(path.join(__dirname, 'dist', 'uv-assets', 'img')));
      devServer.app.use('/uv-assets/js/bundle.js',
          express.static(path.join(__dirname, 'dist', 'uv-assets', 'js', 'bundle.js')));
    }
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      PACKAGE_VERSION: `${pkg.version} (development)`,
    }),
    new HtmlWebpackPlugin({
      title: 'UV Examples',
      template: './src/html-templates/index.html',
      minify: false,
      inject: 'head',
    }),
    new webpack.ProvidePlugin({
      "$":"jquery",
      "jQuery":"jquery",
      "window.jQuery":"jquery",
    }),
  ]
};

module.exports = config;
