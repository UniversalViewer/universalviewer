const webpack = require("webpack");
const pkg = require("./package.json");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

function resolvePath(p) {
  return path.resolve(__dirname, p);
}

const config = [
  {
    entry: {
      UV: ["./src/index.ts"],
    },
    mode: "production",
    output: {
      path: resolvePath("dist/umd"),
      publicPath: "auto",
      libraryTarget: "umd",
      library: "UV",
      umdNamedDefine: true,
      chunkFilename: "[name].[contenthash].js",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      fallback: {
        zlib: false,
        stream: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [{ loader: "ts-loader" }],
        },
        {
          test: /\.tsx$/,
          use: [
            { loader: "babel-loader" },
            { loader: "ts-loader" }
          ],
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
    plugins: [
      new webpack.EnvironmentPlugin({
        PACKAGE_VERSION: pkg.version,
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      }),
      new CopyPlugin({
        patterns: [
          {
            from: resolvePath("./src/index.html"),
            to: resolvePath("./dist"),
            transform(content) {
              return Promise.resolve(
                Buffer.from(
                  content
                    .toString()
                    .replace(
                      "<%= htmlWebpackPlugin.tags.headTags %>",
                      '<script type="text/javascript" src="umd/UV.js"></script>'
                    ),
                  "utf8"
                )
              );
            },
          },
          {
            from: resolvePath("./src/iiif-collection.json"),
            to: resolvePath("./dist"),
          },
          {
            from: resolvePath("./src/youtube-collection.json"),
            to: resolvePath("./dist"),
          },
          {
            from: resolvePath("./src/favicon.ico"),
            to: resolvePath("./dist"),
          },
          {
            from: resolvePath("./src/uv-iiif-config.json"),
            to: resolvePath("./dist"),
          },
          {
            from: resolvePath("./src/uv-youtube-config.json"),
            to: resolvePath("./dist"),
          },
          {
            from: resolvePath("./src/uv.css"),
            to: resolvePath("./dist"),
          },
          {
            from: resolvePath("./src/uv.html"),
            to: resolvePath("./dist"),
          },
        ],
      }),
    ],
  },
];

if (process.env.NODE_WEBPACK_LIBRARY_PATH) {
  config.output.path = resolvePath(process.env.NODE_WEBPACK_LIBRARY_PATH);
}

if (process.env.NODE_WEBPACK_LIBRARY_TARGET) {
  config.output.libraryTarget = process.env.NODE_WEBPACK_LIBRARY_TARGET;
}

module.exports = config;
