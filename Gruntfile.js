module.exports = function (grunt) {
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-exec");

    var packageJson = grunt.file.readJSON("package.json");

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
                    yuicompress: true
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
            build: ["build"]
        },

        copy: {
            images: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'src/',
                        src: ['**/*.png', '**/*.gif', '**/*.jpg'],
                        dest: 'build/wellcomeplayer/images/'
                    }
                ]
            },
            js: {
                files: [
                    {
                        src: ['app.min.js'],
                        dest: 'build/wellcomeplayer/'
                    }
                ]
            }

            // ,
            // build: {
            //     files: [
            //         {
            //             expand: true,
            //             cwd: 'src/',
                        
            //             //src: ['**', '!**/*.less', '!**/*.ts', '!**/modules/**/css', '!**/*.js.map', '**/*.min.js.map'],
            //             dest: 'build/wellcomeplayer/'
            //         }
            //     ]
            // }

            
        },

        exec: {
            build: {
                cmd: 'node tools/r.js -o tools/build.js'
            }
        }

    });

    // ----------
    // default task.
    // compiles ts and less files with source maps.
    grunt.registerTask("default", [
        "ts:dev",
        "less:dev"
    ]);

    // ----------
    // build task.
    // cleans out the build folder and builds the javascript, images and css into it.
    grunt.registerTask("build", [
        "ts:build", 
        "less:build",
        "exec:build",
        "clean:build", 
        "copy:images", 
        "copy:js"
    ]);


    // tools> node r.js -o build.js
};