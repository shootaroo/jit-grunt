'use strict';
module.exports = function (grunt) {

  require('./jit-grunt')(grunt);

  grunt.initConfig({
    clean: {
      build: 'build'
    },
    jshint: {
      options: {
        jshintrc: true
      },
      all: ['*.js', 'lib/**/*.js', 'test/**/*.js']
    },
    espower: {
      test: {
        expand: true,
        cwd: 'test/',
        src: ['**/*.js'],
        dest: 'build',
        ext: '.js'
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['build/**/*.js']
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'espower', 'mochaTest']);
};