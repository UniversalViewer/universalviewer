const webpack = require('webpack');
const { resolvePath, createThemeConfig } = require('./webpack-helpers');
const pkg = require('./package.json');

<<<<<<< HEAD
function resolvePath(p) {
  return path.resolve(__dirname, p);
}

const config = {
<<<<<<< HEAD
    entry: {
        "UV": ["./src/index.ts"]
    },
    // todo: can these be removed?
    externals: {
        "node-fetch": "fetch",
        "fetch-cookie": "fetch",
        "tough-cookie": "fetch"
    },
    output: {
        path: resolvePath("uv-dist-umd"),
        publicPath: "uv-dist-umd/",
        libraryTarget: "umd",
        library: "UV",
        umdNamedDefine: true,
        chunkFilename: "[name].[contenthash].js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    node: {
        fs: "empty"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    { loader: "ts-loader" }
                ]
            },
            {
                // any file with a specified extension imported from an assets folder
                test: /\.*\/assets.*.(png|jpe?g|gif|js)$/i,
                use: [
                    { loader: "file-loader" }
                ]
            }
        ]
    }
    // plugins: [
    //     new BundleAnalyzerPlugin()
    // ]
}
=======
=======
const config = [{
>>>>>>> merge-webpack-al-2
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
<<<<<<< HEAD
  // plugins: [
  //     new BundleAnalyzerPlugin()
  // ]
};
>>>>>>> webpack-al
=======
  plugins: [
    new webpack.EnvironmentPlugin({
      PACKAGE_VERSION: pkg.version,
    }),
  ]
}];

config.push(createThemeConfig('uv-en-gb-theme', require.resolve('@universalviewer/uv-en-gb-theme/theme.less')));
config.push(createThemeConfig('uv-cy-gb-theme', require.resolve('@universalviewer/uv-cy-gb-theme/theme.less')));
>>>>>>> merge-webpack-al-2

if (process.env.NODE_WEBPACK_LIBRARY_PATH) {
  config.output.path = resolvePath(process.env.NODE_WEBPACK_LIBRARY_PATH);
}

if (process.env.NODE_WEBPACK_LIBRARY_TARGET) {
  config.output.libraryTarget = process.env.NODE_WEBPACK_LIBRARY_TARGET;
}

module.exports = config;
