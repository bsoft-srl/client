var
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    gutil = require('gulp-util'),
    config = require('../config');

gulp.task('js', function () {
    return gulp
        .src([].concat(config.paths.js))
        .pipe(!config.isProduction ? sourcemaps.init() : gutil.noop())
        .pipe(concat('app.js'))
        .pipe(config.isProduction ? uglify() : gutil.noop())
        .pipe(!config.isProduction ? sourcemaps.write() : gutil.noop())
        .pipe(gulp.dest(config.paths.build))
        .pipe(browserSync.active ? browserSync.stream({once: true}) : gutil.noop());
});
