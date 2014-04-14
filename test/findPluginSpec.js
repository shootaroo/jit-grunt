/* global describe, beforeEach, it */
'use strict';
var fs = require('fs');
var path = require('path');
var assert = require('power-assert');
var grunt = require('grunt');
var jit = require('../lib/jit-grunt')(grunt);

var sinon = require('sinon');
var stub = sinon.stub(fs, 'existsSync');

describe('Plugin find', function () {

  beforeEach(function () {
    jit.loadTasks = undefined;
    jit.mappings = {
      bar: 'grunt-foo'
    };
    stub.reset();
  });

  it('grunt-contrib-foo', function () {
    stub.withArgs(path.resolve('node_modules/grunt-contrib-foo/tasks')).returns(true);
    stub.withArgs(path.resolve('node_modules/grunt-foo/tasks')).returns(false);
    stub.withArgs(path.resolve('node_modules/foo/tasks')).returns(false);

    assert(jit.findPlugin('foo'));

    assert(stub.calledWith(path.resolve('node_modules/grunt-contrib-foo/tasks')));
    assert(!stub.calledWith(path.resolve('node_modules/grunt-foo/tasks')));
    assert(!stub.calledWith(path.resolve('node_modules/foo/tasks')));
  });

  it('grunt-foo', function () {
    stub.withArgs(path.resolve('node_modules/grunt-contrib-foo/tasks')).returns(false);
    stub.withArgs(path.resolve('node_modules/grunt-foo/tasks')).returns(true);
    stub.withArgs(path.resolve('node_modules/foo/tasks')).returns(false);
    stub.returns(false);

    assert(jit.findPlugin('foo'));

    assert(stub.calledWith(path.resolve('node_modules/grunt-contrib-foo/tasks')));
    assert(stub.calledWith(path.resolve('node_modules/grunt-foo/tasks')));
    assert(!stub.calledWith(path.resolve('node_modules/foo/tasks')));
  });

  it('foo', function () {
    stub.withArgs(path.resolve('node_modules/grunt-contrib-foo/tasks')).returns(false);
    stub.withArgs(path.resolve('node_modules/grunt-foo/tasks')).returns(false);
    stub.withArgs(path.resolve('node_modules/foo/tasks')).returns(true);

    assert(jit.findPlugin('foo'));

    assert(stub.calledWith(path.resolve('node_modules/grunt-contrib-foo/tasks')));
    assert(stub.calledWith(path.resolve('node_modules/grunt-foo/tasks')));
    assert(stub.calledWith(path.resolve('node_modules/foo/tasks')));
  });

  it('fooBar', function () {
    stub.withArgs(path.resolve('node_modules/grunt-contrib-foo-bar/tasks')).returns(false);
    stub.withArgs(path.resolve('node_modules/grunt-foo-bar/tasks')).returns(true);
    stub.withArgs(path.resolve('node_modules/foo-bar/tasks')).returns(false);

    assert(jit.findPlugin('fooBar'));

    assert(stub.calledWith(path.resolve('node_modules/grunt-contrib-foo-bar/tasks')));
    assert(stub.calledWith(path.resolve('node_modules/grunt-foo-bar/tasks')));
    assert(!stub.calledWith(path.resolve('node_modules/foo-bar/tasks')));
  });

  it('foo_bar', function () {
    stub.withArgs(path.resolve('node_modules/grunt-contrib-foo-bar/tasks')).returns(false);
    stub.withArgs(path.resolve('node_modules/grunt-foo-bar/tasks')).returns(false);
    stub.withArgs(path.resolve('node_modules/foo-bar/tasks')).returns(true);

    assert(jit.findPlugin('foo_bar'));

    assert(stub.calledWith(path.resolve('node_modules/grunt-contrib-foo-bar/tasks')));
    assert(stub.calledWith(path.resolve('node_modules/grunt-foo-bar/tasks')));
    assert(stub.calledWith(path.resolve('node_modules/foo-bar/tasks')));
  });

  it('Custom task', function () {
    jit.loadTasks = path.resolve('custom');

    stub.withArgs(path.resolve('custom/foo.js')).returns(true);

    assert(jit.findPlugin('foo'));

    assert(stub.calledWith(path.resolve('custom/foo.js')));
    assert(!stub.calledWith(path.resolve('node_modules/grunt-contrib-foo/tasks')));
    assert(!stub.calledWith(path.resolve('node_modules/grunt-foo/tasks')));
    assert(!stub.calledWith(path.resolve('node_modules/foo/tasks')));
  });

  it('not Found', function () {
    stub.withArgs(path.resolve('node_modules/grunt-contrib-foo/tasks')).returns(false);
    stub.withArgs(path.resolve('node_modules/grunt-foo/tasks')).returns(false);
    stub.withArgs(path.resolve('node_modules/foo/tasks')).returns(false);

    assert(!jit.findPlugin('foo'));

    assert(stub.calledWith(path.resolve('node_modules/grunt-contrib-foo/tasks')));
    assert(stub.calledWith(path.resolve('node_modules/grunt-foo/tasks')));
    assert(stub.calledWith(path.resolve('node_modules/foo/tasks')));
  });

  it('Static mapping', function () {
    stub.withArgs(path.resolve('node_modules/grunt-contrib-bar/tasks')).returns(false);
    stub.withArgs(path.resolve('node_modules/grunt-foo/tasks')).returns(true);
    stub.withArgs(path.resolve('node_modules/grunt-bar/tasks')).returns(false);
    stub.withArgs(path.resolve('node_modules/bar/tasks')).returns(false);

    assert(jit.findPlugin('bar'));

    assert(stub.calledWith(path.resolve('node_modules/grunt-foo/tasks')));
    assert(!stub.calledWith(path.resolve('node_modules/grunt-contrib-bar/tasks')));
    assert(!stub.calledWith(path.resolve('node_modules/grunt-bar/tasks')));
    assert(!stub.calledWith(path.resolve('node_modules/bar/tasks')));
  });
});
