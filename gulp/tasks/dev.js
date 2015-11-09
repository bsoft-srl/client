var
  gulp = require('gulp'),
  runSeq = require('run-sequence');

gulp.task('dev', function (cb) {
  runSeq(
    'templateCache',
    ['sass', 'js', 'js-vendor', 'css-vendor', 'copy'],
    'watch'
  );
});
