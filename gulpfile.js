// todo: in the process of migrating to gulp. continue using grunt for now

var gulp = require('gulp');
var ts = require('gulp-typescript');
var c = require('./config');
var config = new c();

gulp.task('build:dev', function() {
    return gulp.src(config.typescript.dev.src)
        .pipe(ts(config.typescript.dev.options));
});