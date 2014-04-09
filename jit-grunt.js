'use strict';
var jitGrunt = require('./lib/jit-grunt');
var path = require('path');

module.exports = function (grunt, mappings) {
  var jit = jitGrunt(grunt, mappings);
  return function (options) {
    options = options || {};

    if (options.loadTasks) {
      jit.loadTasks = path.resolve(options.loadTasks);
    }
  };
};
