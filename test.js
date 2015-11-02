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
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].raw === '/**\n * this is\n *\n * a comment\n*/');
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

  it('should get the code line that follows the comment', function () {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    var actual = extract(str);
    assert(actual[0].code.value === 'var foo = "bar";');
  });
});

describe('line comments', function () {
  it('should extract a line comment', function () {
    var str = '// this is a line comment\n\nvar foo = "bar";\n';
    var actual = extract(str);
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
