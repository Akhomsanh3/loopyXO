var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var babel = require("gulp-babel");

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp
        .src('index.js')
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .on('error', function (err) {
            console.log(err.toString());
        })
        .pipe(gulp.dest('./build'));
});


// create a task that ensures the `js` task is complete before reloading
// browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('generate-service-worker', function (callback) {
    var path = require('path');
    var swPrecache = require('sw-precache');

    swPrecache.write(`service-worker.js`, {
        staticFileGlobs: [
            '*.{html,css}', 'build/*.js', 'js/*.js'
        ],
        handleFetch: false,
        cacheId: 'foreverTTT',
        verbose: true
    }, callback);
});

// use default task to launch Browsersync and watch JS files
gulp.task('default', ['generate-service-worker'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    // add browserSync.reload to the tasks array to make all browsers reload after
    // tasks are complete.
    gulp.watch("index.js", ['js-watch']);
});