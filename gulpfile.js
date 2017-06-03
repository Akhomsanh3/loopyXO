var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var babel = require("gulp-babel");

gulp.task('js', function () {
    return gulp
        .src('index.js')
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .on('error', function (err) {
            console.log(err.toString());
        })
        .pipe(gulp.dest('./build/'));
});

gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('generate-service-worker', ['js'], function (callback) {
    var path = require('path');
    var swPrecache = require('sw-precache');

    swPrecache.write(`service-worker.js`, {
        staticFileGlobs: [
            '*.{html,css}', 'build/*.js', 'js/*.js'
        ],
        cacheId: 'loopy-XO',
        runtimeCaching: [
            {
                urlPattern: /analytics.js$/g,
                handler: 'cacheFirst'
            }
        ],
        // handleFetch:false,
        skipWaiting:true
    }, callback);
});

gulp.task('default', ['generate-service-worker'], function () {

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("index.js", ['js-watch']);
});