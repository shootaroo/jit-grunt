'use strict';
module.exports = function (grunt) {
  grunt.registerMultiTask('custom3', 'static custom task', function () {
    grunt.log.ok('custom3!');
  });
};
