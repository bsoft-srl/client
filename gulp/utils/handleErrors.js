var
    notify = require('gulp-notify'),
    config = require('../config');

module.exports = function (error) {

    if (config.isProduction) {
        console.log(error);
        process.exit(1);
    }

    var args = [].slice.call(arguments);

    notify.onError({
        title: 'Error',
        message: '<%= error.message %>',
        icon: 'Terminal Icon'
    }).apply(this, args);

    this.emit('end');
}
