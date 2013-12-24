'use strict';
module.exports = function (grunt, plugins) {
  var path = require('path');
  var chalk = require('chalk');

  var PREFIXES = ['', 'grunt-', 'grunt-contrib-'];
  var loaded = {};
  var root = path.resolve('node_modules');


  var loadPlugin = function (name) {
    var tasksDir = path.join(root, name, 'tasks');
    if (grunt.file.exists(tasksDir)) {
      grunt.log.write('\nLoading', chalk.underline.yellow(name), 'plugin...');
      grunt.loadTasks(tasksDir);
      grunt.log.ok();
      return true;
    }
    return false;
  };

  plugins = plugins || {};

  var run = grunt.task.run;
  grunt.task.run = function (tasks) {
    tasks = Array.isArray(tasks) ? tasks : [tasks];
    tasks.forEach(function (task) {
      var taskName = task.split(':')[0];
      if (loaded.hasOwnProperty(taskName)) {
        return;
      }
      if (!plugins.hasOwnProperty(taskName) || !loadPlugin(plugins[taskName])) {
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
