module.exports = function (grunt) {

    var packageJson = grunt.file.readJSON("package.json"),
        packageDirName = 'wellcomeplayer-' + packageJson.version;

    grunt.initConfig({
        global:
        {
            buildDir: 'build/wellcomeplayer',
            minify: 'optimize=none',
            packageDirName: packageDirName,
            packageDir: 'build/' + packageDirName,
            examplesDir: 'examples',
            theme: 'coreplayer-default-theme'
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
            build : ["<%= global.buildDir %>/*"],
            package: ['<%= global.packageDir %>'],
            examples: ['<%= global.examplesDir %>/<%= global.buildDir %>']
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

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-extend");

    grunt.registerTask("default", '', function(){

        grunt.task.run(
            'ts:dev',
            'replace:dependenciesSimplify',
            'extend:config',
            'less:dev'
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

        grunt.task.run(
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

};
