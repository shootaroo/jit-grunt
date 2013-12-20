'use strict';
var _ = require('lodash');

module.exports = function (grunt) {

  var plugins = grunt.file.readJSON('.gruntplugins');
  var loaded = [];

  var run = grunt.task.run;
  grunt.task.run = function (tasks) {
    grunt.log.debug('task.run:', tasks);
    tasks = _.isArray(tasks) ? tasks : [tasks];
    _.each(tasks, function (name) {
      var taskName = name.split(':')[0];
      var plugin = plugins[taskName];
      if (plugin && !loaded[plugin]) {
        grunt.log.writeln('Loading "' + plugin + '" plugin...');
        grunt.loadNpmTasks(plugin);
        loaded[plugin] = true;
      }
    });
    run.apply(grunt.task, arguments);
  };
};
