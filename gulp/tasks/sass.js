var
    gulp = require('gulp'),
    config = require('../config'),
    handleErrors = require('../utils/handleErrors'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync');

gulp.task('sass', function () {
    return gulp.src(config.paths.styles)
        .pipe(!config.isProduction ? sourcemaps.init() : gutil.noop())
        .pipe(sass({
            outputStyle: config.isProduction ? 'compressed' : 'nested',
            precision: 8
        }))
        .on('error', handleErrors)
        .pipe(autoprefixer("last 3 versions", "> 1%", "ie 8"))
        .pipe(!config.isProduction ? sourcemaps.write() : gutil.noop())
        .pipe(gulp.dest(config.paths.build + '/css'))
        .pipe(browserSync.active ? browserSync.stream() : gutil.noop());
});
