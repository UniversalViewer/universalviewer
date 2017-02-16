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

        global:
        {
            minify: 'optimize=none',
            port: '8001'
        },

        pkg: packageJson,

        typescript: {
            dev: config.typescript.dev,
            dist: config.typescript.dist
        },

        clean: {
            build : ['<%= config.directories.build %>'],
            bundle: ['./src/lib/bundle.js', './src/lib/bundle.min.js'],
            dist: ['<%= config.directories.dist %>'],
            examples: ['<%= config.directories.examples %>/uv-*'],
            distexamples: ['<%= config.directories.examples %>/uv-*.zip', '<%= config.directories.examples %>/uv-*.tar'],
            extension: ['./src/extensions/*/build/*']
        },

        concat: {
            bundle: {
                src: grunt.file.expand('src/lib/*').concat(config.dependencies.libs).concat(['!src/lib/embed.js']),
                dest: 'src/lib/bundle.js'
            }
        },

        copy: {
            schema: {
                files: [
                    // extension schema files
                    {
                        expand: true,
                        src: ['src/extensions/*/build/*.schema.json'],
                        dest: '<%= config.directories.build %>/schema/',
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
                    // package.json
                    {
                        expand: true,
                        flatten: true,
                        cwd: '.',
                        src: ['package.json'],
                        dest: '<%= config.directories.build %>'
                    },
                    // html
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'src',
                        src: ['app.html'],
                        dest: '<%= config.directories.build %>'
                    },
                    // js
                    {
                        expand: true,
                        flatten: true,
                        cwd: '<%= config.directories.lib %>',
                        src: [
                            'embed.js',
                            'bundle.min.js'
                        ],
                        dest: '<%= config.directories.build %>/lib/'
                    },
                    // extension configuration files
                    {
                        expand: true,
                        src: ['src/extensions/**/build/*.config.json'],
                        dest: '<%= config.directories.build %>/lib/',
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
                // copy contents of /build to /examples/build.
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
            },
            dist: {
                // copy contents of /build to /dist/build.
                files: [
                    {
                        cwd: '<%= config.directories.build %>',
                        expand: true,
                        src: ['**'],
                        dest: '<%= config.directories.dist %>/<%= config.directories.uvVersioned %>/'
                    }
                ]
            },
            distexamples: {
                // copy zip archives to examples
                files: [
                    {
                        cwd: '<%= config.directories.dist %>',
                        expand: true,
                        src: ['*.zip', '*.tar'],
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
                    {
                        // all d.ts files that need to be copied from /node_modules to /src/typings post npm install
                        expand: true,
                        flatten: true,
                        src: config.dependencies.typings,
                        dest: '<%= config.directories.typings %>'
                    },
                    mediaelementExtensionConfig.sync.dependencies,
                    mediaelementExtensionConfig.sync.typings,
                    pdfExtensionConfig.sync.dependencies,
                    pdfExtensionConfig.sync.typings,
                    seadragonExtensionConfig.sync.dependencies,
                    seadragonExtensionConfig.sync.typings,
                    virtexExtensionConfig.sync.dependencies,
                    virtexExtensionConfig.sync.typings
                ]
            }
        },

        compress: {
            zip: {
                options: {
                    mode: 'zip',
                    archive: '<%= config.directories.dist %>/<%= config.directories.uvVersioned %>.zip',
                    level: 9
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.directories.build %>/',
                        src: ['**']
                    }
                ]
            }//,
            // tar: {
            //     options: {
            //         mode: 'tar',
            //         archive: '<%= config.directories.dist %>/<%= config.directories.uvVersioned %>.tar'
            //     },
            //     files: [
            //         {
            //             expand: true,
            //             cwd: '<%= config.directories.build %>/',
            //             src: ['**']
            //         }
            //     ]
            // }
        },

        exec: {
            // concatenate and compress with r.js
            build: {
                cmd: 'node node_modules/requirejs/bin/r.js -o app.build.js' // optimize=none'
            },
        },

        replace: {

            html: {
                src: ['<%= config.directories.build %>/app.html'],
                overwrite: true,
                replacements: [
                    {
                        from: 'data-main="app"',
                        to: 'data-main="lib/app"'
                    },
                    {
                        from: 'lib/bundle.js',
                        to: 'lib/bundle.min.js'
                    }
                ]
            },
            js: {
                // replace window.DEBUG=true
                // todo: use a compiler flag when available
                src: ['<%= config.directories.build %>/lib/app.js'],
                overwrite: true,
                replacements: [
                    //{
                    //    from: /window.DEBUG.*=.*true;/g,
                    //    to: ''
                    //},
                    {
                        from: /window.DEBUG=!0;/g,
                        to: ''
                    }]
            },
            // ../../../modules/[module]/img/[image]
            // becomes
            // ../../img/[module]/[image]
            moduleimages: {
                // replace img srcs to point to "../../img/[module]/[img]"
                src: ['<%= config.directories.build %>/themes/*/css/*/theme.css'],
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
                    './src/lib/embed.js'
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
                    port: '<%= global.port %>',
                    base: '.',
                    directory: '.',
                    keepalive: true,
                    open: {
                        target: 'http://localhost:<%= global.port %>/<%= config.directories.examples %>/'
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
            },
            bundle: {
                files: {
                    'src/lib/bundle.min.js': ['src/lib/bundle.js']
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-text-replace');

    configure(grunt);
    theme(grunt);

    grunt.registerTask('default', '', function(){

        grunt.task.run(
            'clean:bundle',
            'concat:bundle',
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
        //var minify = grunt.option('minify');
        //if (minify) grunt.config.set('global.minify', '');

        grunt.task.run(
            'clean:bundle',
            'concat:bundle',
            'uglify:bundle',
            'typescript:dist',
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
            'replace:versions',
            'clean:examples',
            'copy:examples',
            'dist'
        );
    });

    // compress build into .zip and .tar
    grunt.registerTask('dist', '', function() {

        refresh();

        grunt.task.run(
            'clean:dist',
            'copy:dist',
            'compress:zip',
            //'compress:tar',
            'clean:distexamples',
            'copy:distexamples'
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
