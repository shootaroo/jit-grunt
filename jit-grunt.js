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

    var dashedName = taskName.replace(/([A-Z])/g, '-$1').replace(/_+/g, '-').toLowerCase();

    for (var p = PREFIXES.length; p--;) {
      var pluginName = PREFIXES[p] + dashedName;
      if (existsPlugin(pluginName)) {
        return pluginName;
      }
    }

    grunt.log.writeln();
    grunt.log.writeln('jit-grunt: Plugin for the "'.yellow + taskName.yellow + '" task not found.'.yellow);
    grunt.log.writeln('If you have installed the plugin already, please setting the static mapping.'.yellow);
    grunt.log.writeln('See'.yellow, 'https://github.com/shootaroo/jit-grunt#static-mappings'.cyan);
    grunt.log.writeln();
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
    var parts = this.splitArgs(name);
    var i = parts.length;
    var task;
    do {
      task = this._tasks[parts.slice(0, i).join(':')];
    } while (!task && --i > 0);

    // Proxy task.
    if (!task) {
      task = createProxy(parts[0]);
      i = 1;
    }

    var args = parts.slice(i);
    var flags = {};
    args.forEach(function(arg) { flags[arg] = true; });
    return {task: task, nameArgs: name, args: args, flags: flags};
  };
};
