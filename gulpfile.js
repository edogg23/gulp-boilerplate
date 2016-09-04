'use strict';

const gulp = require('gulp'),                       // https://www.npmjs.com/package/gulp
    util = require('gulp-util'),                    // https://www.npmjs.com/package/gulp-util
    // rename = require("gulp-rename"),             // https://www.npmjs.com/package/gulp-rename
    concat = require('gulp-concat'),                // https://www.npmjs.com/package/gulp-concat
    sass = require('gulp-sass'),                    // https://www.npmjs.com/package/gulp-sass
    sassGlob = require('gulp-sass-glob'),           // https://www.npmjs.com/package/gulp-sass-glob
    del = require('del'),                           // https://www.npmjs.com/package/del
    sourcemaps = require('gulp-sourcemaps'),        // https://www.npmjs.com/package/gulp-sourcemaps
    autoprefixer = require('gulp-autoprefixer'),    // https://www.npmjs.com/package/gulp-autoprefixer
    uglifyjs = require('gulp-uglify'),              // https://www.npmjs.com/package/gulp-uglify
    uglifycss = require('gulp-uglifycss'),          // https://www.npmjs.com/package/gulp-uglifycss
    livereload = require('gulp-livereload'),        // https://www.npmjs.com/package/gulp-livereload
    // filter = require('gulp-filter'),             // https://www.npmjs.com/package/gulp-filter
    bower = require('gulp-bower'),                  // https://www.npmjs.com/package/gulp-bower
    // bowerFiles = require('main-bower-files'),    // https://www.npmjs.com/package/main-bower-files
    // ngAnnotate = require('gulp-ng-annotate'),    // https://www.npmjs.com/package/gulp-ng-annotate
    notify = require("gulp-notify");                // https://www.npmjs.com/package/gulp-notify

/*
 * Enable production by passing --production to the gulp command
 *
 * Example: `gulp build --production`
 */
var production = !!util.env.production;

/** Begin CSS **/

gulp.task('clean-css', function() {
    return del([
        'css/style.css',
        'css/style.css.map'
    ], {
        force: true
    });
});

// Build everything in the scss directory
gulp.task('build-scss', function() {
    return gulp.src(['scss/style.scss'])
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass().on('error', notify.onError('<%= error.message %>')))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(sourcemaps.write()) // write to same directory where CSS will live (allows for the proper reference to Sourcemap in CSS file!)
        .pipe(production ? uglifycss() : util.noop())
        .pipe(gulp.dest('css'))
        .pipe(livereload());
});

/** End CSS **/

/** Begin JS **/

// Uglify custom JS files
gulp.task('minify-custom-js', function() {
    return gulp.src('js/functions.js')
        .pipe(uglifyjs())
        .pipe(concat('functions.min.js'))
        .pipe(gulp.dest('js'));
});

gulp.task('clean-js', function() {
    return del([
        'js/functions.min.js',
        // Add additional generated JS files here!
    ], {
        force: true
    });
});

/** End JS **/

/** Begin Simplified Tasks **/

// Clean Bower and generated CSS
gulp.task('clean', ['clean-css', 'clean-js']);
gulp.task('build-css', ['build-scss']);
gulp.task('build', ['minify-custom-js', 'build-css']);

/** End Simplified Tasks **/

/** Begin Watch/Default Tasks **/

// watch sass files, js, and templates
gulp.task('watch', ['build'], function() {
    livereload.listen();
    gulp.watch('scss/**/*.scss', ['build-css']);
    // Watch JS and PHP template files...do a full reload if changed
    // gulp.watch([
    //     'js/**/*.js'
    // ]).on('change', function (file) {
    //     livereload.changed(file.path);
    //     util.log(util.colors.yellow('Javascript changed' + ' (' + file.path + ')'));
    //     gulp.start('minify-custom-js');
    // });
    // gulp.watch([
    //     '*.php',
    //     'includes/**/*.php'
    // ]).on('change', function (file) {
    //     livereload.changed(file.path);
    //     util.log(util.colors.yellow('Template changed' + ' (' + file.path + ')'));
    // });
});

gulp.task('default', ['clean', 'watch']);

/** End Watch/Default Tasks **/