'use strict';
module.exports = function (grunt) {
  grunt.registerMultiTask('custom1', 'custom task 1', function () {
    grunt.log.ok('custom1!');
  });
};
