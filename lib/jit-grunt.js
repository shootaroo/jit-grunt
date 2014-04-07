'use strict';
var fs = require('fs');
var path = require('path');

var MODULES_ROOT = 'node_modules';
var PREFIXES = ['', 'grunt-', 'grunt-contrib-'];

var instances = {};

function Jit(grunt) {
  this.grunt = grunt;
  this.plugins = {};
  this.taskProxies = {};
  this.taskLoaders = {};

  var jit = this;

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

Jit.prototype.exists = function (path) {
  return fs.existsSync(path);
};

Jit.prototype.findPlugin = function (taskName) {
  var pluginName, taskPath;
  if (this.plugins.hasOwnProperty(taskName)) {
    pluginName = this.plugins[taskName];
    taskPath = path.join(MODULES_ROOT, pluginName, 'tasks');
    if (this.exists(taskPath)) {
      return this.createLoader(pluginName, taskPath);
    }
  }

  if (this.exists(path.join('tasks', taskName + '.js'))) {
    return this.createLoader('custom tasks', 'tasks');
  }

  var dashedName = taskName.replace(/([A-Z])/g, '-$1').replace(/_+/g, '-').toLowerCase();

  for (var p = PREFIXES.length; p--;) {
    pluginName = PREFIXES[p] + dashedName;
    taskPath = path.join(MODULES_ROOT, pluginName, 'tasks');
    if (this.exists(taskPath)) {
      return this.createLoader(pluginName, taskPath);
    }
  }

  var log = this.grunt.log.writeln;
  log();
  log('jit-grunt: Plugin for the "'.yellow + taskName.yellow + '" task not found.'.yellow);
  log('If you have installed the plugin already, please setting the static mapping.'.yellow);
  log('See'.yellow, 'https://github.com/shootaroo/jit-grunt#static-mappings'.cyan);
  log();
};

Jit.prototype.createLoader = function (name, path) {
  var grunt = this.grunt;
  return this.taskLoaders[name] ? function () {
  } : this.taskLoaders[name] = function () {
    var _nameArgs = grunt.task.current.nameArgs;
    grunt.task.current.nameArgs = 'loading ' + name;
    grunt.verbose.header('Loading "' + name);
    grunt.loadTasks(path);
    grunt.verbose.ok('Plugin loaded.');
    grunt.task.current.nameArgs = _nameArgs;
  };
};


Jit.prototype.createProxy = function (taskName) {
  if (this.taskProxies[taskName]) {
    return this.taskProxies[taskName];
  }

  var loader = this.findPlugin(taskName);
  if (loader) {

    var grunt = this.grunt;
    var proxy = this.taskProxies[taskName] = {
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
};


module.exports = function factory(grunt, mappings) {
  var jit = instances[grunt];
  if (!jit) {
    jit = new Jit(grunt);
    instances[grunt] = jit;
  }

  for (var key in mappings) {
    if (mappings.hasOwnProperty(key)) {
      jit.plugins[key] = mappings[key];
    }
  }

  return jit;
};
