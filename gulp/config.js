var
    gutil = require('gulp-util');

var config = {

    isProduction: gutil.env.type == 'production',

    paths: {
        src: './src',
        build: './build',

        templates: [
            './src/js/**/*.html'
        ],

        styles: [
            './src/styles/**/*.scss'
        ],

        js: [
            './src/js/**/*module*.js',
            './src/js/**/*.js'
        ],

        vendor: {

            js: [
                './bower_components/underscore/underscore.js',
                './bower_components/jquery/dist/jquery.js',
                './bower_components/angular/angular.js',
                './bower_components/angular-ui-router/release/angular-ui-router.js',
                './bower_components/a0-angular-storage/dist/angular-storage.js',
                './bower_components/angular-jwt/dist/angular-jwt.js',
                './bower_components/bootstrap/dist/js/bootstrap.js',
                './bower_components/moment/moment.js',
                './bower_components/Chart.js-2.0.0-beta/Chart.js',
                './bower_components/angular-chart.js/dist/angular-chart.js',
                './bower_components/d3/d3.js',
                './bower_components/c3/c3.js',
            ],

            css: [
                './bower_components/bootstrap/dist/css/bootstrap.css',
                './bower_components/font-awesome/css/font-awesome.css',
                './bower_components/weather-icons/css/weather-icons.css',
                './bower_components/c3/c3.css',
            ]
        }
    }
};

module.exports = config;
