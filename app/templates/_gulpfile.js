var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');


gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.{scss,sass}')
        .pipe(sass({
            errLogToConsole: true, 
            sourceComments: 'map'
        }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('watch', ['sass'], function () {
    gulp.watch('app/public/sass/**/*.{scss,sass}', ['sass']);

    var server = livereload();
    var globs = [
        'public/css/*.css',
        'public/js/**/*.js',
        'public/views/**/*.html',
        'app/views/**/*.php'
    ];
    gulp.watch(globs).on('change', function (file) {
        server.changed(file.path);
	});
});

gulp.task('deploy', ['sass']);

gulp.task('default', ['watch']);