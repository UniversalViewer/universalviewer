// Karma configuration
// Generated on Fri Oct 03 2014 12:15:14 GMT+0100 (GMT Daylight Time)

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: './',

        // frameworks to use
        frameworks : ["cucumberjs"],

        // list of files / patterns to load in the browser
        files: [
            {pattern: 'lib/*.css', watched: false, included: false, served: true},
            {pattern: 'app.template', watched: false, included: false, served: true},
            {pattern: 'tests/features/**/*.feature', watched: true, included: false, served: true},
            {pattern: 'tests/features/step_definitions/**/*.js', watched: true, included: true, served: true}
        ],

        plugins: ["karma-*", require("./lib/index")],

        // list of files to exclude
        exclude: [

        ],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress', 'coverage'],

        preprocessors: {
            "**/src/*.js": "coverage"
        },

        // web server port
        port: 8002,

        proxies:{
            '/examples': 'http://localhost:8001/examples',
            '/src': 'http://localhost:8001/src',
            '/build': 'http://localhost:8001/build'
        },

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
