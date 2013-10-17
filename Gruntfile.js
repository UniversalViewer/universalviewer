module.exports = function (grunt) {
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks("grunt-contrib-compress");

    var packageJson = grunt.file.readJSON("package.json");

    var packageDirName = 'wellcomeplayer-' + packageJson.version,
        packageDir = 'build/' + packageDirName;

    var globalConfig = {
        buildDir: 'build/wellcomeplayer',
        minify: 'optimize=none'
    };

    grunt.initConfig({        
        globalConfig: globalConfig,
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

        connect: {
            debug: {
                options: {
                    port: 3000,
                    base: "src",
                    keepalive: true
                }
            },
            release: {
                options: {
                    port: 3001,
                    base: "<%= globalConfig.buildDir %>",
                    keepalive: true
                }
            }
        },

        clean: {
            build : ["<%= globalConfig.buildDir %>/*"],
            package: [packageDir]
        },

        copy: {
            build: {
                files: [
                    // images
                    {
                        expand: true,
                        src: ['src/modules/**/img/*'],
                        dest: '<%= globalConfig.buildDir %>/img/',
                        rename: function(dest, src) {

                            var fileName = src.substr(src.lastIndexOf('/'));

                            // get the module name from the src string.
                            // src/modules/modulename/img
                            var moduleName = src.match(/modules\/(.*)\/img/)[1];

                            return dest + moduleName + fileName;
                        }
                    },
                    // index.html
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'src',
                        src: ['index.html', 'app.html'], 
                        dest: '<%= globalConfig.buildDir %>'
                    },
                    // js
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'src/js',
                        src: ['embed.js', 'easyXDM.min.js', 'easyxdm.swf', 'json2.min.js', 'require.js'],
                        dest: '<%= globalConfig.buildDir %>/js/'
                    },
                    // extension configuration files
                    {
                        expand: true,
                        src: ['src/extensions/**/config.js'], 
                        dest: '<%= globalConfig.buildDir %>/js/',
                        rename: function(dest, src) {

                            // get the extension name from the src string.
                            // src/extensions/extensionname/config.js
                            var extensionName = src.match(/extensions\/(.*)\/config.js/)[1];

                            return dest + extensionName + "-config.js";
                        }
                    },
                    // extensions css
                    {
                        expand: true,
                        src: ['src/extensions/**/css/*.css'], 
                        dest: '<%= globalConfig.buildDir %>/css/',
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
                        dest: '<%= globalConfig.buildDir %>/js/'
                    }
                ]
            },
            package: {
                // copy contents of /build to packageDir.
                files: [
                    {
                        cwd: '<%= globalConfig.buildDir %>',
                        expand: true,
                        src: ['**'],
                        dest: packageDir
                    }
                ]
            }
        },

        compress: {
            zip: {
                options: {
                    archive: "build/releases/" + packageDirName + ".zip",
                    level: 9
                },
                files: [
                    { 
                        expand: true, 
                        cwd: "build/", 
                        src: [ packageDirName + "/**" ]
                    }
                ]
            },
            tar: {
                options: {
                    archive: "build/releases/" + packageDirName + ".tar.gz",
                    level: 9
                },
                files: [
                    { 
                        expand: true,
                        cwd: "build/",
                        src: [ packageDirName + "/**" ]
                    }
                ]
            }
        },

        exec: {
            // concatenate and compress with r.js
            build: {
                cmd: 'node tools/r.js -o baseUrl=src/ mainConfigFile=src/app.js name=app <%= globalConfig.minify %> out=<%= globalConfig.buildDir %>/js/app.js'
            }
        },

        replace: {
            img: {
                // replace img srcs to point to ../img/modulename/imgname
                src: ['<%= globalConfig.buildDir %>/css/*.css'],
                overwrite: true,
                replacements: [{ 
                    from: /(?:'|").*modules\/(.*)\/img\/(.*)(?:'|")/g,
                    to: '\'../img/$1/$2\''
                }]
            },
            config: {
                // replace extension config paths.
                src: ['<%= globalConfig.buildDir %>/js/app.js'],
                overwrite: true,
                replacements: [{ 
                    from: /config:.*(?:'|")extensions\/(.*)\/config.js(?:'|")/g,
                    to: 'config:"js/$1-config.js"'
                }]
            },
            css: {
                // replace css paths.
                src: ['<%= globalConfig.buildDir %>/js/app.js'],
                overwrite: true,
                replacements: [{ 
                    from: /css:.*(?:'|")extensions\/(.*)\/css\/styles.css(?:'|")/g,
                    to: 'css:"css/$1.css"'
                }]
            },
            html: {
                src: ['<%= globalConfig.buildDir %>/app.html'],
                overwrite: true,
                replacements: [{ 
                    from: 'data-main="app"',
                    to: 'data-main="js/app"'
                }]
            },
        }

    });

    grunt.registerTask("default", [
        "ts:dev",
        "less:dev"
    ]);

    grunt.registerTask('build', '', function() {
      
        // grunt build --buildDir=myDir
        // or prepend / to target relative to system root.
        var buildDir = grunt.option('buildDir');
        if (buildDir) grunt.config.set('globalConfig.buildDir', buildDir);

        // grunt build --minify
        var minify = grunt.option('minify');
        if (minify) grunt.config.set('globalConfig.minify', '');

        grunt.task.run(
            'ts:build', 
            'less:build',
            'clean:build',
            'copy:build',
            'exec:build',
            'replace:img',
            'replace:config',
            'replace:css',
            'replace:html'
        );
    });

    grunt.registerTask('package', '', function() {
      
        // grunt build --buildDir=myDir
        // or prepend / to target relative to system root.
        var buildDir = grunt.option('buildDir');
        if (buildDir) grunt.config.set('globalConfig.buildDir', buildDir);

        grunt.task.run(
            'build', 
            'copy:package', 
            'compress',
            'clean:package'
        );
    });

};