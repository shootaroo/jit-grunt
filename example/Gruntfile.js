'use strict';
module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt);

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
    }
  });

  grunt.registerTask('default', ['clean', 'assemble', 'wget', 'newer:jshint']);
};