var
    gulp = require('gulp'),
    config = require('../config'),
    browserSync = require('browser-sync');

gulp.task('copy', function () {
    gulp
        .src(config.paths.src + '/index.html')
        .pipe(gulp.dest(config.paths.build))
        .pipe(browserSync.stream());

    gulp
        .src([
            './bower_components/bootstrap/dist/fonts/*',
            './bower_components/font-awesome/fonts/*',
            './bower_components/weather-icons/font/*'
        ])
        .pipe(gulp.dest(config.paths.build + '/fonts/'))
        .pipe(browserSync.stream());
});
