module.exports = function (grunt) {
    
    // load the task
    grunt.loadNpmTasks("grunt-ts")

    grunt.initConfig({

        ts: {
            debug: {                            
                src: ["app/**/*.ts"],          
                reference: 'app/reference.ts',
                watch: 'app',
                options: {                      
                    target: 'es3',              
                    module: 'amd',              
                    sourcemap: true,            
                    declarations: false,        
                    nolib: false,               
                    comments: false             
                }
            },
            release: {                          
                src: ["app/**/*.ts"],           
                out: 'app/player.js',           
                reference: 'app/reference.ts',
                watch: 'app',
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
    });

    grunt.registerTask("default", ["ts:debug"]);
    //grunt.registerTask("default", ["ts:release"]);

};