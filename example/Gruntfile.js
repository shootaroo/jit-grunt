'use strict';
module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('../jit-grunt')(grunt, {
    custom3: 'static/custom.js'
  })({
    customTasksDir: 'custom'
  });

  grunt.initConfig({
    app: {
      src: 'assets',
      build: 'build'
    },
    clean: {
      build: '<%= app.build %>'
    },
    assemble: {
      all: {
        expand: true,
        cwd: '<%= app.src %>',
        src: '*.hbs',
        dest: '<%= app.build %>'
      }
    },
    wget: {
      jquery: {
        options: {
          baseUrl: 'http://code.jquery.com/'
        },
        src: [
          'jquery-2.1.0.js',
          'jquery-2.1.0.min.js',
          'jquery-1.11.0.js',
          'jquery-1.11.0.min.js'
        ],
        dest: '<%= app.build %>/lib'
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      all: '*.js'
    },
    custom1: {
      say: {}
    },
    custom2: {
      say: {}
    },
    custom3: {
      say: {}
    },
    custom4: {
      say: {}
    }
  });

  grunt.registerTask('default', ['clean', 'custom1', 'assemble', 'wget', 'custom2', 'newer:jshint', 'custom3', 'custom4']);
};
