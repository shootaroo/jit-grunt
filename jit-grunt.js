'use strict';
module.exports = function (grunt, plugins) {
  var path = require('path');

  var PREFIXES = ['', 'grunt-', 'grunt-contrib-'];
  var loaded = {};
  var root = path.resolve('node_modules');


  var loadPlugin = function (name) {
    var tasksDir = path.join(root, name, 'tasks');
    if (grunt.file.exists(tasksDir)) {
      grunt.log.write('\nLoading', name.underline.cyan, 'plugin...');
      grunt.loadTasks(tasksDir);
      grunt.log.ok();
      return true;
    }
    return false;
  };

  plugins = plugins || {};

  var _taskPlusArgs = grunt.util.task.Task.prototype._taskPlusArgs;
  grunt.util.task.Task.prototype._taskPlusArgs = function(name) {
    var taskName = name.split(':')[0];
    if (loaded.hasOwnProperty(taskName)) {
      return _taskPlusArgs.call(this, name);
    }
    if (!plugins.hasOwnProperty(taskName) || !loadPlugin(plugins[taskName])) {
      for (var i = PREFIXES.length; i--;) {
        if (loadPlugin(PREFIXES[i] + taskName)) {
          break;
        }
      }
    }
    loaded[taskName] = true;
    return _taskPlusArgs.call(this, name);
  };
};
