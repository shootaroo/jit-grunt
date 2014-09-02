'use strict';
module.exports = function (grunt) {
  grunt.registerMultiTask('custom2', 'custom task 2', function () {
    grunt.log.ok('custom2!');
  });
};
