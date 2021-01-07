const path = require('path');

function resolvePath(p) {
    return path.resolve(__dirname, p);
}

function createThemeConfig(theme, themePath) {
    return {
        mode: 'production',
        entry: {
            index: [themePath],
        },
        output: {
            path: resolvePath(`.build/uv-assets/themes/${theme}`),
            publicPath: `/uv-assets/themes/${theme}`,
        },
        resolve: {
            extensions: [".less", ".css"],
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.less$/,
                    use: [
                        {
                            loader: "css-loader",
                        },
                        {
                            loader: "less-loader",
                            options: {
                                lessOptions: {
                                    strictMath: true,
                                },
                                additionalData: '@theme: "uv-en-gb-theme";', // This should be unused.
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
    }
}


module.exports = {
    resolvePath: resolvePath,
    createThemeConfig: createThemeConfig,
};
