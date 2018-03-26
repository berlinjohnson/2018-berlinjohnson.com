var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var browserify = require('gulp-browserify');
var cache = require('gulp-cache');
var process = require('child_process');
var del = require('del');
var argv = require('yargs').argv;

//SASS
gulp.task('styles', function() {
  return gulp.src('app/styles/styles.scss')
              .pipe(
                sass({ includePaths: ['node_modules'] }
              ).on('error', sass.logError))
              .pipe(gulp.dest('build/'))
              .pipe(browserSync.stream());
});

//JAVASCRIPT
gulp.task('scripts', function() {
	// Single entry point to browserify
	return gulp.src('app/scripts/main.js')
		.pipe(browserify({
		  insertGlobals : true,
		  debug : true
		}))
		.pipe(gulp.dest('build/'))
    .pipe(browserSync.stream());
});

//COPY INDEX.HTML TO BUILD DIRECTORY
gulp.task('html', function() {
    return gulp.src('app/index.html')
                .pipe(gulp.dest('build/'))
                .pipe(browserSync.stream());
});

gulp.task('images', function() {
    return gulp.src('app/images/**/*')
                .pipe(gulp.dest('build/images/'))
                .pipe(browserSync.stream());
});

gulp.task('downloads', function() {
    return gulp.src('app/downloads/*')
                .pipe(gulp.dest('build/downloads/'))
                .pipe(browserSync.stream());
});

var otherAssets = ['app/favicon.ico'];
gulp.task('otherAssets', function() {
    return gulp.src(otherAssets)
                .pipe(gulp.dest('build/'))
                .pipe(browserSync.stream());
});

gulp.task('clean', function() {
  return del.sync('build/*');
})

// DEFAULT / STATIC SERVER
gulp.task('default', ['clean', 'html', 'styles', 'scripts', 'images', 'downloads', 'otherAssets'], function() {
    browserSync.init({
        server: {
            baseDir: "./build/",
            routes: {
              "/portfolio": "./build/",
              "/resume": "./build/",
              "/portfolio/test_project/": "./build/",
              "/portfolio/firebase_branding/": "./build/",
              "/portfolio/misc/": "./build/",
              "/portfolio/firebase_branding/logo": "./build/",
              "/portfolio/firebase_branding/vertical_logo": "./build/"
            }
        },
        open: false
    });

    gulp.watch('app/*.html', ['html']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch(otherAssets, ['otherAssets']);
});
