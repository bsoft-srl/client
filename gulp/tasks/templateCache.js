var
    gulp = require('gulp'),
    templateCache = require('gulp-angular-templatecache'),
    config = require('../config');

gulp.task('templateCache', function () {
    return gulp.src(config.paths.templates)
        .pipe(templateCache({
            standalone: true,
            moduleSystem: 'IIFE'
        }))
        .pipe(gulp.dest(config.paths.src + '/js'));
});
