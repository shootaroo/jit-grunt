'use strict';
module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('../jit-grunt')(grunt, {
    'bower': 'grunt-bower-task'
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
    bower: {
      install: {
        options: {
          targetDir: '<%= app.build %>/lib'
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

  grunt.registerTask('default', ['clean', 'assemble', 'bower', 'newer:jshint']);
};