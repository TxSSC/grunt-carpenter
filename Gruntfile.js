/*
 * grunt-carpenter
 * https://github.com/TxSSC/grunt-carpenter
 *
 * Copyright (c) 2013 Cody Stoltman
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  /**
   * Grunt configuration
   */

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tests: ['tmp']
    },

    nodeunit: {
      tests: ['test/index.js']
    },

    carpenter: {
      base: {
        options: {
          templatePath: "test/fixtures/templates"
        },
        files: [
          {
            expand: true,
            cwd: 'test/fixtures/',
            src: ['content/**/*.md', 'content/**/*.html'],
            dest: 'tmp',
          }
        ]
      }
    }
  });

  // Load tasks
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Define tasks
  grunt.registerTask('test', ['clean', 'carpenter', 'nodeunit']);
  grunt.registerTask('default', ['jshint', 'test']);
};