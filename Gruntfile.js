'use strict';
module.exports = function (grunt) {

  require('./jit-grunt')(grunt);

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      all: '*.js'
    }
  });

  grunt.registerTask('default', ['jshint']);
};