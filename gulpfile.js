var gulp = require('gulp'),
    gutil = require('gulp-util');
sass = require('gulp-sass');
uglify = require('gulp-uglify-es').default;
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var devip = require('dev-ip');
var wait = require('gulp-wait');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var production = !!gutil.env.production;
var path = require('path'),
    folders = require('gulp-folders'),
    pathToFolder = 'src/js';

var proxyStr = 'http://localhost:8080/project_school_beveiliging/';

// json object to specify folders and files it watches
var srcs = {
        scss: 'src/scss/*.scss'
    },
    dests = {
        css: 'dest/css/',
        cssmin: 'dest/css/',
        js: 'dest/js/'
    },
    buildwatch = {
        scss: ['src/scss/**/*.scss', 'src/scss/components/**/*.scss'],
        js: 'src/js/**/*.js'
    },
    watchs = {
        scss: 'dest/css/**/*.css',
        js: 'dest/js/**/*.js',
        php: ['**/*.php', '**/*.html'],
        images: ['img/*.png', 'img/*.gif', 'img/*.jpg', 'img/*.svg']
    },
    autoprefixerOptions = {
        browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    };

function onError(err) {
    console.log(err);
    this.emit('end');
}

// // Build JS
gulp.task(
    'build-js',
    folders(pathToFolder, function(folder) {
        return gulp
            .src(path.join(pathToFolder, folder, '*.js'))
            .pipe(sourcemaps.init())
            .pipe(concat(folder + '.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(dests.js))
            .pipe(browserSync.reload({ stream: true }))
            .pipe(
                production === true
                    ? rename({ extname: '.min.js' })
                    : gutil.noop()
            )
            .on('error', onError)
            .pipe(
                production === true
                    ? uglify().on('error', gutil.log)
                    : gutil.noop()
            )
            .on('error', onError)
            .pipe(gulp.dest(dests.js))
            .pipe(browserSync.reload({ stream: true }));
    })
);
gulp.task('build-css', function() {
    return gulp
        .src(srcs.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', handleError)
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dests.css))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(
            production === true ? rename({ extname: '.min.css' }) : gutil.noop()
        )
        .pipe(production === true ? cleanCSS({ level: 2 }) : gutil.noop())
        .pipe(gulp.dest(dests.cssmin))
        .pipe(browserSync.reload({ stream: true }));
});
gulp.task('build-css-timeout', function() {
    return gulp
        .src(srcs.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', handleError)
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write())
        .pipe(wait(2500))
        .pipe(gulp.dest(dests.css))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(
            production === true ? rename({ extname: '.min.css' }) : gutil.noop()
        )
        .pipe(production === true ? cleanCSS({ level: 2 }) : gutil.noop())
        .pipe(gulp.dest(dests.cssmin))
        .pipe(browserSync.reload({ stream: true }));
});
gulp.task('reload-img', function() {
    return gulp.src(watchs.images).pipe(browserSync.reload({ stream: true }));
});

// Handle errors
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('watch', function() {
    browserSync.init({
        proxy: proxyStr,
        online: false,
        notify: true,
        host: devip()
    });
    gulp.watch(buildwatch.scss, ['build-css']);
    gulp.watch(buildwatch.js, ['build-js']);
    gulp.watch(watchs.images, ['reload-img']);
    gulp.watch(watchs.php).on('change', browserSync.reload);
    gulp.watch(watchs.php, ['build-css-timeout']);
});

gulp.task('default', ['watch'], browserSync.reload);
