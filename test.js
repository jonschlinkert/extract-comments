'use strict';

require('mocha');
require('should');
var assert = require('assert');
var context = require('code-context');
var extract = require('./');
var fs = require('fs');

function read(fp) {
  return fs.readFileSync(__dirname + '/fixtures/' + fp, 'utf8');
}

describe('block comments', function () {
  it('should extract a block comment', function () {
    var str = '/**\n * this is\n *\n * a comment\n*/\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].raw === '/**\n * this is\n *\n * a comment\n*/');
  });

  it('should not extract comments in quoted strings', function () {
    var a = '/* this is a block comment */\n\nvar foo = "/* bar */"';
    var actual = extract(a);
    assert(actual.length === 1);
    assert(actual[0].raw === '/* this is a block comment */');

    var b = '/* this is a block comment */\n\nvar foo = "abc /* bar */ xyz "';
    var actual = extract(b);
    assert(actual.length === 1);
    assert(actual[0].raw === '/* this is a block comment */');
  });

  it('should extract comments in functions', function () {
    var a = 'function foo(/*a, b, c*/);';
    var actual = extract(a);
    assert(actual[0].raw === '/*a, b, c*/');
  });

  it('should strip leading stars to create the "value" property', function () {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].value === 'this is\na comment');
  });

  it('should split the comment into lines', function () {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].lines[0] === 'this is');
    assert(actual[0].lines[1] === 'a comment');
  });

  it('should get the starting line number', function () {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].loc.start.line === 1);
  });

  it('should get the starting index', function () {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].loc.start.pos === 0);
  });

  it('should get the ending line number', function () {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].loc.end.line === 5);
  });

  it('should get the ending index', function () {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].loc.end.pos === 33);
  });
});

describe('code', function () {
  it('should get the code line that follows the comment', function () {
    var str = '/**\n * this is\n *\n * a comment\n*/\n\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].code.value === 'var foo = "bar";');
  });

  it('should get the code starting and ending indices', function () {
    var str = '/**\n * this is\n *\n * a comment\n*/\n\n\nvar foo = "bar";\n';
    var actual = extract(str);
    var code = actual[0].code;
    var start = code.loc.start.pos;
    var end = code.loc.end.pos;
    assert(start === 36);
    assert(end === 52);
    assert(str.slice(start, end) === 'var foo = "bar";');
  });

  it('should get the code line number', function () {
    var str = '/**\n * this is\n *\n * a comment\n*/\n\n\nvar foo = "bar";\n';
    var actual = extract(str);
    var code = actual[0].code;
    var start = code.loc.start.line;
    var lines = str.split('\n');
    var line = lines.indexOf('var foo = "bar";');
    assert(line === start);
  });
});

describe('line comments', function () {
  it('should extract a line comment', function () {
    var str = '// this is a line comment\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].raw === '// this is a line comment');
  });

  it('should not extract comments in quoted strings', function () {
    var a = '// this is a line comment\n\nvar foo = ". // \' \\ . // \' \\ .";\n';
    var actual = extract(a);
    assert(actual.length === 1);
    assert(actual[0].raw === '// this is a line comment');

    var b = '// this is a line comment\n\nvar foo = "// one two"';
    var actual = extract(b);
    assert(actual.length === 1);
    assert(actual[0].raw === '// this is a line comment');
  });

  it('should strip leading slashes to create the "value" property', function () {
    var str = '// this is a line comment\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].value === 'this is a line comment');
  });

  it('should get the starting line number', function () {
    var str = '// this is a line comment\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].loc.start.line === 1);
  });

  it('should get the starting index', function () {
    var str = '// this is a line comment\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].loc.start.pos === 0);
  });

  it('should get the ending line number', function () {
    var str = '// this is a line comment\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].loc.end.line === 1);
  });

  it('should get the ending index', function () {
    var str = '// this is a line comment\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].loc.end.pos === 25);
  });
});

describe('first', function () {
  it('should extract the first comment only', function () {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n/* baz */';
    var actual = extract.first(str);
    assert(actual === '/**\n * this is\n *\n * a comment\n*/');
  });
});
