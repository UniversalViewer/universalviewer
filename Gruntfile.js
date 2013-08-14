module.exports = function (grunt) {
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-less");

    grunt.initConfig({

        ts: {
            dev: {                            
                src: ["app/**/*.ts"],          
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
            dist: {                          
                src: ["app/**/*.ts"],           
                out: 'app/main.js',           
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
                    "css/styles.css": "css/styles.less"
                }
            },
            dist: {
                options: {
                    yuicompress: true
                },
                files: {
                  "css/styles.css": "css/styles.less"
                }
            }
        }
    });

    grunt.registerTask("default", ["ts:dev", "less:dev"]);
    //grunt.registerTask("default", ["ts:dist", "less:dist"]);

};