module.exports = function(grunt) {

	'use strict';

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	var config = {
		root: '.',
		dist: './dist',
		app: './app',
		temp: './.tmp',
		toInclude: ['jQuery', 'socialmedia.js'],
		toCopy: {
			json: ['world-countries/dist/countries.json'],
			font: ['font-awesome/fonts/*'],
			animate: ['animate.css/animate.css']
		}
	};

	grunt.initConfig({
		config: config,
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			build: [
				'<%= config.temp %>',
				'<%= config.dist %>/assets/*',
				'<%= config.app %>/assets/css/*',
				'<%= config.app %>/assets/font/*',
				'<%= config.app %>/assets/js/*',
				'!<%= config.app %>/assets/js/main.js',
				'!<%= config.app %>/assets/js/modes',
				'<%= config.root %>/*.{html,txt,htacces,ico,png}'
			],
			dist: [
				'<%= config.temp %>',
				'<%= config.app %>/assets/css/*',
				'<%= config.app %>/assets/font/*',
				'<%= config.app %>/assets/js/*',
				'!<%= config.app %>/assets/js/main.js',
				'!<%= config.app %>/assets/js/modes'
			]
		},

		copy: {
			dist: {
				files: [
					{
						src: config.toCopy.json,
						cwd: '<%= config.root %>/node_modules/',
						dest: '<%= config.app %>/assets/js',
						expand: true,
						flatten: true,
						filter: 'isFile'
					},
					{
						src: config.toCopy.font,
						cwd: '<%= config.root %>/node_modules/',
						dest: '<%= config.app %>/assets/font',
						expand: true,
						flatten: true,
						filter: 'isFile'
					},
					{
						src: config.toCopy.animate,
						cwd: '<%= config.root %>/node_modules/',
						dest: '<%= config.app %>/assets/sass/components',
						ext: '.scss',
						expand: true,
						flatten: true,
						filter: 'isFile'
					}
				]
			},
			build: {
				files: [
					{
						src: config.toCopy.json,
						cwd: '<%= config.root %>/node_modules/',
						dest: '<%= config.dist %>/assets/js',
						expand: true,
						flatten: true,
						filter: 'isFile'
					},
					{
						src: config.toCopy.font,
						cwd: '<%= config.root %>/node_modules/',
						dest: '<%= config.dist %>/assets/font',
						expand: true,
						flatten: true,
						filter: 'isFile'
					},
					{
						src: config.toCopy.animate,
						cwd: '<%= config.root %>/node_modules/',
						dest: '<%= config.app %>/assets/sass/components',
						ext: '.scss',
						expand: true,
						flatten: true,
						filter: 'isFile'
					},
					{
						src: ['*.{ico,htacces,png,txt}', 'index.html'],
						cwd: '<%= config.app %>',
						dest: '<%= config.dist %>',
						expand: true,
						filter: 'isFile'
					},
					{
						src: ['modes/*'],
						cwd: '<%= config.app %>/assets/js/',
						dest: '<%= config.dist %>/assets/js/',
						expand: true,
						filter: 'isFile'
					}
				]
			}
		},

		autoprefixer: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/assets/css/',
					dest: '<%= config.app %>/assets/css/',
					src: ['{,*/}*.css']
				}]
			},
			options: {
				browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
			}
		},

		sass: {
			options: {
				loadPath: '<%= config.root %>/node_modules',
				style: 'expanded'
			},
			server: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/assets/sass',
					src: ['*.{scss,sass}'],
					dest: '<%= config.app %>/assets/css',
					ext: '.css'
				}]
			}
		},

		useminPrepare: {
			options: {
				staging: '<%= config.temp %>',
				root: '<%= config.app %>',
				dest: '<%= config.dist %>'
			},
			html: ['<%= config.app %>/index.html']
		},

		usemin: {
			options: {
				blockReplacements: {
					none: function(block) {
						return '';
					},
					remotejs: function(block) {
						return '<script src="' + block.dest + '"></script>';
					},
					remotecss: function(block) {
						return '<link rel="stylesheet" href="' + block.dest + '" />';
					}
				},
				assetsDirs: [
					'<%= config.dist %>',
					'<%= config.dist %>/assets/css',
					'<%= config.dist %>/assets/js',
					'<%= config.dist %>/assets/font',
					'<%= config.dist %>/assets/images'
				]
			},
			html: ['<%= config.dist %>/*.html'],
			css: ['<%= config.dist %>/assets/css/{,*/}*.css']
		},

		concurrent: {
			copy: ['copy:dist'],
			server: ['sass:server']
		},

		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'<%= config.dist %>/index.html': '<%= config.dist %>/index.html'
				}
			}
		},

		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/assets/images',
					src: '{,*/}*.{jpg,gif,png,jpeg,ico}',
					dest: '<%= config.dist %>/assets/images'
				}]
			}
		},

		watch: {
			sass: {
				files: [
					'<%= config.app %>/assets/sass/{,*/}*.{scss,sass}'
				],
				tasks: ['sass:server', 'autoprefixer:dist'],
				options: {
					spawn: false,
					livereload: true
				}
			},
			config: {
				files: [
					'<%= config.root %>/Gruntfile.js',
					'<%= config.root %>/package.json',
					'<%= config.root %>/bower.json'
				],
				options: {
					spawn: false,
					livereload: true
				}
			},
			script: {
				files: ['<%= config.app %>/assets/js/{,*/}*.js'],
				options: {
					spawn: false,
					livereload: true
				}
			},
			html: {
				files: ['<%= config.app %>/{,*/}*.html'],
				options: {
					livereload: 35729
				}
			}
		}
	});

	grunt.registerTask('default', [
		'concurrent:copy',
		'concurrent:server',
		'autoprefixer:dist',
		'watch'
	]);

	grunt.registerTask('build', [
		'clean:build',
		'copy:build',
		'concurrent:server',
		'useminPrepare',
		'concat',
		'uglify',
		'autoprefixer:dist',
		'cssmin',
		'usemin',
		'imagemin',
		'htmlmin:dist',
		'clean:dist'
	]);

};