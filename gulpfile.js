const gulp = require('gulp');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const phpServer = require('gulp-connect-php')
const browserSync = require('browser-sync').create();

let paths = {
    style:{
        src:"./scss/**/style.scss",
        dest:"./dist/css"
    },
    script:{
        src:"./js/**/*.js",
        dest:"./dist/js"
    }
};

function styles(){
    let plugins = {
        autoprefixer,
        cssnano
    }
    gulp.src(paths.style.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error',sass.logError)
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.style.dest))
    .pipe(browserSync.stream())
}

function scripts(){
    gulp.src(paths.script.src)
    .pipe(sourcemaps.init())
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.script.dest))
    .pipe(browserSync.stream())
}

function watch(){
    phpServer.server({
        port: 8000,
        keepalive: true,
        base: './'
    },function(){
        browserSync.init({
            proxy: '127.0.0.1:8000'
        })
    })

    gulp.watch("./**/*.php",gulp.series(browserSync.reload));
    gulp.watch(paths.style.src).on('change',gulp.series(styles,browserSync.reload));
    gulp.watch(paths.script.src).on('change',gulp.series(scripts,browserSync.reload));
}

exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;

let build = gulp.parallel(watch,styles,scripts);

exports.default = build;