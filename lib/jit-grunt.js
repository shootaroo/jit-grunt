'use strict';
var fs = require('fs');
var path = require('path');

var MODULES_ROOT = path.resolve('node_modules');
var PREFIXES = ['', 'grunt-', 'grunt-contrib-'];

var jit = {
  mappings: {},
  taskProxies: {},
  taskLoaders: {}
};

jit.exists = function (path) {
  return fs.existsSync(path);
};

jit.findPlugin = function (taskName) {
  var pluginName, taskPath;
  if (this.mappings.hasOwnProperty(taskName)) {
    pluginName = this.mappings[taskName];
    taskPath = path.join(MODULES_ROOT, pluginName, 'tasks');
    if (this.exists(taskPath)) {
      return this.createLoader(pluginName, taskPath);
    }
  }

  if (jit.loadTasks && this.exists(path.join(jit.loadTasks, taskName + '.js'))) {
    return this.createLoader('custom tasks', jit.loadTasks);
  }

  var dashedName = taskName.replace(/([A-Z])/g, '-$1').replace(/_+/g, '-').toLowerCase();

  for (var p = PREFIXES.length; p--;) {
    pluginName = PREFIXES[p] + dashedName;
    taskPath = path.join(MODULES_ROOT, pluginName, 'tasks');
    if (jit.exists(taskPath)) {
      return jit.createLoader(pluginName, taskPath);
    }
  }

  var log = jit.grunt.log.writeln;
  log();
  log('jit-grunt: Plugin for the "'.yellow + taskName.yellow + '" task not found.'.yellow);
  log('If you have installed the plugin already, please setting the static mapping.'.yellow);
  log('See'.yellow, 'https://github.com/shootaroo/jit-grunt#static-mappings'.cyan);
  log();
};

jit.createLoader = function (name, path) {
  var grunt = jit.grunt;
  return jit.taskLoaders[name] ? function () {
  } : jit.taskLoaders[name] = function () {
    var _nameArgs = grunt.task.current.nameArgs;
    grunt.task.current.nameArgs = 'loading ' + name;
    grunt.verbose.header('Loading "' + name);
    grunt.loadTasks(path);
    grunt.verbose.ok('Plugin loaded.');
    grunt.task.current.nameArgs = _nameArgs;
  };
};


jit.createProxy = function (taskName) {
  if (jit.taskProxies[taskName]) {
    return jit.taskProxies[taskName];
  }

  var loader = jit.findPlugin(taskName);
  if (loader) {

    var proxy = jit.taskProxies[taskName] = {
      name: taskName,
      fn: function () {
        loader();
        var task = jit.grunt.task._tasks[taskName];
        if (!task) {
          return new Error('Task "' + taskName + '" failed.');
        }
        proxy.fn = task.fn;
        return task.fn.apply(this, arguments);
      }
    };
    return proxy;
  }
};


module.exports = function factory(grunt, mappings) {
  if (!jit.grunt) {
    jit.grunt = grunt;

    // Override _taskPlusArgs
    grunt.util.task.Task.prototype._taskPlusArgs = function (name) {
      var parts = this.splitArgs(name);
      var i = parts.length;
      var task;
      do {
        task = this._tasks[parts.slice(0, i).join(':')];
      } while (!task && --i > 0);

      // Proxy task.
      if (!task) {
        task = jit.createProxy(parts[0]);
        i = 1;
      }

      var args = parts.slice(i);
      var flags = {};
      args.forEach(function (arg) {
        flags[arg] = true;
      });
      return {task: task, nameArgs: name, args: args, flags: flags};
    };
  }

  for (var key in mappings) {
    if (mappings.hasOwnProperty(key)) {
      jit.mappings[key] = mappings[key];
    }
  }

  return jit;
};
