'use strict';
module.exports = function (grunt, plugins) {
  var path = require('path');
  var _ = require('lodash');

  var PREFIXES = ['', 'grunt-', 'grunt-contrib-'];
  var loaded = [];
  var root = path.resolve('node_modules');


  var loadPlugin = function (name) {
    var tasksDir = path.join(root, name, 'tasks');
    if (grunt.file.exists(tasksDir)) {
      grunt.log.write('\nLoading "' + name + '" plugin...');
      grunt.loadTasks(tasksDir);
      grunt.log.ok();
      return true;
    }
    return false;
  };

  plugins = plugins || {};

  var run = grunt.task.run;
  grunt.task.run = function (tasks) {
    tasks = _.isArray(tasks) ? tasks : [tasks];
    tasks.forEach(function (task) {
      var taskName = task.split(':')[0];
      if (loaded[taskName]) {
        return;
      }
      if (!plugins[taskName] || !loadPlugin(plugins[taskName])) {
        for (var i = PREFIXES.length; i--;) {
          if (loadPlugin(PREFIXES[i] + taskName)) {
            break;
          }
        }
      }
      loaded[taskName] = true;
    });
    run.apply(grunt.task, arguments);
  };
};
