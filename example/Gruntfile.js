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
      lib: {
        src: [
          'http://code.jquery.com/jquery-2.1.0.js',
          'https://raw2.github.com/jashkenas/underscore/1.6.0/underscore.js'
        ],
        dest: '<%= app.build %>/lib'
      }
    },
    concat: {
      concat: {
        files: {
          '<%= app.build %>/js/common.js': ['<%= app.build %>/lib/*.js']
        }
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      all: '*.js'
    }
  });

  grunt.registerTask('default', ['clean', 'assemble', 'wget', 'concat', 'newer:jshint']);
};