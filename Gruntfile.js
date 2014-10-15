'use strict';
module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('./jit-grunt')(grunt);

  grunt.initConfig({
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
    mochaTest: {
      options: {
        reporter: 'spec',
        require: 'intelli-espower-loader'
      },
      test: {
        src: ['test/**/*.js']
      }
    }
  });

  grunt.registerTask('default', ['jscs', 'jshint', 'mochaTest']);
};
