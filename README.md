# jit-grunt [![Build Status](https://secure.travis-ci.org/shootaroo/jit-grunt.png?branch=master)](http://travis-ci.org/shootaroo/jit-grunt) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Loading grunt plugins just in time.
Grunt load time very fast.


### Before
```
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
htmlhint:dev       0ms  0%
htmlhint:dev_pc  875ms  ■■■■■■■■■■ 11%
htmlhint:dev_sp   10ms  0%
csslint:dev       35ms  0%
jshint:dev        30ms  0%
Total 8s
```


### After
```
require('jit-grunt')(grunt);
```
and

.gruntplugins
```json
{
  "assemble": "assemble",
  "clean": "grunt-contrib-clean",
  "connect": "grunt-contrib-connect",
  "copy": "grunt-contrib-copy",
  "csslint": "grunt-contrib-csslint",
  "less": "grunt-contrib-less",
  "jshint": "grunt-contrib-jshint",
  "uglify": "grunt-contrib-uglify",
  "watch": "grunt-contrib-watch",
  ...
}
```

```
$ grunt lint --verbose

Execution Time (2013-12-20 08:57:09 UTC)
loading tasks    158ms  ■■■■■■■■■■■■ 13%
lint             105ms  ■■■■■■■■ 9%
htmlhint:dev       0ms  0%
htmlhint:dev_pc  867ms  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 72%
htmlhint:dev_sp   10ms  ■ 1%
csslint:dev       29ms  ■■■ 2%
jshint:dev        37ms  ■■■ 3%
Total 1s
```

## Install
```
npm install jit-grunt --save-dev
```

## Example
https://github.com/shootaroo/jit-grunt/blob/master/.gruntplugins
https://github.com/shootaroo/jit-grunt/blob/master/Gruntfile.js
