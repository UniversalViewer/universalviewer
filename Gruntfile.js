var configure = require('./tasks/configure');
var theme = require('./tasks/theme');
var c = require('./config');
var config = new c();
var avExtensionConfig = require('./src/extensions/uv-av-extension/config');
var mediaelementExtensionConfig = require('./src/extensions/uv-mediaelement-extension/config');
var pdfExtensionConfig = require('./src/extensions/uv-pdf-extension/config');
var seadragonExtensionConfig = require('./src/extensions/uv-seadragon-extension/config');
var virtexExtensionConfig = require('./src/extensions/uv-virtex-extension/config');

module.exports = function (grunt) {

    var packageJson;

    function readPackageJson() {
        packageJson = grunt.file.readJSON('package.json');
    }

    readPackageJson();

    grunt.initConfig({

        ts: {
            dev: {
                tsconfig: './tsconfig.json',
                options: {
                    additionalFlags: '--sourceMap'
                }
            },
            dist: {
                tsconfig: './tsconfig.json',
                options: {
                    additionalFlags: '--removeComments'
                }
            }
        },

        clean: {
            themes: config.directories.themes,
            build: config.directories.build,
            dist: config.directories.examples + '/uv/',
            extension: config.directories.src + '/extensions/*/.build/*',
            libs: config.directories.src + '/extensions/*/lib/*'
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
                        dest: config.directories.lib
                    }
                ]
            },
            schema: {
                files: [
                    // extension schema files
                    {
                        expand: true,
                        src: ['src/extensions/*/.build/*.schema.json'],
                        dest: config.directories.build + '/schema/',
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
                    // js
                    {
                        expand: true,
                        flatten: true,
                        src: [ config.directories.src + '/build.js'],
                        dest: config.directories.build,
                        rename: function(dest, src) {
                            return dest + '/uv.js';
                        }
                    },
                    // js
                    {
                        expand: true,
                        flatten: true,
                        src: [config.directories.src + '/build.js.map'],
                        dest: config.directories.build
                    },
                    // js
                    {
                        expand: true,
                        flatten: true,
                        src: [config.directories.lib + '/offline.js'],
                        dest: config.directories.build + '/lib'
                    },
                    // js
                    {
                        expand: true,
                        flatten: true,
                        src: [config.directories.src + '/helpers.js'],
                        dest: config.directories.build,
                        rename: function(dest, src) {
                            return dest + '/helpers.js';
                        }
                    },
                    // html
                    {
                        expand: true,
                        flatten: true,
                        src: [config.directories.src + '/uv.html'],
                        dest: config.directories.build
                    },
                    // css
                    {
                        expand: true,
                        flatten: true,
                        src: [config.directories.src + '/uv.css'],
                        dest: config.directories.build
                    },
                    // extension configuration files
                    {
                        expand: true,
                        src: ['src/extensions/**/.build/*.config.json'],
                        dest: config.directories.build + '/lib/',
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
                        dest: config.directories.build + '/lib/',
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
                        dest: config.directories.build + '/lib/'
                    },
                    // images
                    {
                        expand: true,
                        flatten: true,
                        src: 'src/img/*',
                        dest: config.directories.build + '/img/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        src: 'src/favicon.ico',
                        dest: config.directories.build
                    }
                ]
            },
            dist: {
                // copy contents of /.build to /examples/uv.
                files: [
                    {
                        cwd: config.directories.build,
                        expand: true,
                        src: ['**'],
                        dest: config.directories.examples + '/' + config.directories.uv + '/'
                    },
                    // misc
                    {
                        expand: true,
                        flatten: true,
                        src: ['favicon.ico'],
                        dest: config.directories.examples + '/'
                    }
                ]
            }
        },

        sync: {
            themes: {
                files: [
                    {
                        cwd: config.directories.npm,
                        expand: true,
                        src: ['uv-*-theme/**'],
                        dest: config.directories.themes
                    }
                ]
            },
            npmComponents: {
                files: [
                    avExtensionConfig.sync.dependencies,
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
                    archive: config.directories.examples + '/' + config.directories.uv + '.zip',
                    level: 9
                },
                files: [
                    {
                        expand: true,
                        cwd: config.directories.build + '/',
                        src: ['**']
                    }
                ]
            }
        },

        concat: {
            offline: {
                cwd: '.',
                src: config.dependencies.offline,
                dest: config.directories.lib + '/offline.js'
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
            // ../../../modules/<module>/assets/<asset>
            // becomes
            // ../../../<module>/<asset>
            moduleassets: {
                src: [config.directories.build + '/themes/*/css/*/theme.css'],
                overwrite: true,
                replacements: [{
                    from: /\((?:'|"|)(?:.*modules\/(.*)\/assets\/(.*.\w{3,}))(?:'|"|)\)/g,
                    to: '\(\'../../assets/$1/$2\'\)'
                }]
            },
            // ../../../themes/uv-default-theme/assets/<asset>
            // becomes
            // ../../assets/<asset>
            themeassets: {
                src: [config.directories.build + '/themes/*/css/*/theme.css'],
                overwrite: true,
                replacements: [{
                    from: /\((?:'|"|)(?:.*themes\/(.*)\/assets\/(.*.\w{3,}))(?:'|"|)\)/g,
                    to: '\(\'../../assets/$2\'\)'
                }]
            }
        },

        connect: {
            dev: {
                options: {
                    port: config.examplesPort,
                    base: '.',
                    directory: '.',
                    keepalive: true,
                    open: {
                        target: 'http://localhost:' + config.examplesPort + '/' + config.directories.examples + '/'
                    }
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
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-text-replace');

    configure(grunt);
    theme(grunt);

    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', '', function() {

        readPackageJson();

        var tsType = (grunt.option('dist')) ? 'ts:dist' : 'ts:dev';
        var execType = (grunt.option('dist')) ? 'exec:distbuild' : 'exec:devbuild';

        grunt.task.run(
            'clean:libs',
            'clean:themes',
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
            'replace:moduleassets',
            'replace:themeassets',
            'clean:dist',
            'copy:dist',
            'compress:zip'
        );
    });

    grunt.registerTask('examples', '', function() {

        grunt.task.run(
            'connect'
        );
    });
};
