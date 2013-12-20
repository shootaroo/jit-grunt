# jit-grunt 0.1 [![Build Status](https://secure.travis-ci.org/shootaroo/jit-grunt.png?branch=master)](http://travis-ci.org/shootaroo/jit-grunt) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

A JIT(Jast In Time) plugin loader for grunt.  
Grunt load time is not slow plug-in even if many.


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
...
```

```
$ grunt lint --verbose
...
Execution Time (2013-12-20 08:56:18 UTC)
loading tasks       7s  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 88%
lint               1ms  0%
htmlhint:dev     875ms  ■■■■■■■■■■ 11%
csslint:dev       35ms  0%
jshint:dev        30ms  0%
Total 8s
```


### After
```js
require('jit-grunt')(grunt);
```

```
$ grunt lint --verbose

Execution Time (2013-12-20 08:57:09 UTC)
loading tasks    158ms  ■■■■■■■■■■■■ 13%
lint             105ms  ■■■■■■■■ 9%
htmlhint:dev     867ms  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 73%
csslint:dev       29ms  ■■■ 2%
jshint:dev        37ms  ■■■ 3%
Total 1s
```

Have a pleasant grunt life!


## Install

*NOTE: I can not publish to npm with an error now. Please npm install from GitHub.*
```
npm install https://github.com/shootaroo/jit-grunt/archive/v0.1.0.tar.gz --save-dev
```

## Usage

### Simple usage
```js
require('jit-grunt')(grunt);
```

Auto mapping plugin name from task name, search order is
+ `grunt-contrib-<task name>`
+ `grunt-<task name>`
+ `<task name>`


### Static mappings
Second parameter is static mappings `<task name>: <plugin name>`.
```js
require('jit-grunt')(grunt, {
  bower: 'grunt-bower-task',
  sprite: 'grunt-spritesmith'
});
```

## Example
https://github.com/shootaroo/jit-grunt/tree/master/example
