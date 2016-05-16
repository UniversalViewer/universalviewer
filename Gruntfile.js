var version = require('./tasks/version');
var configure = require('./tasks/configure');
var theme = require('./tasks/theme');
var c = require('./config');
var config = new c();

module.exports = function (grunt) {

    var packageJson;

    function refresh() {
        packageJson = grunt.file.readJSON("package.json");
        grunt.config.set('config.dirs.uvVersioned', 'uv-' + packageJson.version);
        grunt.config.set('config.dirs.uv', 'uv');
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
            build : ['<%= config.dirs.build %>'],
            dist: ['<%= config.dirs.dist %>'],
            examples: ['<%= config.dirs.examples %>/uv-*'],
            distexamples: ['<%= config.dirs.examples %>/uv-*.zip', '<%= config.dirs.examples %>/uv-*.tar'],
            extension: ['./src/extensions/*/build/*']
        },

        copy: {
            schema: {
                files: [
                    // extension schema files
                    {
                        expand: true,
                        src: ['src/extensions/*/build/*.schema.json'],
                        dest: '<%= config.dirs.build %>/schema/',
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
                        dest: '<%= config.dirs.build %>'
                    },
                    // js
                    {
                        expand: true,
                        flatten: true,
                        cwd: '<%= config.dirs.lib %>',
                        src: [
                            'embed.js',
                            'easyXDM.min.js',
                            'easyxdm.swf',
                            'json2.min.js',
                            'require.js',
                            'l10n.js',
                            'base64.min.js'
                        ],
                        dest: '<%= config.dirs.build %>/lib/'
                    },
                    // extension configuration files
                    {
                        expand: true,
                        src: ['src/extensions/**/build/*.config.json'],
                        dest: '<%= config.dirs.build %>/lib/',
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
                        dest: '<%= config.dirs.build %>/lib/',
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
                        dest: '<%= config.dirs.build %>/lib/'
                    },
                    // l10n localisation files
                    {
                        expand: true,
                        flatten: false,
                        cwd: 'src/modules/',
                        src: ['**/l10n/**/*.properties'],
                        dest: '<%= config.dirs.build %>/l10n/',
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
                        dest: '<%= config.dirs.build %>/html/',
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
                        cwd: '<%= config.dirs.build %>',
                        expand: true,
                        src: ['**'],
                        dest: '<%= config.dirs.examples %>/<%= config.dirs.uv %>/'
                    },
                    // misc
                    {
                        expand: true,
                        flatten: true,
                        src: ['favicon.ico'],
                        dest: '<%= config.dirs.examples %>/'
                    }
                ]
            },
            dist: {
                // copy contents of /build to /dist/build.
                files: [
                    {
                        cwd: '<%= config.dirs.build %>',
                        expand: true,
                        src: ['**'],
                        dest: '<%= config.dirs.dist %>/<%= config.dirs.uvVersioned %>/'
                    }
                ]
            },
            distexamples: {
                // copy zip archives to examples
                files: [
                    {
                        cwd: '<%= config.dirs.dist %>',
                        expand: true,
                        src: ['*.zip', '*.tar'],
                        dest: '<%= config.dirs.examples %>/'
                    }
                ]
            }
        },

        sync: {
            bowerComponents: {
                files: [
                    {
                        // extensions
                        cwd: '<%= config.dirs.bower %>',
                        expand: true,
                        src: ['uv-*-extension/**'],
                        dest: '<%= config.dirs.extensions %>'
                    },
                    {
                        // modules
                        cwd: '<%= config.dirs.bower %>',
                        expand: true,
                        src: ['uv-*-module/**'],
                        dest: '<%= config.dirs.modules %>'
                    },
                    {
                        // themes
                        cwd: '<%= config.dirs.bower %>',
                        expand: true,
                        src: ['uv-*-theme/**'],
                        dest: '<%= config.dirs.themes %>'
                    },
                    {
                        // all js files that need to be copied from /lib to /src/lib post bower install
                        cwd: '<%= config.dirs.bower %>',
                        expand: true,
                        flatten: true,
                        src: [
                            'exjs/dist/ex.es3.min.js',
                            'extensions/dist/extensions.js',
                            'http-status-codes/dist/http-status-codes.js',
                            'jquery-plugins/dist/jquery-plugins.js',
                            'jquery-tiny-pubsub/dist/ba-tiny-pubsub.min.js',
                            'key-codes/dist/key-codes.js',
                            'Units/Length.min.js',
                            'utils/dist/utils.js'
                        ],
                        dest: '<%= config.dirs.lib %>'
                    },
                    {
                        // all d.ts files that need to be copied from /lib to /src/typings post bower install
                        cwd: '<%= config.dirs.bower %>',
                        expand: true,
                        flatten: true,
                        src: [
                            'exjs/dist/ex.d.ts',
                            'extensions/typings/extensions.d.ts',
                            'http-status-codes/dist/http-status-codes.d.ts',
                            'jquery-plugins/typings/jquery-plugins.d.ts',
                            'key-codes/dist/key-codes.d.ts',
                            'manifesto/dist/manifesto.d.ts',
                            'utils/dist/utils.d.ts'
                        ],
                        dest: '<%= config.dirs.typings %>'
                    }
                ]
            },
            npmComponents: {
                files: [
                    {
                        // all js files that need to be copied from /node_modules to /src/lib post npm install
                        cwd: '<%= config.dirs.npm %>',
                        expand: true,
                        flatten: true,
                        src: [
                            'manifesto.js/dist/client/manifesto.js'
                        ],
                        dest: '<%= config.dirs.lib %>'
                    },
                    {
                        // all d.ts files that need to be copied from /node_modules to /src/typings post npm install
                        cwd: '<%= config.dirs.npm %>',
                        expand: true,
                        flatten: true,
                        src: [
                            'manifesto.js/dist/manifesto.d.ts',
                            'virtex3d/dist/virtex.d.ts'
                        ],
                        dest: '<%= config.dirs.typings %>'
                    },
                    {
                        // all files that need to be copied from /node_modules to /src/extensions/uv-virtex-extension/lib post npm install
                        // todo: create a json file that lists dependencies for each extension
                        cwd: '<%= config.dirs.npm %>',
                        expand: true,
                        flatten: true,
                        src: [
                            'virtex3d/dist/virtex.js',
                            'three.js/build/three.min.js'
                        ],
                        dest: '<%= config.dirs.uvVirtexExtension %>/lib'
                    }
                ]
            }
        },

        compress: {
            zip: {
                options: {
                    mode: 'zip',
                    archive: '<%= config.dirs.dist %>/<%= config.dirs.uvVersioned %>.zip',
                    level: 9
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.dirs.build %>/',
                        src: ['**']
                    }
                ]
            },
            tar: {
                options: {
                    mode: 'tar',
                    archive: '<%= config.dirs.dist %>/<%= config.dirs.uvVersioned %>.tar'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.dirs.build %>/',
                        src: ['**']
                    }
                ]
            }
        },

        exec: {
            // concatenate and compress with r.js
            build: {
                cmd: 'node node_modules/requirejs/bin/r.js -o app.build.js' // optimize=none'
            }
        },

        replace: {

            html: {
                src: ['<%= config.dirs.build %>/app.html'],
                overwrite: true,
                replacements: [{
                    from: 'data-main="app"',
                    to: 'data-main="lib/app"'
                }]
            },
            js: {
                // replace window.DEBUG=true
                // todo: use a compiler flag when available
                src: ['<%= config.dirs.build %>/lib/app.js'],
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
                src: ['<%= config.dirs.build %>/themes/*/css/*/theme.css'],
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
                src: ['<%= config.dirs.build %>/themes/*/css/*/theme.css'],
                overwrite: true,
                replacements: [{
                    from: /\((?:'|"|)(?:.*themes\/(.*)\/img\/(.*.\w{3,}))(?:'|"|)\)/g,
                    to: '\(\'../../img/$2\'\)'
                }]
            },
            versions: {
                // replace uv version
                src: [
                    //'<%= config.dirs.examples %>/index.html',
                    //'<%= config.dirs.examples %>/noeditor.html',
                    //'<%= config.dirs.examples %>/examples.js',
                    //'<%= config.dirs.examples %>/uv.js',
                    //'<%= config.dirs.examples %>/web.config',
                    './src/lib/embed.js'
                ],
                overwrite: true,
                replacements: [{
                    from: /uv-\d+\.\d+\.\d+/g,
                    to: '<%= config.dirs.uvVersioned %>'
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
                        target: 'http://localhost:<%= global.port %>/<%= config.dirs.examples %>/'
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
        //var minify = grunt.option('minify');
        //if (minify) grunt.config.set('global.minify', '');

        grunt.task.run(
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
            'compress:tar',
            'clean:distexamples',
            'copy:distexamples'
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
