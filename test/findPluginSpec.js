/* global describe, it */
'use strict';
var assert = require('power-assert');
var sinon = require('sinon');
var grunt = require('grunt');
var jit = require('../lib/jit-grunt')(grunt);

describe('Plugin find', function() {

  it('grunt-contrib-foo', function () {
    jit.exists = sinon.stub().withArgs('node_modules/grunt-contrib-foo/tasks').returns(true);
    assert(jit.findPlugin('foo'));
  });

  it('grunt-foo', function () {
    jit.exists = sinon.stub().withArgs('node_modules/grunt-foo/tasks').returns(true);
    assert(jit.findPlugin('foo'));
  });

  it('foo', function () {
    jit.exists = sinon.stub().withArgs('node_modules/foo/tasks').returns(true);
    assert(jit.findPlugin('foo'));
  });

  it('fooBar', function () {
    jit.exists = sinon.stub().withArgs('node_modules/foo-bar/tasks').returns(true);
    assert(jit.findPlugin('fooBar'));
  });

  it('foo_bar', function () {
    jit.exists = sinon.stub().withArgs('node_modules/foo-bar/tasks').returns(true);
    assert(jit.findPlugin('foo_bar'));
  });

  it('Custom task', function () {
    jit.exists = sinon.stub().withArgs('tasks/foo.js').returns(true);
    assert(jit.findPlugin('foo'));
  });

  it('not Found', function () {
    jit.exists = sinon.stub().returns(false);
    assert(!jit.findPlugin('foo'));
  });
});
