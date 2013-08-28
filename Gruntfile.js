module.exports = function (grunt) {
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-connect");

    grunt.initConfig({

        ts: {
            dev: {                            
                src: ["src/**/*.ts"],          
                //reference: 'app/reference.ts',
                //watch: 'app',
                options: {                      
                    target: 'es3',              
                    module: 'amd',              
                    sourcemap: true,            
                    declarations: false,        
                    nolib: false,               
                    comments: false             
                }
            },
            build: {                          
                src: ["src/**/*.ts"],      
                //reference: 'app/reference.ts',
                //watch: 'app',
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
                    port: 3000,
                    base: "build",
                    keepalive: true
                }
            }
        }

    });

    grunt.registerTask("default", ["ts:dev", "less:dev"]);

    //grunt.registerTask("build", ["ts:build", "less:build"]);

};