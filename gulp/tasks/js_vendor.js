var
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    gutil = require('gulp-util'),
    config = require('../config');

gulp.task('js-vendor', function () {
    return gulp
        .src([].concat(config.paths.vendor.js))
        .pipe(concat('base.js'))
        .pipe(config.isProduction ? uglify() : gutil.noop())
        .pipe(gulp.dest(config.paths.build));
});
