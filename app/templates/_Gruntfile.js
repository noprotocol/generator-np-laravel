module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({
		watch: {
			styles: {
				files: ['public/scss/{,*/}*.scss'],
				tasks: ['compass:development']
			},
			scripts: {
				files: ['js/**/*.js']
			},
			views: {
				files: ['app/views/**/*.php', 'public/views/**/*.html']
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
		}
	});

	grunt.registerTask('default', [
		'compass:development',
		'watch'
	]);

	grunt.registerTask('deploy', [
		'compass:production'
	]);

};
