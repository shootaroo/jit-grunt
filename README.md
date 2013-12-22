# jit-grunt 0.1 [![Build Status](https://secure.travis-ci.org/shootaroo/jit-grunt.png?branch=master)](http://travis-ci.org/shootaroo/jit-grunt) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

A JIT(Just In Time) plugin loader for grunt.  
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
```
npm install jit-grunt --save-dev
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
