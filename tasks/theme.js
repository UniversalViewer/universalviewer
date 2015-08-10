var path = require('path');
var _ = require('lodash');
var glob = require('glob');
var async = require('async');
var less = require('less');
var chalk = require('chalk');
var copyFiles = require('./copyFiles');

module.exports = function (grunt) {

    grunt.registerMultiTask('theme', 'Creates themes.', function () {

        if (this.target === 'create') {
            create.call(this);
        } else if (this.target === 'dist') {
            dist.call(this);
        }
    });

    // for each theme, compile each extension's theme.less file passing the theme name
    function create() {

        this.options = this.data.options || {};

        var dirs = getThemeDirs();

        var done = this.async();

        var options = this.options;

        options.banner = '';

        if (this.files.length < 1) {
            grunt.verbose.warn('Destination not written because no source files were provided.');
        }

        var that = this;

        async.eachSeries(dirs, function(d, nextDirObj) {
            var theme = path.basename(d);

            options.modifyVars = {
                theme: theme
            };

            async.eachSeries(that.files, function (f, nextFileObj) {
                var parent = path.dirname(f.dest);
                parent = parent.substring(0, parent.lastIndexOf('/'));
                parent = path.join(parent, 'build/');

                var destFile = path.join(parent, theme + '.css');

                var files = f.src.filter(function (filepath) {
                    // Warn on and remove invalid source files (if nonull was set).
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                });

                if (files.length === 0) {
                    if (f.src.length < 1) {
                        grunt.log.warn('Destination ' + chalk.cyan(destFile) + ' not written because no source files were found.');
                    }

                    // No src files, goto next target. Warn would have been issued above.
                    return nextFileObj();
                }

                var compiled = [];
                var i = 0;

                async.concatSeries(files, function (file, next) {
                    if (i++ > 0) {
                        options.banner = '';
                    }

                    compileLess(file, destFile, options)
                        .then(function (output) {
                            compiled.push(output.css);
                            if (options.sourceMap && !options.sourceMapFileInline) {
                                var sourceMapFilename = options.sourceMapFilename;
                                if (!sourceMapFilename) {
                                    sourceMapFilename = destFile + '.map';
                                }
                                grunt.file.write(sourceMapFilename, output.map);
                                grunt.log.writeln('File ' + chalk.cyan(sourceMapFilename) + ' created.');
                            }
                            process.nextTick(next);
                        },
                        function (err) {
                            nextFileObj(err);
                        });
                }, function () {
                    if (compiled.length < 1) {
                        grunt.log.warn('Destination ' + chalk.cyan(destFile) + ' not written because compiled files were empty.');
                    } else {
                        var allCss = compiled.join(options.compress ? '' : grunt.util.normalizelf(grunt.util.linefeed));
                        grunt.file.write(destFile, allCss);
                        grunt.log.writeln('File ' + chalk.cyan(destFile) + ' created');
                    }
                    nextFileObj();
                });

            }, nextDirObj);
        }, done);
    }

    function dist() {
        this.options = this.data.options;

        var dirs = getThemeDirs();

        _.each(dirs, function(dir) {
            var theme = path.basename(dir);

            // ./src/themes/[theme]/img/[image]
            // goes to
            // [global.buildDir]/themes/[theme]/img/[image]
            copyFiles('./src/themes/' + theme + '/img/*', path.join(getThemeDest(theme), 'img'));

            // ./src/extensions/*/build/[theme].css
            // goes to
            // [global.buildDir]/themes/[theme]/css/[extension]/theme.css'
            copyFiles('./src/extensions/*/build/' + theme + '.css', path.join(getThemeDest(theme), 'css'), function(src, dest) {

                // get the extension name from the src string.
                // ./src/extensions/[extension]/build/[theme].css
                var extensionName = src.match(/extensions\/(.*)\/build/)[1];

                return path.join(dest, extensionName, 'theme.css');
            });

            // ./src/modules/*/img/*
            // goes to
            // [global.buildDir]/themes/[theme]/img/[module]/',
            copyFiles('./src/modules/*/img/*', path.join(getThemeDest(theme), 'img'), function(src, dest) {
                var fileName = path.basename(src);

                // get the module name from the src string.
                // ./src/modules/[module]/img
                var moduleName = src.match(/modules\/(.*)\/img/)[1];

                return path.join(dest, moduleName, fileName);
            });
        });

        //async.eachSeries(dirs, function (d, nextDirObj) {
        //    var theme = path.basename(d);
        //
        //    grunt.config.set('global.theme', theme);
        //
        //    preAndPostHook(grunt.task.run('copy:theme'), function() {
        //        nextDirObj();
        //    });
        //}, done);
    }

    function getThemeDest(theme) {
        var buildDir = grunt.config('config.dirs.build');
        return path.join(buildDir, 'themes', theme);
    }

    //// todo: async, only copy if changed
    //function copyFiles(glob, dest, renameFunc) {
    //    var files = grunt.file.expand(glob);
    //
    //    _.each(files, function(src) {
    //        var fileName, fileDest;
    //
    //        if (renameFunc){
    //            fileDest = renameFunc(src, dest);
    //        } else {
    //            fileName = path.basename(src);
    //            fileDest = path.join(dest, fileName);
    //        }
    //
    //        grunt.file.copy(src, fileDest);
    //    });
    //}

    function getThemeDirs() {
        return glob.sync('./src/themes/*');
    }

    var compileLess = function(srcFile, destFile, options) {
        options = _.assign({filename: srcFile}, options);
        options.paths = options.paths || [path.dirname(srcFile)];

        if (typeof options.paths === 'function') {
            try {
                options.paths = options.paths(srcFile);
            } catch (e) {
                grunt.fail.warn(wrapError(e, 'Generating @import paths failed.'));
            }
        }

        if (options.sourceMap && !options.sourceMapFileInline && !options.sourceMapFilename) {
            options.sourceMapFilename = destFile + '.map';
        }

        if (typeof options.sourceMapBasepath === 'function') {
            try {
                options.sourceMapBasepath = options.sourceMapBasepath(srcFile);
            } catch (e) {
                grunt.fail.warn(wrapError(e, 'Generating sourceMapBasepath failed.'));
            }
        }

        if (typeof(options.sourceMap) === "boolean" && options.sourceMap) {
            options.sourceMap = {
                sourceMapBasepath: options.sourceMapBasepath,
                sourceMapFilename: options.sourceMapFilename,
                sourceMapInputFilename: options.sourceMapInputFilename,
                sourceMapFullFilename: options.sourceMapFullFilename,
                sourceMapURL: options.sourceMapURL,
                sourceMapRootpath: options.sourceMapRootpath,
                outputSourceFiles: options.outputSourceFiles,
                sourceMapFileInline: options.sourceMapFileInline
            };
        }

        var srcCode = grunt.file.read(srcFile);

        // Equivalent to --modify-vars option.
        // Properties under options.modifyVars are appended as less variables
        // to override global variables.
        var modifyVarsOutput = parseVariableOptions(options['modifyVars']);
        if (modifyVarsOutput) {
            srcCode += '\n';
            srcCode += modifyVarsOutput;
        }

        // Load custom functions
        if (options.customFunctions) {
            Object.keys(options.customFunctions).forEach(function(name) {
                less.functions.functionRegistry.add(name.toLowerCase(), function() {
                    var args = [].slice.call(arguments);
                    args.unshift(less);
                    var res = options.customFunctions[name].apply(this, args);
                    return typeof res === 'object' ? res : new less.tree.Anonymous(res);
                });
            });
        }

        return less.render(srcCode, options)
            .catch(function(err) {
                lessError(err, srcFile);
            });
    };

    var parseVariableOptions = function(options) {
        var pairs = _.pairs(options);
        var output = '';
        pairs.forEach(function(pair) {
            output += '@' + pair[0] + ':' + pair[1] + ';';
        });
        return output;
    };

    var formatLessError = function(e) {
        var pos = '[' + 'L' + e.line + ':' + ('C' + e.column) + ']';
        return e.filename + ': ' + pos + ' ' + e.message;
    };

    var lessError = function(e, file) {
        var message = less.formatError ? less.formatError(e) : formatLessError(e);

        grunt.log.error(message);
        grunt.fail.warn('Error compiling ' + file);
    };

    var wrapError = function (e, message) {
        var err = new Error(message);
        err.origError = e;
        return err;
    };
};