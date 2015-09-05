module.exports = function(grunt) {

	'use strict';

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	var config = {
		root: '.',
		app: './app',
		dist: './dist',
		toInclude: ['jQuery', 'socialmedia.js'],
		toCopy: {
			json: ['world-countries/dist/countries.json'],
			js: ['jquery/dist/jquery.js', 'socialmedia/dist/socialmedia.js'],
			font: ['font-awesome/fonts/*'],
			animate: ['animate.css/animate.css']
		}
	};

	grunt.initConfig({
		config: config,
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			dist: {
				files: [
					{
						src: config.toCopy.json,
						cwd: '<%= config.root %>/bower_components/',
						dest: '<%= config.app %>/assets/js',
						expand: true,
						flatten: true,
						filter: 'isFile'
					},
					{
						src: config.toCopy.font,
						cwd: '<%= config.root %>/bower_components/',
						dest: '<%= config.app %>/assets/font',
						expand: true,
						flatten: true,
						filter: 'isFile'
					},
					{
						src: config.toCopy.animate,
						cwd: '<%= config.root %>/bower_components/',
						dest: '<%= config.app %>/assets/sass/components',
						ext: '.scss',
						expand: true,
						flatten: true,
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
				loadPath: '<%= config.root %>/bower_components',
				style: 'expanded',
				sourcemap: 'none'
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

		cssmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/assets/css',
					src: ['*.css'],
					dest: '<%= config.app %>/assets/css',
					ext: '.min.css'
				}],
				options: {
					sourceMap: true,
					banner: '/*! <%= pkg.name %> | v<%= pkg.version %> | <%= pkg.author %> | <%= pkg.homepage %> | <%= pkg.license %> */ \n'
				}
			}
		},

		uglify: {
			dist: {
				options: {
					banner: '/*! <%= pkg.name %> | v<%= pkg.version %> | <%= pkg.author %> | <%= pkg.homepage %> | <%= pkg.license %> */ \n',
					preserveComments: 'some',
					sourceMap: true
				},
				files: {
					'<%= config.app %>/assets/js/main.min.js':'<%= config.app %>/assets/js/main.js'
				}
			},
			vendor: {
				options: {
					banner: '/*! <%= pkg.name %> | v<%= pkg.version %> | ' + config.toInclude.join(', ') + ' */ \n',
					preserveComments: 'none',
					sourceMap: true
				},
				files: {
					'<%= config.app %>/assets/js/vendor.min.js':'<%= config.app %>/assets/js/vendor.js'
				}
			}
		},

		concat: {
			options: {
				separator: ';\n'
			},
			vendor: {
				dest: '<%= config.app %>/assets/js/vendor.js',
				src: (function()	{
					var cwd = config.root + '/bower_components/',
						files = config.toCopy.js;

					return files.map(function(file) {
						return (cwd + file);
					});
				})()
			}
		},

		concurrent: {
			copy: ['copy:dist'],
			concat: ['concat:vendor'],
			server: ['sass:server']
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
				files: ['<%= config.app %>/{,*/}*.{html}'],
				options: {
					livereload: 35729
				}
			}
		}
	});

	grunt.registerTask('default', [
		'concurrent:copy',
		'concurrent:concat',
		'concurrent:server',
		'autoprefixer:dist',
		'watch'
	]);

	grunt.registerTask('build', [
		'concurrent:copy',
		'concurrent:concat',
		'concurrent:server',
		'autoprefixer:dist',
		'cssmin:dist',
		'uglify',
		'watch'
	]);

};