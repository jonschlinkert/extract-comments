# extract-comments [![NPM version](https://badge.fury.io/js/extract-comments.svg)](http://badge.fury.io/js/extract-comments)

> Extract code comments from string or from a glob of files.

This goes well with [code-context](https://github.com/jonschlinkert/code-context).

## Install with [npm](npmjs.org)

```bash
npm i extract-comments --save
```

## API

### [extract](index.js#L32)

Extract code comments from the given `string`.

* `string` **{String}**    
* `returns` **{Object}**: Object of code comments.  

```js
var extract = require('extract-comments');
extract('// this is a code comment');
```

### [.fromFiles](index.js#L103)

Extract code comments from a file or glob of files. You may also pass a custom `rename` function on the options to change the key of each object returned.

* `patterns` **{String}**: Glob patterns to used.    
* `options` **{Object}**: Options to pass to [globby], or [map-files].    
* `returns` **{Object}**: Object of code comments.  

See [map-files] for more details and available options.

```js
var extract = require('extract-comments');
extract.fromFiles(['lib/*.js']);
```


## Usage example

```js
var extract = require('extract-comments');
var comments = extract.fromFile('fixtures/assemble.js');

// we'll just pick an arbitrary comment:
comments['122'];

{ 'fixtures/assemble.js':
   // the line number
   { '122':
        // the starting line number (same as object key)
      { begin: 122,
        // the actual comment
        comment: 'Initialize default configuration.\n\n@api private\n',
        // the first non-whitespace line after the comment ends
        after: 'Assemble.prototype.defaultConfig = function (opts) {',
        // ending line number
        end: 126,
        // used when this object is merged with "code context", see below
        type: 'comment' }
```


## Run tests

Install dev dependencies:

```bash
npm i -d && npm test
```

## Author

**Jon Schlinkert**
 
+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert) 

## License
Copyright (c) 2014-2015 Jon Schlinkert  
Released under the MIT license

***

_This file was generated by [verb](https://github.com/assemble/verb) on February 13, 2015._

[map-files]: https://github.com/jonschlinkert/map-files