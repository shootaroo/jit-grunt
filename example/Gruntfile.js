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
    concat: {
      concat: {
        files: {
          '<%= app.build %>/js/common.js': ['<%= app.build %>/lib/jquery/jquery.js']
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

  grunt.registerTask('default', ['clean', 'assemble', 'bower', 'concat', 'newer:jshint']);
};