# jit-grunt 0.5 [![NPM version](https://badge.fury.io/js/jit-grunt.png)](http://badge.fury.io/js/jit-grunt) [![Build Status](https://secure.travis-ci.org/shootaroo/jit-grunt.png?branch=master)](http://travis-ci.org/shootaroo/jit-grunt) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

A JIT(Just In Time) plugin loader for Grunt.  
Load time of Grunt does not slow down even if there are many plugins.


### Before
```js
grunt.loadNpmTasks('assemble');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-csslint');
grunt.loadNpmTasks('grunt-contrib-less');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-newer');
grunt.loadNpmTasks('grunt-wget');
...
```

```
$ grunt assemble
...
Execution Time (2014-01-14 02:52:59 UTC)
loading tasks     5.7s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 84%
assemble:compile  1.1s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 16%
Total 6.8s
```

umm...


### After
```js
require('jit-grunt')(grunt);
```

```
$ grunt assemble
...
Execution Time (2014-01-14 02:53:34 UTC)
loading tasks     111ms  ▇▇▇▇▇▇▇▇▇ 8%
loading assemble  221ms  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 16%
assemble:compile   1.1s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 77%
Total 1.4s
```

Have a pleasant Grunt life!


## Install
```
npm install jit-grunt --save-dev
```


## Usage

Removes `grunt.loadNpmTasks`, then add the `require('jit-grunt')(grunt)` instead. Only it.

```js
module.exports = function (grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    ...
  });

  grunt.registerTask('default', [...]);
}
```
Will automatically search for the plugin from the task name.
Searching in the following order:

1. node_modules/grunt-contrib-`task-name`
2. node_modules/grunt-`task-name`
3. node_modules/`task-name`

```
clean           -> node_modules/grunt-contrib-clean
wget            -> node_modules/grunt-wget
mochaTest       -> node_modules/grunt-mocha-test
mocha_phantomjs -> node_modules/grunt-mocha-phantomjs
assemble        -> node_modules/assemble
custom          -> tasks/custom.js
```


### JIT Loading custom tasks (replacement of [grunt.loadTasks])
Using `loadTasks` option.
```js
require('jit-grunt')(grunt)({
  loadTasks: 'tasksDir'
});
```
Searching rule: `tasksDir`/`taskname`.js


### Static mappings
Second parameter is static mappings.  
It is used when there is a plugin that can not be resolved in the automatic mapping.

`taskname`: `grunt-plugin-name`

```js
require('jit-grunt')(grunt, {
  sprite: 'grunt-spritesmith',
  hello: 'custom/say-hello.js'    // for custom tasks.
});
```


## Example

https://github.com/shootaroo/jit-grunt/tree/master/example


## License

The MIT License (MIT)

Copyright &copy; 2013 [Shotaro Tsubouchi](https://github.com/shootaroo)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


[grunt.loadTasks]:http://gruntjs.com/api/grunt#grunt.loadtasks
