module.exports = function (grunt) {
    
    // load the task
    grunt.loadNpmTasks("grunt-ts")

    grunt.initConfig({

        ts: {
            debug: {                          // a particular target   
                src: ["app/**/*.ts"], // The source typescript files, See : http://gruntjs.com/configuring-tasks#files                
                reference: 'app/reference.ts',
                watch: 'app',
                options: {                  // override the main options, See : http://gruntjs.com/configuring-tasks#options
                    target: 'es3',            // es3 (default) / or es5
                    module: 'amd',       // amd , commonjs (default)
                    sourcemap: true,          // true  (default) | false
                    declarations: false,       // true | false  (default)
                    nolib: false,             // true | false (default)
                    comments: false           // true | false (default)
                }
            },
            release: {                          // a particular target   
                src: ["app/**/*.ts"], // The source typescript files, See : http://gruntjs.com/configuring-tasks#files                
                out: 'app/player.js',    // If specified, generate an out.js file which is the merged js file   
                reference: 'app/reference.ts',
                watch: 'app',
                options: {                  // override the main options, See : http://gruntjs.com/configuring-tasks#options
                    target: 'es3',            // es3 (default) / or es5
                    module: 'amd',       // amd , commonjs (default)
                    sourcemap: false,          // true  (default) | false
                    declarations: false,       // true | false  (default)
                    nolib: false,             // true | false (default)
                    comments: false           // true | false (default)
                }
            }
        },
    });

    grunt.registerTask("default", ["ts:debug"]);

};