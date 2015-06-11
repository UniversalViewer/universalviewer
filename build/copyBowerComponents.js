var path = require('path');
var _ = require('lodash');
var glob = require('glob');
var copyFiles = require('./utils/copyFiles');
var ncp = require('ncp').ncp;

module.exports = function (grunt) {

    var options;

    grunt.registerMultiTask('copyBowerComponents', 'Copies UV components to their corresponding directories.', function () {

        options = this.data.options;

        var modulesGlob = options.directory + '/uv-*-module';
        var moduleDirs = glob.sync(modulesGlob);

        _.each(moduleDirs, function(dir) {
            var dest = path.join(options.modules, path.basename(dir));
            grunt.file.mkdir(dest);

            ncp(dir, dest, function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log('done!');
            });

        });
    });

};