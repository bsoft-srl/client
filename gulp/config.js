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
                './bower_components/jquery-ui/jquery-ui.js',
                './bower_components/angular/angular.js',
                './bower_components/angular-ui-router/release/angular-ui-router.js',
                './bower_components/a0-angular-storage/dist/angular-storage.js',
                './bower_components/angular-jwt/dist/angular-jwt.js',
                './bower_components/bootstrap/dist/js/bootstrap.js',
                './bower_components/moment/moment.js',
                './bower_components/canvasjs-1.8.0-beta2/canvasjs.min.js',
                './bower_components/leaflet/leaflet.js',
                './bower_components/jquery.dataTables.min.js',
                './bower_components/angular-datatables/dist/angular-datatables.js',
                './bower_components/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.min.js'
            ],

            css: [
                //'./bower_components/jquery-ui/jquery-ui.css',
                './bower_components/bootstrap/dist/css/bootstrap.css',
                './bower_components/font-awesome/css/font-awesome.css',
                './bower_components/weather-icons/css/weather-icons.css',
                './bower_components/leaflet/leaflet.css',
                //'./bower_components/jquery.dataTables.min.css',
                './bower_components/angular-datatables/dist/plugins/bootstrap/datatables.bootstrap.css'
            ]
        }
    }
};

module.exports = config;
