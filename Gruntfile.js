var configure = require('./tasks/configure');
var theme = require('./tasks/theme');
var c = require('./config');
var config = new c();
var mediaelementExtensionConfig = require('./src/extensions/uv-mediaelement-extension/config');
var pdfExtensionConfig = require('./src/extensions/uv-pdf-extension/config');
var seadragonExtensionConfig = require('./src/extensions/uv-seadragon-extension/config');
var virtexExtensionConfig = require('./src/extensions/uv-virtex-extension/config');

module.exports = function (grunt) {

    var packageJson;

    function refresh() {
        packageJson = grunt.file.readJSON("package.json");
        grunt.config.set('config.directories.uvVersioned', 'uv-' + packageJson.version);
        grunt.config.set('config.directories.uv', 'uv');
    }

    refresh();

    grunt.initConfig({

        config: config,

        pkg: packageJson,

        ts: {
            dev: {
                src: ['./src/**/*.ts', 'typings/**/*.ts'],
                options: {
                    module: 'amd',
                    sourceMap: true,
                    declarations: false,
                    noLib: false,
                    comments: true,
                    lib: ['es6'],
                    noImplicitAny: true,
                    noImplicitReturns: true,
                    noImplicitThis: false,
                    noUnusedLocals: true,
                    noUnusedParameters: false,
                    strictNullChecks: true,
                    suppressImplicitAnyIndexErrors: true,
                    target: "es3",
                    types: ['requirejs', 'jquery', 'modernizr', 'three']
                }
            },
            dist: {
                src: ['./src/**/*.ts', 'typings/**/*.ts'],
                options: {
                    module: 'amd',
                    sourceMap: false,
                    declarations: false,
                    noLib: false,
                    comments: false,
                    lib: ['es6'],
                    noImplicitAny: true,
                    noImplicitReturns: true,
                    noImplicitThis: false,
                    noUnusedLocals: true,
                    noUnusedParameters: false,
                    strictNullChecks: true,
                    suppressImplicitAnyIndexErrors: true,
                    target: "es3",
                    types: ['requirejs', 'jquery', 'modernizr', 'three']
                }
            }
        },

        clean: {
            build : ['<%= config.directories.build %>'],
            examples: ['<%= config.directories.examples %>/uv/'],
            extension: ['<%= config.directories.src %>/extensions/*/.build/*']
        },

        copy: {
            bundle: {
                files: [
                    // node modules
                    {
                        expand: true,
                        flatten: true,
                        cwd: '.',
                        src: config.dependencies.bundle,
                        dest: '<%= config.directories.lib %>/'
                    }
                ]
            },
            schema: {
                files: [
                    // extension schema files
                    {
                        expand: true,
                        src: ['src/extensions/*/.build/*.schema.json'],
                        dest: '<%= config.directories.build %>/schema/',
                        rename: function(dest, src) {
                            // get the extension name from the src string.
                            // src/extensions/[extension]/.build/[locale].schema.json
                            var reg = /extensions\/(.*)\/.build\/(.*.schema.json)/;
                            var extensionName = src.match(reg)[1];
                            var fileName = src.match(reg)[2];
                            return dest + extensionName + '.' + fileName;
                        }
                    }
                ]
            },
            build: {
                files: [
                    // package.json
                    {
                        expand: true,
                        flatten: true,
                        cwd: '.',
                        src: ['package.json'],
                        dest: '<%= config.directories.build %>'
                    },
                    // js
                    {
                        expand: true,
                        flatten: true,
                        src: ['<%= config.directories.src %>/build.js'],
                        dest: '<%= config.directories.build %>',
                        rename: function(dest, src) {
                            return dest + '/uv.js';
                        }
                    },
                    // js
                    {
                        expand: true,
                        flatten: true,
                        src: ['<%= config.directories.src %>/build.js.map'],
                        dest: '<%= config.directories.build %>'
                    },
                    // js
                    {
                        expand: true,
                        flatten: true,
                        src: ['<%= config.directories.lib %>/offline.js'],
                        dest: '<%= config.directories.build %>/lib'
                    },
                    // js
                    {
                        expand: true,
                        flatten: true,
                        cwd: '<%= config.directories.src %>',
                        src: [
                            'embed.js'
                        ],
                        dest: '<%= config.directories.build %>'
                    },
                    // extension configuration files
                    {
                        expand: true,
                        src: ['src/extensions/**/.build/*.config.json'],
                        dest: '<%= config.directories.build %>/lib/',
                        rename: function(dest, src) {
                            // get the extension name from the src string.
                            // src/extensions/[extension]/[locale].config.json
                            var reg = /extensions\/(.*)\/.build\/(.*.config.json)/;
                            var extensionName = src.match(reg)[1];
                            var fileName = src.match(reg)[2];
                            return dest + extensionName + '.' + fileName;
                        }
                    },
                    // extension dependencies
                    {
                        expand: true,
                        src: ['src/extensions/**/dependencies.js'],
                        dest: '<%= config.directories.build %>/lib/',
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
                        dest: '<%= config.directories.build %>/lib/'
                    },
                    // l10n localisation files
                    {
                        expand: true,
                        flatten: false,
                        cwd: 'src/modules/',
                        src: ['**/l10n/**/*.properties'],
                        dest: '<%= config.directories.build %>/l10n/',
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
                        dest: '<%= config.directories.build %>/html/',
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
                // copy contents of /.build to /examples/uv.
                files: [
                    {
                        cwd: '<%= config.directories.build %>',
                        expand: true,
                        src: ['**'],
                        dest: '<%= config.directories.examples %>/<%= config.directories.uv %>/'
                    },
                    // misc
                    {
                        expand: true,
                        flatten: true,
                        src: ['favicon.ico'],
                        dest: '<%= config.directories.examples %>/'
                    }
                ]
            }
        },

        sync: {
            bowerComponents: {
                files: [
                    {
                        // themes
                        cwd: '<%= config.directories.bower %>',
                        expand: true,
                        src: ['uv-*-theme/**'],
                        dest: '<%= config.directories.themes %>'
                    }
                ]
            },
            npmComponents: {
                files: [
                    mediaelementExtensionConfig.sync.dependencies,
                    pdfExtensionConfig.sync.dependencies,
                    seadragonExtensionConfig.sync.dependencies,
                    virtexExtensionConfig.sync.dependencies
                ]
            }
        },

        compress: {
            zip: {
                options: {
                    mode: 'zip',
                    archive: '<%= config.directories.examples %>/<%= config.directories.uvVersioned %>.zip',
                    level: 9
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.directories.build %>/',
                        src: ['**']
                    }
                ]
            }
        },

        concat: {
            offline: {
                cwd: '.',
                src: config.dependencies.offline,
                dest: '<%= config.directories.lib %>/offline.js'
            }
        },

        exec: {
            // concatenate and compress with r.js
            devbuild: {
                // todo: https://github.com/Rich-Harris/sorcery
                //cmd: 'node node_modules/requirejs/bin/r.js -o dev.build.js optimize=none && sorcery -i src/build.js'
                cmd: 'node node_modules/requirejs/bin/r.js -o dev.build.js optimize=none'
            },
            distbuild: {
                cmd: 'node node_modules/requirejs/bin/r.js -o dist.build.js'
            },
        },

        replace: {

            // ../../../modules/<module>/img/<image>
            // becomes
            // ../../img/<module>/<image>
            moduleimages: {
                // replace img srcs to point to "../../img/<module>/<img>"
                src: ['<%= config.directories.build %>/themes/*/css/*/theme.css'],
                overwrite: true,
                replacements: [{
                    from: /\((?:'|"|)(?:.*modules\/(.*)\/img\/(.*.\w{3,}))(?:'|"|)\)/g,
                    to: '\(\'../../img/$1/$2\'\)'
                }]
            },
            // ../../../themes/uv-default-theme/img/<img>
            // becomes
            // ../../../img/<img>
            themeimages: {
                // replace img srcs to point to "../../img/<module>/<img>"
                src: ['<%= config.directories.build %>/themes/*/css/*/theme.css'],
                overwrite: true,
                replacements: [{
                    from: /\((?:'|"|)(?:.*themes\/(.*)\/img\/(.*.\w{3,}))(?:'|"|)\)/g,
                    to: '\(\'../../img/$2\'\)'
                }]
            },
            versions: {
                // replace uv version
                src: [
                    //'<%= config.directories.examples %>/index.html',
                    //'<%= config.directories.examples %>/noeditor.html',
                    //'<%= config.directories.examples %>/examples.js',
                    //'<%= config.directories.examples %>/uv.js',
                    //'<%= config.directories.examples %>/web.config',
                    '<%= config.directories.src %>/embed.js'
                ],
                overwrite: true,
                replacements: [{
                    from: /uv-\d+\.\d+\.\d+/g,
                    to: '<%= config.directories.uvVersioned %>'
                }]
            }
        },

        connect: {
            dev: {
                options: {
                    port: '<%= config.examplesPort %>',
                    base: '.',
                    directory: '.',
                    keepalive: true,
                    open: {
                        target: 'http://localhost:<%= config.examplesPort %>/<%= config.directories.examples %>/'
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
        },

        uglify: {
            options: {
                mangle: false
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-text-replace');

    configure(grunt);
    theme(grunt);

    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', '', function() {

        refresh();

        var tsType = (grunt.option('dist')) ? 'ts:dist' : 'ts:dev';
        var execType = (grunt.option('dist')) ? 'exec:distbuild' : 'exec:devbuild';

        grunt.task.run(
            'sync',
            'copy:bundle',
            'concat:offline',
            tsType,
            'clean:extension',
            'configure:apply',
            'clean:build',
            'copy:schema',
            execType,
            'copy:build',
            'theme:create',
            'theme:dist',
            'replace:moduleimages',
            'replace:themeimages',
            'replace:versions',
            'clean:examples',
            'copy:examples',
            'compress:zip'
        );
    });

    grunt.registerTask('examples', '', function() {

        grunt.task.run(
            'connect'
        );
    });

    grunt.registerTask("test", '', function(){
        grunt.task.run(
            'protractor:dev'
        );
    });
};
