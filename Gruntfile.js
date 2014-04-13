'use strict';
module.exports = function (grunt) {

  require('./jit-grunt')(grunt, {
    jscs: 'grunt-jscs-checker'
  });

  grunt.initConfig({
    clean: {
      build: 'build'
    },
    jscs: {
      options: {
        config: '.jscsrc'
      },
      all: ['*.js', '{lib,test}/**/*.js']
    },
    jshint: {
      options: {
        jshintrc: true
      },
      all: ['*.js', '{lib,test}/**/*.js']
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

  grunt.registerTask('default', ['jscs', 'jshint', 'espower', 'mochaTest']);
};
