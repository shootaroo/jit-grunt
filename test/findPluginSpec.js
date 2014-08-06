/* global describe, beforeEach, it */
'use strict';
var fs = require('fs');
var path = require('path');
var assert = require('power-assert');
var grunt = require('grunt');
var jit = require('../lib/jit-grunt')(grunt);

var sinon = require('sinon');
var existsSync = sinon.stub(fs, 'existsSync');
var loadPlugin = sinon.stub(jit, 'loadPlugin');

describe('Plugin find', function () {

  beforeEach(function () {
    jit.customTasksDir = undefined;
    jit.mappings = {
      bar: 'grunt-foo'
    };
    jit.pluginsRoot = path.resolve('node_modules');
    existsSync.reset();
    loadPlugin.reset();
  });

  it('grunt-contrib-foo', function () {
    existsSync.withArgs(path.resolve('node_modules/grunt-contrib-foo/tasks')).returns(true);

    jit.findPlugin('foo');

    assert.deepEqual(
      loadPlugin.getCall(0).args,
      ['grunt-contrib-foo', path.resolve('node_modules/grunt-contrib-foo/tasks')]);
  });

  it('grunt-foo', function () {
    existsSync.withArgs(path.resolve('node_modules/grunt-contrib-foo/tasks')).returns(false);
    existsSync.withArgs(path.resolve('node_modules/grunt-foo/tasks')).returns(true);

    jit.findPlugin('foo');

    assert.deepEqual(
      loadPlugin.getCall(0).args,
      ['grunt-foo', path.resolve('node_modules/grunt-foo/tasks')]);
  });

  it('foo', function () {
    existsSync.withArgs(path.resolve('node_modules/grunt-contrib-foo/tasks')).returns(false);
    existsSync.withArgs(path.resolve('node_modules/grunt-foo/tasks')).returns(false);
    existsSync.withArgs(path.resolve('node_modules/foo/tasks')).returns(true);

    jit.findPlugin('foo');

    assert.deepEqual(
      loadPlugin.getCall(0).args,
      ['foo', path.resolve('node_modules/foo/tasks')]);
  });

  it('CamelCase', function () {
    existsSync.withArgs(path.resolve('node_modules/grunt-contrib-foo-bar/tasks')).returns(false);
    existsSync.withArgs(path.resolve('node_modules/grunt-foo-bar/tasks')).returns(true);

    jit.findPlugin('fooBar');

    assert.deepEqual(
      loadPlugin.getCall(0).args,
      ['grunt-foo-bar', path.resolve('node_modules/grunt-foo-bar/tasks')]);
  });

  it('snake_case', function () {
    existsSync.withArgs(path.resolve('node_modules/grunt-contrib-foo-bar/tasks')).returns(false);
    existsSync.withArgs(path.resolve('node_modules/grunt-foo-bar/tasks')).returns(false);
    existsSync.withArgs(path.resolve('node_modules/foo-bar/tasks')).returns(true);

    jit.findPlugin('foo_bar');

    assert.deepEqual(
      loadPlugin.getCall(0).args,
      ['foo-bar', path.resolve('node_modules/foo-bar/tasks')]);
  });

  it('Custom task', function () {
    jit.customTasksDir = path.resolve('custom');

    existsSync.withArgs(path.resolve('custom/foo.js')).returns(true);

    jit.findPlugin('foo');

    assert.deepEqual(
      loadPlugin.getCall(0).args,
      ['foo', path.resolve('custom/foo.js'), true]);
  });

  it('Custom task: CoffeeScript', function () {
    jit.customTasksDir = path.resolve('custom');

    existsSync.withArgs(path.resolve('custom/foo.js')).returns(false);
    existsSync.withArgs(path.resolve('custom/foo.coffee')).returns(true);

    jit.findPlugin('foo');

    assert.deepEqual(
      loadPlugin.getCall(0).args,
      ['foo', path.resolve('custom/foo.coffee'), true]);
  });

  it('not Found', function () {
    existsSync.withArgs(path.resolve('node_modules/grunt-contrib-foo/tasks')).returns(false);
    existsSync.withArgs(path.resolve('node_modules/grunt-foo/tasks')).returns(false);
    existsSync.withArgs(path.resolve('node_modules/foo/tasks')).returns(false);

    jit.findPlugin('foo');

    assert(loadPlugin.callCount === 0);
  });

  it('Static mapping', function () {
    existsSync.withArgs(path.resolve('node_modules/grunt-contrib-bar/tasks')).returns(false);
    existsSync.withArgs(path.resolve('node_modules/grunt-foo/tasks')).returns(true);

    jit.findPlugin('bar');

    assert.deepEqual(
      loadPlugin.getCall(0).args,
      ['grunt-foo', path.resolve('node_modules/grunt-foo/tasks')]);
  });

  it('Static mapping for custom task', function () {
    jit.mappings = {
      foo: 'custom/foo.js'
    };

    existsSync.withArgs(path.resolve('node_modules/grunt-contrib-foo/tasks')).returns(false);
    existsSync.withArgs(path.resolve('node_modules/grunt-foo/tasks')).returns(false);
    existsSync.withArgs(path.resolve('node_modules/foo/tasks')).returns(false);
    existsSync.withArgs(path.resolve('custom/foo.js')).returns(true);

    jit.findPlugin('foo');

    assert.deepEqual(
      loadPlugin.getCall(0).args,
      ['foo', path.resolve('custom/foo.js'), true]);
  });

  it('Other node_modules dir', function () {
    jit.pluginsRoot = path.resolve('other/dir');

    existsSync.withArgs(path.resolve('other/dir/grunt-contrib-foo/tasks')).returns(false);
    existsSync.withArgs(path.resolve('other/dir/grunt-foo/tasks')).returns(false);
    existsSync.withArgs(path.resolve('other/dir/foo/tasks')).returns(true);

    jit.findPlugin('foo');

    assert.deepEqual(
      loadPlugin.getCall(0).args,
      ['foo', path.resolve('other/dir/foo/tasks')]);
  });
});
