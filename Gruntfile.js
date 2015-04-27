var version = require('./build/version');
var localise = require('./build/localise');
var theme = require('./build/theme');

module.exports = function (grunt) {

    var packageJson;

    function refresh() {
        packageJson = grunt.file.readJSON("package.json");
        var buildDir = 'build/uv-' + packageJson.version;
        grunt.config.set('global.buildDir', buildDir);
        var packageDirName = 'uv-' + packageJson.version;
        grunt.config.set('global.packageDirName', packageDirName);
        grunt.config.set('global.packageDir', 'build/' + packageDirName);
    }

    refresh();

    grunt.initConfig({
        global:
        {
            minify: 'optimize=none',
            examplesDir: 'examples',
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

        clean: {
            build : ['build/uv-*'],
            package: ['<%= global.packageDir %>'],
            examples: ['<%= global.examplesDir %>/build/uv-*'],
            cleanup: ['./src/extensions/*/config/*.js', './src/extensions/*/theme/*.css']
        },

        copy: {
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
                            // src/extensions/[extension]/[locale].config.js
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
                    },
                    // misc
                    {
                        expand: true,
                        flatten: true,
                        src: ['favicon.ico'],
                        dest: '<%= global.examplesDir %>/'
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
            // convert dependency files to use simplified commonjs wrapper.
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

            // ../../extensions/uv-seadragon-extension/dependencies
            // becomes
            // uv-seadragon-extension-dependencies
            dependenciesExtension: {
                src: ['<%= global.buildDir %>/js/app.js'],
                overwrite: true,
                replacements: [{
                    from: /..\/..\/extensions\/(.*)\/dependencies/g,
                    to: '$1-dependencies'
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
            // ../../../modules/[module]/img/[image]
            // becomes
            // ../../img/[module]/[image]
            moduleimages: {
                // replace img srcs to point to "../../img/[module]/[img]"
                src: ['<%= global.buildDir %>/themes/*/css/*/theme.css'],
                overwrite: true,
                replacements: [{
                    from: /\((?:'|"|)(?:.*modules\/(.*)\/img\/(.*.\w{3,}))(?:'|"|)\)/g,
                    to: '\(\'../../img/$1/$2\'\)'
                }]
            },
            // ../../../themes/uv-default-theme/img/[img]
            // becomes
            // ../../../img/[img]
            themeimages: {
                // replace img srcs to point to "../../img/[module]/[img]"
                src: ['<%= global.buildDir %>/themes/*/css/*/theme.css'],
                overwrite: true,
                replacements: [{
                    from: /\((?:'|"|)(?:.*themes\/(.*)\/img\/(.*.\w{3,}))(?:'|"|)\)/g,
                    to: '\(\'../../img/$2\'\)'
                }]
            },
            examples: {
                // replace script paths with latest build version
                src: ['<%= global.examplesDir %>/index.html', '<%= global.examplesDir %>/noeditor.html', '<%= global.examplesDir %>/examples.js', '<%= global.examplesDir %>/uv.js'],
                overwrite: true,
                replacements: [{
                    from: /build\/uv.*?\//g,
                    to: '<%= global.buildDir %>/'
                }]
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
        },

        localise: {
            apply: {
                options: {
                    default: 'en-GB.json'
                }
            }
        },

        theme: {
            create: {
                files: [
                    {
                        expand: true,
                        src: "./src/extensions/*/theme/theme.less"
                    }
                ]
            },
            dist: {
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-protractor-runner');

    version(grunt);
    localise(grunt);
    theme(grunt);

    // to change version manually, edit package.json and _Version.ts
    grunt.registerTask('dist:upbuild', ['version:bump', 'version:apply', 'build']);
    grunt.registerTask('dist:upminor', ['version:bump:minor', 'version:apply', 'build']);
    grunt.registerTask('dist:upmajor', ['version:bump:major', 'version:apply', 'build']);

    grunt.registerTask("default", '', function(){

        grunt.task.run(
            'ts:dev',
            'replace:dependenciesSimplify',
            'localise:apply',
            'theme:create'
        );
    });

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
            'localise:apply',
            'clean:build',
            'copy:build',
            'exec:build',
            'replace:html',
            'replace:js',
            'replace:dependenciesPaths',
            'replace:dependenciesExtension',
            'theme:create',
            'theme:dist',
            'replace:moduleimages',
            'replace:themeimages'
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

        refresh();

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

    // delete all extension/config/[locale].js, extension/theme/[theme].css files
    grunt.registerTask("cleanup", '', function(){
        grunt.task.run(
            'clean:cleanup'
        );
    });

};
