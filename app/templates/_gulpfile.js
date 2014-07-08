var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');


gulp.task('sass', function () {
    return gulp.src('public/sass/**/*.{scss,sass}')
        .pipe(sass({
            errLogToConsole: true, 
            // sourceComments: 'map'  -- Broken in current version of nodejs/libsass
        }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('watch', ['sass'], function () {
    gulp.watch('public/sass/**/*.{scss,sass}', ['sass']);

    livereload.listen();
    var globs = [
        'public/css/*.css',
        'public/js/**/*.js',
        'public/views/**/*.html',
        'app/views/**/*.php'
    ];
    gulp.watch(globs).on('change', livereload.changed);
});

gulp.task('deploy', ['sass']);

gulp.task('default', ['watch']);