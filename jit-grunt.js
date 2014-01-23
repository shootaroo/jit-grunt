'use strict';
var fs = require('fs');
var path = require('path');

var MODULES_ROOT = path.resolve('node_modules');
var PREFIXES = ['', 'grunt-', 'grunt-contrib-'];

function existsPlugin(name) {
  return fs.existsSync(path.join(MODULES_ROOT, name, 'tasks'));
}

module.exports = function (grunt, plugins) {
  plugins = plugins || {};

  var taskProxies = {};

  function findPlugin(taskName) {
    if (plugins.hasOwnProperty(taskName) && existsPlugin(plugins[taskName])) {
      return plugins[taskName];
    }
    for (var p = PREFIXES.length; p--;) {
      var pluginName = PREFIXES[p] + taskName;
      if (existsPlugin(pluginName)) {
        return pluginName;
      }
    }
  }

  function loadPlugin(name) {
    var _nameArgs = grunt.task.current.nameArgs;
    grunt.task.current.nameArgs = 'loading ' + name;
    grunt.verbose.header('Loading "' + name + '" plugin');
    grunt.loadTasks(path.join(MODULES_ROOT, name, 'tasks'));
    grunt.verbose.ok('Plugin loaded.');
    grunt.task.current.nameArgs = _nameArgs;
  }

  function createProxy(taskName) {
    if (taskProxies[taskName]) {
      return taskProxies[taskName];
    }

    var pluginName = findPlugin(taskName);
    if (pluginName) {

      var proxy = taskProxies[taskName] = {
        name: taskName,
        fn: function () {
          loadPlugin(pluginName);
          var task = grunt.task._tasks[taskName];
          if (!task) {
            return new Error('Task "' + taskName + '" failed.');
          }
          proxy.fn = task.fn;
          return task.fn.apply(this, arguments);
        }
      };
      return proxy;
    }
  }

  // Override _taskPlusArgs
  grunt.util.task.Task.prototype._taskPlusArgs = function(name) {
    // Get task name / argument parts.
    var parts = this.splitArgs(name);
    // Start from the end, not the beginning!
    var i = parts.length;
    var task;
    do {
      // Get a task.
      task = this._tasks[parts.slice(0, i).join(':')];
      // If the task doesn't exist, decrement `i`, and if `i` is greater than
      // 0, repeat.
    } while (!task && --i > 0);

    // Proxy task.
    if (!task) {
      task = createProxy(parts[0]);
      i = 1;
    }

    // Just the args.
    var args = parts.slice(i);
    // Maybe you want to use them as flags instead of as positional args?
    var flags = {};
    args.forEach(function(arg) { flags[arg] = true; });
    // The task to run and the args to run it with.
    return {task: task, nameArgs: name, args: args, flags: flags};
  };
};
