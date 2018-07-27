'use strict';

module.exports = function(grunt) {

	grunt.initConfig({

		dir: {
			src: 'src',
			test: 'test',
			dist: 'dist',
			resources: 'resources'
		},

		connect: {
			options: {
				port: 8080,
				hostname: '*'
			},
			src: {},
			dist: {}
		},

		openui5_connect: {
			src: {
				options: {
					resources: [
						'<%= dir.resources %>',
						'<%= dir.src %>'
					],
					testresources: [
						'<%= dir.test %>'
					]
				}
			},
			dist: {
				options: {
					resources: [
						'<%= dir.resources %>',
						'<%= dir.dist %>/resources'
					],
					testresources: [
						'<%= dir.dist %>/test-resources'
					]
				}
			}
		},

		openui5_preload: {
			component: {
				options: {
					resources: '<%= dir.test %>',
					dest: '<%= dir.dist %>/test-resources'
				},
				components: true
			}
		},

		clean: {
			dist: '<%= dir.dist %>/'
		},

		copy: {
			dist: {
				files: [ {
					expand: true,
					cwd: '<%= dir.src %>',
					src: [
						'**'
					],
					dest: '<%= dir.dist %>/resources'
				}, {
					expand: true,
					cwd: '<%= dir.test %>',
					src: [
						'**'
					],
					dest: '<%= dir.dist %>/test-resources'
				} ]
			}
		},

		eslint: {
			src: ['<%= dir.src %>'],
			test: ['<%= dir.test %>'],
			gruntfile: ['Gruntfile.js']
		}

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-openui5');
	grunt.loadNpmTasks('grunt-eslint');

	// Server task
	grunt.registerTask('serve', function(target) {
		grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
	});

	// Linting task
	grunt.registerTask('lint', ['eslint']);

	// Build task
	grunt.registerTask('build', ['openui5_preload', 'copy']);

	// Default task
	grunt.registerTask('default', [
		'lint',
		'clean',
		'build',
		'serve:dist'
	]);
};
