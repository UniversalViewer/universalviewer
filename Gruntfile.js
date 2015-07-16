var version = require('./tasks/version');
var configure = require('./tasks/configure');
var theme = require('./tasks/theme');

module.exports = function (grunt) {

    var packageJson;

    function refresh() {
        packageJson = grunt.file.readJSON("package.json");
        grunt.config.set('dirs.uv', 'uv-' + packageJson.version);
    }

    refresh();

    grunt.initConfig({

        dirs: {
            bower: './lib',
            build: './build',
            dist: './dist',
            examples: './examples',
            extensions: './src/extensions',
            lib: './src/lib',
            modules: './src/modules',
            themes: './src/themes',
            typings: './src/typings'
        },

        global:
        {
            minify: 'optimize=none',
            port: '8001'
        },

        pkg: packageJson,

        typescript: {
            dev: {
                src: [
                    //'./src/_Version.ts',
                    //'./src/*.ts',
                    './src/**/*.ts'
                ],
                options: {
                    target: 'es3',
                    module: 'amd',
                    sourceMap: true,
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
                    sourceMap: false,
                    declarations: false,
                    nolib: false,
                    comments: false
                }
            }
        },

        clean: {
            build : ['<%= dirs.build %>'],
            dist: ['<%= dirs.dist %>'],
            examples: ['<%= dirs.examples %>/uv-*'],
            extension: ['./src/extensions/*/build/*']
        },

        copy: {
            schema: {
                files: [
                    // extension schema files
                    {
                        expand: true,
                        src: ['src/extensions/*/build/*.schema.json'],
                        dest: '<%= dirs.build %>/schema/',
                        rename: function(dest, src) {
                            // get the extension name from the src string.
                            // src/extensions/[extension]/build/[locale].schema.json
                            var reg = /extensions\/(.*)\/build\/(.*.schema.json)/;
                            var extensionName = src.match(reg)[1];
                            var fileName = src.match(reg)[2];

                            return dest + extensionName + '.' + fileName;
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
                        src: ['app.html'],
                        dest: '<%= dirs.build %>'
                    },
                    // js
                    {
                        expand: true,
                        flatten: true,
                        cwd: '<%= dirs.lib %>',
                        src: ['embed.js', 'easyXDM.min.js', 'easyxdm.swf', 'json2.min.js', 'require.js', 'l10n.js', 'base64.min.js'],
                        dest: '<%= dirs.build %>/lib/'
                    },
                    // extension configuration files
                    {
                        expand: true,
                        src: ['src/extensions/**/build/*.config.json'],
                        dest: '<%= dirs.build %>/lib/',
                        rename: function(dest, src) {

                            // get the extension name from the src string.
                            // src/extensions/[extension]/[locale].config.json
                            var reg = /extensions\/(.*)\/build\/(.*.config.json)/;
                            var extensionName = src.match(reg)[1];
                            var fileName = src.match(reg)[2];

                            return dest + extensionName + '.' + fileName;
                        }
                    },
                    // extension dependencies
                    {
                        expand: true,
                        src: ['src/extensions/**/dependencies.js'],
                        dest: '<%= dirs.build %>/lib/',
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
                        src: ['src/extensions/**/lib/*'],
                        dest: '<%= dirs.build %>/lib/'
                    },
                    // l10n localisation files
                    {
                        expand: true,
                        flatten: false,
                        cwd: 'src/modules/',
                        src: ['**/l10n/**/*.properties'],
                        dest: '<%= dirs.build %>/l10n/',
                        rename: function(dest, src) {
                            // get the locale and .properties files.
                            var reg = /.*\/l10n\/(.*)/;
                            var locale = src.match(reg)[1];
                            var path = dest + locale;
                            return path;
                        }
                    },
                    // module html
                    {
                        expand: true,
                        src: ['src/modules/**/html/*'],
                        dest: '<%= dirs.build %>/html/',
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
                // copy contents of /build to /examples/build.
                files: [
                    {
                        cwd: '<%= dirs.build %>',
                        expand: true,
                        src: ['**'],
                        dest: '<%= dirs.examples %>/<%= dirs.uv %>/'
                    },
                    // misc
                    {
                        expand: true,
                        flatten: true,
                        src: ['favicon.ico'],
                        dest: '<%= dirs.examples %>/'
                    }
                ]
            }
        },

        sync: {
            bowerComponents: {
                files: [
                    {
                        // extensions
                        cwd: '<%= dirs.bower %>',
                        expand: true,
                        src: ['uv-*-extension/**'],
                        dest: '<%= dirs.extensions %>'
                    },
                    {
                        // modules
                        cwd: '<%= dirs.bower %>',
                        expand: true,
                        src: ['uv-*-module/**'],
                        dest: '<%= dirs.modules %>'
                    },
                    {
                        // themes
                        cwd: '<%= dirs.bower %>',
                        expand: true,
                        src: ['uv-*-theme/**'],
                        dest: '<%= dirs.themes %>'
                    },
                    {
                        // all files that need to be copied from /lib to /src/lib post bower install
                        cwd: '<%= dirs.bower %>',
                        expand: true,
                        flatten: true,
                        src: [
                            'es6-promise/promise.min.js',
                            'extensions/dist/extensions.js',
                            'utils/dist/utils.js',
                            'jquery-plugins/dist/jquery-plugins.js',
                            'Units/Length.min.js'
                        ],
                        dest: '<%= dirs.lib %>'
                    },
                    {
                        // all files that need to be copied from /lib to /src/typings post bower install
                        cwd: '<%= dirs.bower %>',
                        expand: true,
                        flatten: true,
                        src: [
                            'extensions/typings/extensions.d.ts',
                            'utils/dist/utils.d.ts',
                            'jquery-plugins/typings/jquery-plugins.d.ts'
                        ],
                        dest: '<%= dirs.typings %>'
                    }
                ]
            }
        },

        compress: {
            zip: {
                options: {
                    mode: 'zip',
                    archive: '<%= dirs.dist %>/<%= dirs.uv %>.zip',
                    level: 9
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= dirs.build %>/',
                        src: ['**']
                    }
                ]
            },
            tar: {
                options: {
                    mode: 'tar',
                    archive: '<%= dirs.dist %>/<%= dirs.uv %>.tar'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= dirs.build %>/',
                        src: ['**']
                    }
                ]
            }
        },

        exec: {
            // concatenate and compress with r.js
            build: {
                cmd: 'node lib/r.js/dist/r.js -o baseUrl=src/ mainConfigFile=src/app.js name=app <%= global.minify %> out=<%= dirs.build %>/lib/app.js'
            }
        },

        replace: {

            html: {
                src: ['<%= dirs.build %>/app.html'],
                overwrite: true,
                replacements: [{
                    from: 'data-main="app"',
                    to: 'data-main="lib/app"'
                }]
            },
            js: {
                // replace window.DEBUG=true
                // todo: use a compiler flag when available
                src: ['<%= dirs.build %>/lib/app.js'],
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
                src: ['<%= dirs.build %>/themes/*/css/*/theme.css'],
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
                src: ['<%= dirs.build %>/themes/*/css/*/theme.css'],
                overwrite: true,
                replacements: [{
                    from: /\((?:'|"|)(?:.*themes\/(.*)\/img\/(.*.\w{3,}))(?:'|"|)\)/g,
                    to: '\(\'../../img/$2\'\)'
                }]
            },
            examples: {
                // replace uv version
                src: [
                    '<%= dirs.examples %>/index.html',
                    '<%= dirs.examples %>/noeditor.html',
                    '<%= dirs.examples %>/examples.js',
                    '<%= dirs.examples %>/uv.js',
                    '<%= dirs.examples %>/web.config'
                ],
                overwrite: true,
                replacements: [{
                    from: /uv-\d+\.\d+\.\d+/g,
                    to: '<%= dirs.uv %>'
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
                        target: 'http://localhost:<%= global.port %>/<%= dirs.examples %>/'
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
                src: './VersionTemplate.ts',
                dest: './src/_Version.ts'
            }
        },

        configure: {
            apply: {
                options: {
                    default: 'en-GB'
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

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-text-replace');

    version(grunt);
    configure(grunt);
    theme(grunt);

    // to change version manually, edit package.json
    grunt.registerTask('bump:patch', ['version:bump', 'version:apply']);
    grunt.registerTask('bump:minor', ['version:bump:minor', 'version:apply']);
    grunt.registerTask('bump:major', ['version:bump:major', 'version:apply']);

    grunt.registerTask('default', '', function(){

        grunt.task.run(
            'typescript:dev',
            'clean:extension',
            'configure:apply',
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
            'typescript:build',
            'clean:extension',
            'configure:apply',
            'clean:build',
            'copy:schema',
            'copy:build',
            'exec:build',
            'replace:html',
            'replace:js',
            'theme:create',
            'theme:dist',
            'replace:moduleimages',
            'replace:themeimages',
            'replace:examples',
            'clean:examples',
            'copy:examples'
        );
    });

    // compress build into .zip and .tar
    grunt.registerTask('dist', '', function() {

        refresh();

        grunt.task.run(
            'clean:dist',
            'compress:zip',
            'compress:tar'
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
