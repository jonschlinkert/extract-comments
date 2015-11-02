# extract-comments [![NPM version](https://badge.fury.io/js/extract-comments.svg)](http://badge.fury.io/js/extract-comments)

> Extract code comments from string or from a glob of files.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i extract-comments --save
```

## Usage

```js
var extract = require('extract-comments');

// pass a string of javascript, CSS, LESS etc
extract(string);
```

**Example**

```js
var str = '/**\n * this is\n *\n * a comment\n*/\n\n\nvar foo = "bar";\n';
var comments = extract(str);
console.log(comments);

[{
  type: 'block',
  raw: '/**\n * this is\n *\n * a comment\n*/',
  value: 'this is\na comment',
  lines: [ 'this is', 'a comment' ],
  loc: { start: { line: 1, pos: 0 }, end: { line: 5, pos: 33 } },
  code:
   { line: 7,
     loc: { start: { line: 7, pos: 36 }, end: { line: 7, pos: 52 } },
     value: 'var foo = "bar";' }
```

## Related

* [code-context](https://www.npmjs.com/package/code-context): Parse a string of javascript to determine the context for functions, variables and comments based… [more](https://www.npmjs.com/package/code-context) | [homepage](https://github.com/jonschlinkert/code-context)
* [esprima-extract-comments](https://www.npmjs.com/package/esprima-extract-comments): Extract code comments from string or from a glob of files using esprima. | [homepage](https://github.com/jonschlinkert/esprima-extract-comments)
* [parse-comments](https://www.npmjs.com/package/parse-comments): Parse code comments from JavaScript or any language that uses the same format. | [homepage](https://github.com/jonschlinkert/parse-comments)

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/extract-comments/issues/new).

## Run tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2014-2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on November 02, 2015._