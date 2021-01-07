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
    contentBase: path.join(__dirname),
    compress: true,
    port: 5020,
    setup(app) {
      app.use('/collection.json',
          express.static(path.join(__dirname, 'src', 'collection.json')));
      app.use('/uv-config.json',
          express.static(path.join(__dirname, 'src', 'uv-config.json')));
      app.use('/uv.css',
          express.static(path.join(__dirname, 'src', 'uv.css')));
      app.use('/uv-assets/config',
          express.static(path.join(__dirname, 'www', 'uv-assets', 'config')));
      app.use('/uv-assets/themes',
          express.static(path.join(__dirname, 'www', 'uv-assets', 'themes')));
      app.use('/uv-assets/img',
          express.static(path.join(__dirname, 'www', 'uv-assets', 'img')));
      app.use('/uv-assets/js/bundle.js',
          express.static(path.join(__dirname, 'www', 'uv-assets', 'js', 'bundle.js')));
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
  ]
};

module.exports = config;
