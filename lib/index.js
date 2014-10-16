var createPattern = function(path) {
    return {pattern: path, included: true, served: true, watched: false};
};

var initKarmaCucumber = function(files) {
    files.unshift(createPattern(__dirname + '/adapter.js'));
};

initKarmaCucumber.$inject = ['config.files'];

module.exports = {
    'framework:cucumberjs': ['factory', initKarmaCucumber]
};