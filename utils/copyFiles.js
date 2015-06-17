var path = require('path');
var _ = require('lodash');
var glob = require('glob');
var grunt = require('grunt');

module.exports = function copyFiles(glob, dest, renameFunc) {
    var files = grunt.file.expand(glob);

    _.each(files, function(src) {
        var fileName, fileDest;

        if (renameFunc){
            fileDest = renameFunc(src, dest);
        } else {
            fileName = path.basename(src);
            fileDest = path.join(dest, fileName);
        }

        grunt.file.copy(src, fileDest);
    });
}
