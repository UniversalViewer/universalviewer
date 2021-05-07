const { createThemeConfig } = require('./webpack-helpers');

const npmTheme = process.env.NPM_THEME;
const theme = (process.env.THEME || npmTheme ? npmTheme : 'uv-en-gb-theme');
const themePath = npmTheme ? require.resolve(`${npmTheme}/theme.less`) : process.env.THEME_PATH || ('./src/themes/' + theme + '/theme.less');

module.exports = createThemeConfig(theme, themePath);
