var
    gulp = require('gulp'),
    config = require('../config');

gulp.task('watch', ['browserSync'], function () {
    gulp.watch(config.paths.styles, ['sass']);
    gulp.watch(config.paths.js, ['js']);
    gulp.watch(config.paths.templates, ['templateCache']);
    gulp.watch(config.paths.src + '/index.html', ['copy']);
});
