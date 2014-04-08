'use strict';
var jitGrunt = require('./lib/jit-grunt');

module.exports = function (grunt, mappings) {
  var jit = jitGrunt(grunt, mappings);
  return function (options) {
    options = options || {};
    jit.loadTasks = options.loadTasks;
  };
};
