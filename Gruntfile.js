var version = require('./build/version');

module.exports = function (grunt) {

    var packageJson,
        packageDirName;

    function loadPackage() {
        packageJson = grunt.file.readJSON("package.json");
        packageDirName = 'universalviewer-' + packageJson.version
    }

    loadPackage();

    grunt.initConfig({
        global:
        {
            //buildDir: 'build/uv-' + packageJson.version,
            minify: 'optimize=none',
            packageDirName: packageDirName,
            packageDir: 'build/' + packageDirName,
            examplesDir: 'examples',
            theme: 'uv-default-theme',
            port: '8001'
        },
        pkg: packageJson,
        ts: {
            dev: {
                src: [
                    './src/_Version.ts',
                    './src/*.ts',
                    './src/**/*.ts'
                ],
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
                    modifyVars: {
                        theme: '"<%= global.theme %>"'
                    }
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
                    modifyVars: {
                        theme: '"<%= global.theme %>"'
                    }
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
            build : ["build/uv-*"],
            package: ['<%= global.packageDir %>'],
            examples: ['<%= global.examplesDir %>/build/uv-*']
        },

        copy: {
            theme: {
                files: [
                    // theme images
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/themes/<%= global.theme%>/img/*'],
                        dest: '<%= global.buildDir %>/themes/<%= global.theme%>/img/'
                    },
                    // module images
                    {
                        expand: true,
                        src: ['src/modules/**/img/*'],
                        dest: '<%= global.buildDir %>/themes/<%= global.theme%>/img/',
                        rename: function (dest, src) {

                            var fileName = src.substr(src.lastIndexOf('/'));

                            // get the module name from the src string.
                            // src/modules/modulename/img
                            var moduleName = src.match(/modules\/(.*)\/img/)[1];

                            return dest + moduleName + fileName;
                        }
                    },
                    // extensions css
                    {
                        expand: true,
                        src: ['src/extensions/**/css/*.css'],
                        dest: '<%= global.buildDir %>/themes/<%= global.theme%>/css/',
                        rename: function(dest, src) {

                            // get the extension name from the src string.
                            // src/extensions/extensionname/css/styles.css
                            var extensionName = src.match(/extensions\/(.*)\/css/)[1];

                            return dest + extensionName + ".css";
                        }
                    }
                ]
            },
            build: {
                files: [
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
                        src: ['src/extensions/**/config/*.config.js'],
                        dest: '<%= global.buildDir %>/js/',
                        rename: function(dest, src) {

                            // get the extension name from the src string.
                            // src/extensions/extensionname/config.js
                             var reg = /extensions\/(.*)\/config\/(.*.config.js)/;
                            var extensionName = src.match(reg)[1];
                            var fileName = src.match(reg)[2];

                            return dest + extensionName + '.' + fileName;
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
                        src: ["<%= global.packageDirName %>/**"]
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
                cmd: 'node lib/r.js -o baseUrl=src/ mainConfigFile=src/app.js name=app <%= global.minify %> out=<%= global.buildDir %>/js/app.js'
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
                src: ['<%= global.buildDir %>/themes/<%= global.theme%>/css/*.css'],
                overwrite: true,
                replacements: [{
                    from: /\((?:'|"|)(?:.*modules\/(.*)\/img\/(.*.\w{3,}))(?:'|"|)\)/g,
                    to: '\(\'../img/$1/$2\'\)'
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
                // replace window.DEBUG=true
                // todo: use a compiler flag when available
                src: ['<%= global.buildDir %>/js/app.js'],
                overwrite: true,
                replacements: [{
                    from: /window.DEBUG.*=.*true;/g,
                    to: ''
                }]
            },
            examples: {
                // replace script paths with latest build version
                src: ['<%= global.examplesDir %>/examples.js'],
                overwrite: true,
                replacements: [{
                    from: /build\/uv.*?\//g,
                    to: '<%= global.buildDir %>/'
                }]
            }
        },

        extend: {
            config: {
                options: {
                    deep: true,
                    defaults: {}
                },
                files: addLocalesToConfig()
            }
        },

        connect: {
            dev: {
                options: {
                    port: '<%= global.port %>',
                    base: '.',
                    directory: '.',
                    keepalive: true,
                    open: {
                        target: 'http://localhost:<%= global.port %>/<%= global.examplesDir %>/'
                    }
                }
            }
        },

        protractor: {
            dev: {
                options: {
                    //todo: port
                    configFile: "tests/protractor-conf.js"
                }
            }
        },

        version: {
            bump: {
            },
            apply: {
                src: './build/_VersionTemplate._ts',
                dest: './src/_Version.ts'
            }
        }
    });

    function addLocalesToConfig(){

        // for each extension/l10n/xx-XX.json localisation file, add it to a locales object.
        // this is used to extend the config files so that the viewer knows what locales are available to it.
        var locales = {
            options: {
                locales: []
            }
        };

        var locPath = 'src/extensions/**/l10n/*.json';
        var locRegex = /(.*)\/l10n\/(.*).json/;

        grunt.file.expand({}, locPath).forEach(function(filepath) {
            var regex = (locRegex).exec(filepath);

            var locale = regex[2];

            locales.options.locales.push(locale);
        });

        console.log(locales);

        // for each extension/l10n/xx-XX.json localisation file, find its counterpart extension/config/xx-XX.json config file.
        // if none is found, fall back to en-GB.json
        // extend the config file with the localisation file.
        // copy it to the extension root naming it xx-XX.config.js

        var files = {};

        grunt.file.expand({}, locPath).forEach(function(filepath) {

            var regex = (locRegex).exec(filepath);

            var parent = regex[1] + '/config/';
            var locale = regex[2];
            var path = parent + locale;
            var dest = path + '.config.js';
            var config = path + '.js';

            // check config counterpart exists, if not fall back to en-GB.js
            if (!grunt.file.exists(config)){
                config = parent + 'en-GB.json';
            }

            files[dest] = [config, filepath];
        });

        return files;
    }

    //function getExtensionsConfig(){
    //
    //    // loop through all extension.config files.
    //    // if found to have "extends": "..." in root
    //    // add the file it extends and itself to
    //    // the file list.
    //
    //    var files = {};
    //
    //    grunt.file.expand({}, 'src/extensions/**/extension.config').forEach(function(filepath) {
    //
    //        var dest = (/(.*)extension.config/).exec(filepath)[1] + 'config.js';
    //
    //        // add dest and filepath. (only happens once per extension).
    //        files[dest] = [filepath];
    //
    //        // check if it extends another.
    //        // if it does, add it before the filepath.
    //        var json = grunt.file.readJSON(filepath);
    //
    //        if (json.extends){
    //            files[dest].unshift(json.extends);
    //        }
    //    });
    //
    //    return files;
    //}

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-extend");
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-protractor-runner');

    version(grunt);

    grunt.registerTask('dist:upbuild', ['version:bump', 'version:apply', 'build']);
    grunt.registerTask('dist:upminor', ['version:bump:minor', 'version:apply', 'build']);
    grunt.registerTask('dist:upmajor', ['version:bump:major', 'version:apply', 'build']);

    grunt.registerTask("default", '', function(){

        grunt.task.run(
            'ts:dev',
            'replace:dependenciesSimplify',
            'extend:config',
            'less:dev'
        );
    });

    function refresh() {
        loadPackage();
        var buildDir = 'build/uv-' + packageJson.version;
        grunt.config.set('global.buildDir', buildDir);
    }

    grunt.registerTask('build', '', function() {

        // grunt build --buildDir=myDir
        // or prepend / to target relative to system root.
        //var buildDir = grunt.option('buildDir');

        refresh();

        // grunt build --minify
        var minify = grunt.option('minify');
        if (minify) grunt.config.set('global.minify', '');

        grunt.task.run(
            'ts:build',
            'replace:dependenciesSimplify',
            'extend:config',
            'clean:build',
            'copy:build',
            'exec:build',
            'replace:html',
            'replace:js',
            'replace:dependenciesPaths',
            'replace:dependenciesExtension',
            'theme'
        );
    });

    // theme
    grunt.registerTask('theme', '', function() {

        // pass --name=mytheme to add to build/themes/mytheme
        var themeName = grunt.option('name');
        if (themeName) grunt.config.set('global.theme', themeName);

        grunt.task.run(
            'less:build',
            'copy:theme',
            'replace:img'
        );
    });

    // copy into examples folder
    grunt.registerTask('examples', '', function() {

        refresh();

        grunt.task.run(
            'replace:examples',
            'clean:examples',
            'copy:examples'
        );
    });

    // compress build into .zip package
    grunt.registerTask('package', '', function() {

        grunt.task.run(
            'copy:package',
            'compress',
            'clean:package'
        );
    });

    grunt.registerTask('serve', '', function() {

        grunt.task.run(
            'default',
            'connect'
        );
    });

    grunt.registerTask("test", '', function(){
        grunt.task.run(
            'protractor:dev'
        );
    });

};
