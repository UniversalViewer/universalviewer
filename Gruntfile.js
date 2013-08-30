module.exports = function (grunt) {
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks('grunt-text-replace');

    var packageJson = grunt.file.readJSON("package.json"),
        buildDir = 'build/wellcomeplayer/';

    grunt.initConfig({
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
            dev: {
                options: {
                    port: 3000,
                    base: "src",
                    keepalive: true
                }
            },
            build: {
                options: {
                    port: 3001,
                    base: "build/wellcomeplayer",
                    keepalive: true
                }
            }
        },

        clean: {
            build : {
                src : [ 
                    "build/*"
                ]
            },
            min : {
                src : [ 
                    "app.min.js"
                ]
            }
        },

        copy: {
            build: {
                files: [
                    // images
                    {
                        expand: true,
                        src: ['src/modules/**/img/*'],
                        dest: buildDir + 'img/',
                        rename: function(dest, src) {

                            var fileName = src.substr(src.lastIndexOf('/'));

                            // get the module name from the src string.
                            // src/modules/modulename/img
                            var moduleName = src.match(/modules\/(.*)\/img/)[1];

                            return dest + moduleName + fileName;
                        }
                    },
                    // app.min.js
                    {
                        src: ['app.min.js'],
                        dest: buildDir
                    },
                    // index.html
                    {
                        expand: true,
                        flatten: true,
                        src: 'src/index.html', 
                        dest: buildDir
                    },
                    // js
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'src/js',
                        src: ['embed.js', 'easyXDM.min.js', 'easyxdm.swf', 'json2.min.js', 'require.js'],
                        dest: buildDir + 'js/'
                    },
                    // extension configuration files
                    {
                        expand: true,
                        flatten: true,
                        src: 'src/*.config.js', 
                        dest: buildDir
                    }
                ]
            }
        },

        exec: {
            // concatenate and compress with r.js
            build: {
                cmd: 'node tools/r.js -o tools/build.js'
            }
        },

        replace: {
            html: {
                src: ['src/app.html'],
                dest: buildDir,
                replacements: [{ 
                    from: 'data-main="app"',
                    to: 'data-main="app.min"'
                }]
            },
            css: {
                src: ['src/css/styles.css'],
                dest: buildDir + 'css/',
                replacements: [{ 
                    from: /(?:'|").*modules\/(.*)\/img\/(.*)(?:'|")/g,
                    to: '\'../img/$1/$2\''
                }]
            }
        }

    });

    grunt.registerTask("default", [
        "ts:dev",
        "less:dev"
    ]);

    grunt.registerTask("build", [
        "ts:build", 
        "less:build",
        "exec:build",
        "clean:build", 
        "copy:build", 
        "clean:min",
        "replace:html",
        "replace:css"
    ]);

};