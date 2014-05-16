module.exports = function (grunt) {

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-extend");

    var packageJson = grunt.file.readJSON("package.json"),
        packageDirName = 'wellcomeplayer-' + packageJson.version;

    grunt.initConfig({
        global:
        {
            buildDir: 'build/wellcomeplayer',
            minify: 'optimize=none',
            packageDirName: packageDirName,
            packageDir: 'build/' + packageDirName,
            examplesDir: 'examples'
        },
        pkg: packageJson,
        ts: {
            dev: {
                src: ["src/**/*.ts"],
                options: {
                    target: 'es3',
                    module: 'amd',
                    sourcemap: true,
                    declarations: false,
                    nolib: false,
                    comments: true
                }
            },
            build: {
                src: ["src/**/*.ts"],
                options: {
                    target: 'es3',
                    module: 'amd',
                    sourcemap: false,
                    declarations: false,
                    nolib: false,
                    comments: false
                }
            }
        },

        less: {
            dev: {
                options: {
                    paths: ["src/modules"]
                },
                files: [
                    {
                        expand: true,
                        src: "src/extensions/**/*.less",
                        ext: ".css"
                    }
                ]
            },
            build: {
                options: {
                    paths: ["src/modules"]
                    //compress: true
                },
                files: [
                    {
                        expand: true,
                        src: "src/extensions/**/*.less",
                        ext: ".css"
                    }
                ]
            }
        },

        clean: {
            build : ["<%= global.buildDir %>/*"],
            package: ['<%= global.packageDir %>'],
            examples: ['<%= global.examplesDir %>/<%= global.buildDir %>']
        },

        copy: {
            build: {
                files: [
                    // images
                    {
                        expand: true,
                        src: ['src/modules/**/img/*'],
                        dest: '<%= global.buildDir %>/img/',
                        rename: function(dest, src) {

                            var fileName = src.substr(src.lastIndexOf('/'));

                            // get the module name from the src string.
                            // src/modules/modulename/img
                            var moduleName = src.match(/modules\/(.*)\/img/)[1];

                            return dest + moduleName + fileName;
                        }
                    },
                    // html
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'src',
                        src: ['index.html', 'app.html'],
                        dest: '<%= global.buildDir %>'
                    },
                    // js
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'src/js',
                        src: ['embed.js', 'easyXDM.min.js', 'easyxdm.swf', 'json2.min.js', 'require.js', 'l10n.js', 'base64.min.js'],
                        dest: '<%= global.buildDir %>/js/'
                    },
                    // extension configuration files
                    {
                        expand: true,
                        src: ['src/extensions/**/config.js'],
                        dest: '<%= global.buildDir %>/js/',
                        rename: function(dest, src) {

                            // get the extension name from the src string.
                            // src/extensions/extensionname/config.js
                            var extensionName = src.match(/extensions\/(.*)\/config.js/)[1];

                            return dest + extensionName + '-config.js';
                        }
                    },
                    // extension dependencies list
                    {
                        expand: true,
                        src: ['src/extensions/**/dependencies.js'],
                        dest: '<%= global.buildDir %>/js/',
                        rename: function(dest, src) {

                            // get the extension name from the src string.
                            var reg = /extensions\/(.*)\/dependencies.js/;
                            var extensionName = src.match(reg)[1];

                            return dest + extensionName + '-dependencies.js';
                        }
                    },
                    // extension dependencies
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/extensions/**/js/*'],
                        dest: '<%= global.buildDir %>/js/'
                    },
                    // extensions css
                    {
                        expand: true,
                        src: ['src/extensions/**/css/*.css'],
                        dest: '<%= global.buildDir %>/css/',
                        rename: function(dest, src) {

                            // get the extension name from the src string.
                            // src/extensions/extensionname/css/styles.css
                            var extensionName = src.match(/extensions\/(.*)\/css/)[1];

                            return dest + extensionName + ".css";
                        }
                    },
                    // anything in the module/js folders that isn't
                    // a js file. could be swfs or supporting files
                    // for a 3rd party library.
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/modules/**/js/*.*', '!src/modules/**/js/*.js'],
                        dest: '<%= global.buildDir %>/js/'
                    },
                    // l10n localisation files.
                    {
                        expand: true,
                        flatten: false,
                        cwd: 'src/modules/',
                        src: ['**/l10n/**/*.properties'],
                        dest: '<%= global.buildDir %>/l10n/',
                        rename: function(dest, src) {
                            // get the locale and .properties files.
                            var reg = /.*\/l10n\/(.*)/;
                            var locale = src.match(reg)[1];
                            var path = dest + locale;
                            return path;
                        }
                    },
                    // module html.
                    {
                        expand: true,
                        src: ['src/modules/**/html/*'],
                        dest: '<%= global.buildDir %>/html/',
                        rename: function(dest, src) {

                            var fileName = src.substr(src.lastIndexOf('/'));

                            // get the module name from the src string.
                            // src/modules/modulename/img
                            var moduleName = src.match(/modules\/(.*)\/html/)[1];

                            return dest + moduleName + fileName;
                        }
                    }
                ]
            },
            examples: {
                // copy contents of /build to examples.
                files: [
                    {
                        cwd: '<%= global.buildDir %>',
                        expand: true,
                        src: ['**'],
                        dest: '<%= global.examplesDir %>/<%= global.buildDir %>'
                    }
                ]
            },
            package: {
                // copy contents of /build to packageDir.
                files: [
                    {
                        cwd: '<%= global.buildDir %>',
                        expand: true,
                        src: ['**'],
                        dest: '<%= global.packageDir %>'
                    }
                ]
            }
        },

        compress: {
            zip: {
                options: {
                    archive: "build/releases/<%= global.packageDirName %>.zip",
                    level: 9
                },
                files: [
                    {
                        expand: true,
                        cwd: "build/",
                        src: ["<%= global.packageDirName %>/**" ]
                    }
                ]
            },
            tar: {
                options: {
                    archive: "build/releases/<%= global.packageDirName %>.tar.gz",
                    level: 9
                },
                files: [
                    {
                        expand: true,
                        cwd: "build/",
                        src: ["<%= global.packageDirName %>/**" ]
                    }
                ]
            }
        },

        exec: {
            // concatenate and compress with r.js
            build: {
                cmd: 'node tools/r.js -o baseUrl=src/ mainConfigFile=src/app.js name=app <%= global.minify %> out=<%= global.buildDir %>/js/app.js'
            }
        },

        replace: {
            // convert extension dynamic dependency files to use simplified commonjs wrapper.
            dependenciesSimplify: {
                src: ['src/extensions/**/dependencies.js'],
                overwrite: true,
                replacements: [{
                    from: 'define(["require", "exports"], function(require, exports)',
                    to: 'define(function()'
                }]
            },
            // replace dependency paths to point to same /js directory.
            dependenciesPaths: {
                src: ['<%= global.buildDir %>/js/*dependencies.js'],
                overwrite: true,
                replacements: [{
                    //from: /.\/js\/(.*)/g,
                    from: /:.*(?:'|").*\/(.*)(?:'|")/g,
                    to: ': \'$1\''
                }]
            },
            // replace "./dependencies" with "../../[extension]-dependencies"
            dependenciesExtension: {
                src: ['<%= global.buildDir %>/js/app.js'],
                overwrite: true,
                replacements: [{
                    from: /'extensions\/(.*)\/extension'(.*)(.\/dependencies)/g,
                    to: '\'extensions/$1/extension\'$2../../$1-dependencies'
                }]
            },
            img: {
                // replace img srcs to point to "../img/[module]/[img]"
                src: ['<%= global.buildDir %>/css/*.css'],
                overwrite: true,
                replacements: [{
                    from: /\((?:'|"|)(?:.*modules\/(.*)\/img\/(.*.\w{3,}))(?:'|"|)\)/g,
                    to: '\(\'../img/$1/$2\'\)'
                }]
            },
            config: {
                // replace "config.js" with "[extension]-config.js"
                src: ['<%= global.buildDir %>/js/app.js'],
                overwrite: true,
                replacements: [{
                    from: /config:.*(?:'|")extensions\/(.*)\/config.js(?:'|")/g,
                    to: 'config:"js/$1-config.js"'
                }]
            },
            css: {
                // replace "styles.css" with "[extension].css"
                src: ['<%= global.buildDir %>/js/app.js'],
                overwrite: true,
                replacements: [{
                    from: /css:.*(?:'|")extensions\/(.*)\/css\/styles.css(?:'|")/g,
                    to: 'css:"css/$1.css"'
                }]
            },
            html: {
                src: ['<%= global.buildDir %>/app.html'],
                overwrite: true,
                replacements: [{
                    from: 'data-main="app"',
                    to: 'data-main="js/app"'
                }]
            },
            js: {
                // replace js.
                src: ['<%= global.buildDir %>/js/app.js'],
                overwrite: true,
                replacements: [{
                    from: /window.DEBUG.*=.*true;/g,
                    to: ''
                }]
            }
        },

        extend: {
            config: {
                options: {
                    deep: true,
                    defaults: {}
                },
                files: getExtensionsConfig()
            }
        }
    });

    function getExtensionsConfig(){

        // loop through all extension.config files.
        // if found to have "extends": "..." in root
        // add the file it extends and itself to
        // the file list.

        var files = {};

        grunt.file.expand({}, 'src/extensions/**/extension.config').forEach(function(filepath) {

            var dest = (/(.*)extension.config/).exec(filepath)[1] + 'config.js';

            // add dest and filepath. (only happens once per extension).
            files[dest] = [filepath];

            // check if it extends another.
            // if it does, add it before the filepath.
            var json = grunt.file.readJSON(filepath);

            if (json.extends){
                files[dest].unshift(json.extends);
            }
        });

        return files;
    }

    grunt.registerTask("default", '', function(){

        grunt.task.run(
            'ts:dev',
            'replace:dependenciesSimplify',
            'less:dev',
            'extend:config'
        );
    });

    grunt.registerTask('build', '', function() {

        // grunt build --buildDir=myDir
        // or prepend / to target relative to system root.
        var buildDir = grunt.option('buildDir');
        if (buildDir) grunt.config.set('global.buildDir', buildDir);

        // grunt build --minify
        var minify = grunt.option('minify');
        if (minify) grunt.config.set('global.minify', '');

        grunt.task.run(
            'ts:build',
            'replace:dependenciesSimplify',
            'less:build',
            'extend:config',
            'clean:build',
            'copy:build',
            'exec:build',
            'replace:img',
            'replace:config',
            'replace:css',
            'replace:html',
            'replace:js',
            'replace:dependenciesPaths',
            'replace:dependenciesExtension'
        );
    });

    // build and copy into examples folder
    grunt.registerTask('examples', '', function() {

        // grunt package --buildDir=myDir
        // or prepend / to target relative to system root.
        var buildDir = grunt.option('buildDir');
        if (buildDir) grunt.config.set('global.buildDir', buildDir);

        grunt.task.run(
            'build',
            'clean:examples',
            'copy:examples'
        );
    });

    grunt.registerTask('package', '', function() {

        // grunt package --buildDir=myDir
        // or prepend / to target relative to system root.
        var buildDir = grunt.option('buildDir');
        if (buildDir) grunt.config.set('global.buildDir', buildDir);

        grunt.task.run(
            'build',
            'copy:package',
            'compress',
            'clean:package'
        );
    });

};