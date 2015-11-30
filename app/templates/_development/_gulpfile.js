var gulp = require('gulp');
var noprotocol = require('gulp-noprotocol');
var livereload = require('gulp-livereload');

gulp.task('css', function () {
    return gulp.src('resources/sass/**/*.{scss,sass}')
        .pipe(noprotocol.css())
        .on('error', noprotocol.notify)
        .pipe(gulp.dest('public/build/css'));
});

gulp.task('bundle-libs', function () {
    return gulp.src([
        //'node_modules/jquery/dist/jquery.min.js'
    ])
        .pipe(noprotocol.bundle('libs.min.js'))
        .on('error', noprotocol.notify)
        .pipe(gulp.dest('public/build/js'));
});

gulp.task('bundle-app', function () {
    return gulp
        .src(['resources/js/**/*.js'])
        .on('error', noprotocol.notify)
        .pipe(noprotocol.bundle('app.min.js'))
        .pipe(gulp.dest('public/build/js'));
});

gulp.task('watch', ['css', 'bundle-app', 'bundle-libs'], function () {

    livereload.listen();
    gulp.watch(['resources/sass/**/*.{scss,sass}'], ['css']);
    gulp.watch(['resources/js/**/*.js'], ['bundle-app']);
    gulp.watch([
        'public/build/**/*.css',
        'public/build/**/*.js',
    ]).on('change', livereload.changed);
    gulp.watch(['gulpfile.js'], function () {
        noprotocol.notify('Stopping `gulp watch`, gulpfile.js was changed');
        process.exit();
    });
});

gulp.task('deploy', ['css', 'bundle-app', 'bundle-libs']);

gulp.task('default', ['watch']);