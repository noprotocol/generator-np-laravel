module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// project configuration
	grunt.initConfig({
		watch: {
			compass: {
				files: ['public/scss/{,*/}*.{scss,sass}'],
				tasks: ['compass:development']
			},
			scripts: {
				files: ['js/{,*/}*.js']
			},
			views: {
				files: ['index.html', 'views/{,*/}*.{html}'],
			},
			options: {
				livereload: true
			}
		},
		compass: {
			options: {
				relativeAssets: true,
				sassDir: 'public/scss',
				cssDir: 'public/css',
				imagesDir: 'img',
				javascriptsDir: 'js',
				fontsDir: 'fonts'
			},
			development: {
				options: {
					debugInfo: true
				}
			},
			production: {
				options: {
					environment: 'production',
					outputStyle: 'compressed'
				}
			}
		},
		copy: {
			build: {
				files: [{
					src: ['index.html', 'js/**', 'libs/**', 'img/**', 'css/**', 'videos/**', 'fonts/**'],
					dest: 'build/'
				}]
			}
		}
	});

	grunt.registerTask('default', [
		'compass:development',
		'watch'
	]);

	grunt.registerTask('deploy', [
		'compass:production',
	]);

	grunt.registerTask('build', [
		'compass:production',
		'copy'
	]);

};
