var gulp        = require('gulp');
var sass        = require('gulp-sass');
var watch       = require('gulp-watch');
var connect     = require('gulp-connect');
var opn         = require('opn');
let cleanCSS    = require('gulp-clean-css');
let sourcemaps  = require('gulp-sourcemaps');
var rename      = require("gulp-rename");
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');

var sourcePaths = {
  styles: ['src/styles/**/*.scss'],
  html: ['src/**/*.html'],
  js: ['src/js/*.js']
};

var destPaths = {
  styles: 'dist/css',
  html: 'dist',
  js: 'dist/js'
};

var server = {
  host: 'localhost',
  port: '8080'
}


gulp.task('watch', function() {
  gulp.watch('src/styles/**/*.scss',['styles']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/js/**/*.js', ['js']);
});

gulp.task('styles', function() {
  gulp.src(sourcePaths.styles)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(destPaths.styles))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destPaths.styles))
    .pipe(connect.reload());
});

gulp.task('html', function () {
  gulp.src(sourcePaths.html)
    .pipe(gulp.dest(destPaths.html))
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src(sourcePaths.js)
    .pipe(sourcemaps.init())
    .pipe(concat('index.js'))
    .pipe(gulp.dest(destPaths.js))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(destPaths.js))
    .pipe(connect.reload());
});

gulp.task('openbrowser', function() {
  opn( 'http://' + server.host + ':' + server.port );
});

gulp.task('webserver', ['watch'], function () {
  connect.server({
    root: 'dist',
    port: server.port,
    base: server.host,
    livereload: true,
  });
});

gulp.task('build', ['styles', 'html', 'js']);

gulp.task('default', ['build', 'webserver', 'watch', 'openbrowser']);
