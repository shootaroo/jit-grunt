'use strict';
var fs = require('fs');
var path = require('path');

var MODULES_ROOT = path.resolve('node_modules');
var PREFIXES = ['', 'grunt-', 'grunt-contrib-'];

module.exports = function (grunt, plugins) {
  plugins = plugins || {};

  var taskProxies = {};
  var taskLoaders = {};

  function findPlugin(taskName) {
    var pluginName, taskPath;
    if (plugins.hasOwnProperty(taskName)) {
      pluginName = plugins[taskName];
      taskPath = path.join(MODULES_ROOT, pluginName, 'tasks');
      if (fs.existsSync(taskPath)) {
        return createLoader(pluginName, taskPath);
      }
    }

    if (fs.existsSync(path.join('tasks', taskName + '.js'))) {
      return createLoader('custom tasks', 'tasks');
    }

    var dashedName = taskName.replace(/([A-Z])/g, '-$1').replace(/_+/g, '-').toLowerCase();

    for (var p = PREFIXES.length; p--;) {
      pluginName = PREFIXES[p] + dashedName;
      taskPath = path.join(MODULES_ROOT, pluginName, 'tasks');
      if (fs.existsSync(taskPath)) {
        return createLoader(pluginName, taskPath);
      }
    }

    grunt.log.writeln();
    grunt.log.writeln('jit-grunt: Plugin for the "'.yellow + taskName.yellow + '" task not found.'.yellow);
    grunt.log.writeln('If you have installed the plugin already, please setting the static mapping.'.yellow);
    grunt.log.writeln('See'.yellow, 'https://github.com/shootaroo/jit-grunt#static-mappings'.cyan);
    grunt.log.writeln();
  }

  function createLoader(name, path) {
    return taskLoaders[name] ? function () {} : taskLoaders[name] = function () {
      var _nameArgs = grunt.task.current.nameArgs;
      grunt.task.current.nameArgs = 'loading ' + name;
      grunt.verbose.header('Loading "' + name);
      grunt.loadTasks(path);
      grunt.verbose.ok('Plugin loaded.');
      grunt.task.current.nameArgs = _nameArgs;
    };
  }

  function createProxy(taskName) {
    if (taskProxies[taskName]) {
      return taskProxies[taskName];
    }

    var loader = findPlugin(taskName);
    if (loader) {

      var proxy = taskProxies[taskName] = {
        name: taskName,
        fn: function () {
          loader();
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
