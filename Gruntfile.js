'use strict';
module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('./jit-grunt')(grunt);

  grunt.initConfig({

    jscs: {
      options: {
        config: '.jscsrc'
      },
      all: ['*.js', '{src,test}/**/*.js']
    },

    jshint: {
      options: {
        jshintrc: true
      },
      all: ['*.js', '{src,test}/**/*.js']
    },

    mochaTest: {
      options: {
        reporter: 'spec',
        require: 'espower-babel/guess'
      },
      test: {
        src: ['test/**/*.js']
      }
    }
  });

  grunt.registerTask('default', ['jscs', 'jshint', 'mochaTest']);
};
