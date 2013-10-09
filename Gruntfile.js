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
        minifyOff: ''
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
                files: {
                    "src/css/styles.css": "src/css/styles.less"
                }
            },
            build: {
                options: {
                    //yuicompress: true
                },
                files: {
                  "src/css/styles.css": "src/css/styles.less"
                }
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
                    base: '<%= globalConfig.buildDir %>',
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
                        src: 'src/index.html', 
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
                        dest: '<%= globalConfig.buildDir %>/',
                        rename: function(dest, src) {

                            // get the extension name from the src string.
                            // src/extensions/extensionname/config.js
                            var extensionName = src.match(/extensions\/(.*)\/config.js/)[1];

                            return dest + extensionName + "-config.js";
                        }
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
                cmd: 'node tools/r.js -o baseUrl=src/ mainConfigFile=src/app.js name=app <%= globalConfig.minifyOff %> out=<%= globalConfig.buildDir %>/app.min.js'
            }
        },

        replace: {
            html: {
                src: ['src/app.html'],
                dest: '<%= globalConfig.buildDir %>/',
                replacements: [{ 
                    from: 'data-main="app"',
                    to: 'data-main="app.min"'
                }]
            },
            css: {
                src: ['src/css/styles.css'],
                dest: '<%= globalConfig.buildDir %>/css/',
                replacements: [{ 
                    from: /(?:'|").*modules\/(.*)\/img\/(.*)(?:'|")/g,
                    to: '\'../img/$1/$2\''
                }]
            },
            js: {
                // replace extension config paths.
                src: ['<%= globalConfig.buildDir %>/app.min.js'],
                overwrite: true,
                replacements: [{ 
                    from: /configUri:.*(?:'|")extensions\/(.*)\/config.js(?:'|")/g,
                    to: 'configUri:"$1-config.js"'
                }]
            }
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

        // grunt build --minifyOff
        var minifyOff = grunt.option('minifyOff');
        if (minifyOff) grunt.config.set('globalConfig.minifyOff', 'optimize=none');

        grunt.task.run(
            'ts:build', 
            'less:build',
            'clean:build',
            'copy:build',
            'exec:build',
            'replace:html',
            'replace:css',
            'replace:js'
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