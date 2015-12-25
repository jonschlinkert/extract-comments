'use strict';

require('mocha');
require('should');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var extract = require('..');

function read(fp) {
  return fs.readFileSync(__dirname + '/fixtures/' + fp, 'utf8');
}

describe('comments', function() {
  it('should throw an error when comment is not a string', function(cb) {
    try {
      extract();
      cb('expected an error');
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected a string');
      cb();
    }
  });

  it('should get block comments and line comments', function() {
    var str = read('mixed.js');
    var actual = extract(str);
    assert.equal(actual[0].raw, '/*!\n * this is a multiline\n * block comment\n */');
    assert.equal(actual[actual.length - 1].raw, '// eos');
  });

  it('should return an empty array if no comments are found', function() {
    var str = 'foo';
    var actual = extract(str);
    assert.deepEqual(actual, []);
  });

  it('should not mangle json', function() {
    var str = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8');
    var actual = extract(str);
    assert.deepEqual(actual, []);
  });

  it('should not mistake escaped slashes for comments', function() {
    // see https://github.com/jonschlinkert/extract-comments/issues/12
    var actual = extract.line("'foo/bar'.replace(/o\\//, 'g')");
    assert.deepEqual(actual, []);
  });

  it('should support passing a callback as the last argument', function() {
    var str = read('mixed.js');
    var actual = extract(str, function(comment) {
      comment.foo = 'bar';
      return comment;
    });
    assert.equal(actual[0].foo, 'bar');
  });
});

describe('block comments', function() {
  it('should throw an error when comment is not a string', function(cb) {
    try {
      extract.block();
      cb('expected an error');
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected a string');
      cb();
    }
  });

  it('should return an empty array if no comments are found', function() {
    var str = 'foo';
    var actual = extract.block(str);
    assert.deepEqual(actual, []);
  });

  it('should take options as the second argument', function() {
    var str = 'foo';
    var actual = extract.block(str);
    assert.deepEqual(actual, []);
  });

  it('should extract a block comment', function() {
    var str = '/**\n * this is\n *\n * a comment\n*/\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert.equal(actual[0].raw, '/**\n * this is\n *\n * a comment\n*/');
  });

  it('should strip protected comments', function() {
    var str = read('mixed.js');
    var actual = extract.block(str);
    assert.equal(actual[0].raw, '/*!\n * this is a multiline\n * block comment\n */');
  });

  it('should not extract comments in quoted strings', function() {
    var a = '/* this is a block comment */\n\nvar foo = "/* bar */"';
    var actual = extract(a);
    assert.equal(actual.length, 1);
    assert.equal(actual[0].raw, '/* this is a block comment */');

    var b = '/* this is a block comment */\n\nvar foo = "abc /* bar */ xyz "';
    var actual = extract(b);
    assert.equal(actual.length, 1);
    assert.equal(actual[0].raw, '/* this is a block comment */');
  });

  it('should extract comments in functions', function() {
    var a = 'function foo(/*a, b, c*/);';
    var actual = extract(a);
    assert.equal(actual[0].raw, '/*a, b, c*/');
  });

  it('should extract comments after quoted strings', function() {
    var a = '"some code"\n/**\n * some comment\n*/\n';
    var actual = extract(a);
    assert.equal(actual.length, 1);
  });

  it('should strip leading stars to create the "value" property', function() {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    var actual = extract(str);
    assert.equal(actual[0].value, 'this is\na comment');
  });

  it('should split the comment into lines', function() {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    var actual = extract(str);
    assert.equal(actual[0].lines[0], 'this is');
    assert.equal(actual[0].lines[1], 'a comment');
  });

  it('should get the starting line number', function() {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    var actual = extract(str);
    assert.equal(actual[0].loc.start.line, 1);
  });

  it('should get the starting index', function() {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    var actual = extract(str);
    assert.equal(actual[0].loc.start.pos, 0);
  });

  it('should get the ending line number', function() {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    var actual = extract(str);
    assert.equal(actual[0].loc.end.line, 5);
  });

  it('should get the ending index', function() {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    var actual = extract(str);
    var loc = actual[0].loc;
    assert.equal(loc.end.pos, 33);
  });
});

describe('code', function() {
  it('should get the code line that follows the comment', function() {
    var str = '/**\n * this is\n *\n * a comment\n*/\n\n\nvar foo = "bar";\n// var one = two';
    var actual = extract(str);
    assert.equal(actual[0].code.value, 'var foo = "bar";');
  });

  it('should get a code line that immediately follows the comment', function() {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n// var one = two';
    var actual = extract(str);
    assert.equal(actual[0].code.value, 'var foo = "bar";');
  });

  it('should not get a comment following a comment', function() {
    var str = '/**\n * this is\n *\n * a comment\n*/\n// var one = two';
    var actual = extract(str);
    assert.equal(actual[0].code.value, '');
  });

  it('should get the code starting and ending indices', function() {
    var str = '/**\n * this is\n *\n * a comment\n*/\n\n\nvar foo = "bar";\n';
    var actual = extract(str);
    var code = actual[0].code;
    var start = code.loc.start.pos;
    var end = code.loc.end.pos;
    assert.equal(start, 36);
    assert.equal(end, 52);
    assert.equal(str.slice(start, end), 'var foo = "bar";');
  });

  it('should get comments after code', function() {
    var str = '/**\n * this is\n *\n * a comment\n*/\n\n\nvar foo = "bar";\n/* foo */';
    var actual = extract(str);
    var comment = actual[1];
    assert.equal(comment.raw, '/* foo */');
  });

  it('should get the code line number', function() {
    var str = '/**\n * this is\n *\n * a comment\n*/\n\n\nvar foo = "bar";\n';
    var actual = extract(str);
    var code = actual[0].code;
    var start = code.loc.start.line;
    var lines = str.split('\n');
    var line = lines.indexOf('var foo = "bar";');
    assert.equal(line, start);
  });
});

describe('line comments', function() {
  it('should throw an error when comment is not a string', function(cb) {
    try {
      extract.line();
      cb('expected an error');
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected a string');
      cb();
    }
  });

  it('should return an empty array if no comments are found', function() {
    var str = 'foo';
    var actual = extract.line(str);
    assert.deepEqual(actual, []);
  });

  it('should take options as the second argument', function() {
    var str = 'foo';
    var actual = extract.line(str);
    assert.deepEqual(actual, []);
  });

  it('should extract a line comment', function() {
    var str = '// this is a line comment\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert.equal(actual[0].raw, '// this is a line comment');
  });

  it('should not extract comments in quoted strings', function() {
    var a = '// this is a line comment\n\nvar foo = ". // \' \\ . // \' \\ .";\n';
    var actual = extract(a);
    assert.equal(actual.length, 1);
    assert.equal(actual[0].raw, '// this is a line comment');

    var b = '// this is a line comment\n\nvar foo = "// one two"';
    var actual = extract(b);
    assert.equal(actual.length, 1);
    assert.equal(actual[0].raw, '// this is a line comment');
  });

  it('should strip leading slashes to create the "value" property', function() {
    var str = '// this is a line comment\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert.equal(actual[0].value, 'this is a line comment');
  });

  it('should get the starting line number', function() {
    var str = '// this is a line comment\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert.equal(actual[0].loc.start.line, 1);
  });

  it('should get the starting index', function() {
    var str = '// this is a line comment\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert.equal(actual[0].loc.start.pos, 0);
  });

  it('should get the ending line number', function() {
    var str = '// this is a line comment\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert.equal(actual[0].loc.end.line, 1);
  });

  it('should get the ending index', function() {
    var str = '// this is a line comment\n\nvar foo = "bar";\n';
    var actual = extract(str);
    assert.equal(actual[0].loc.end.pos, 25);
  });
});

describe('first', function() {
  it('should throw an error when comment is not a string', function(cb) {
    try {
      extract.first();
      cb('expected an error');
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected a string');
      cb();
    }
  });

  it('should extract the first block comment', function() {
    var str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n/* baz */';
    var actual = extract.first(str);
    assert.equal(actual, '/**\n * this is\n *\n * a comment\n*/');
  });

  it('should extract the first line comment', function() {
    var str = '// this is a comment\n\nvar foo = "bar";\n/* baz */';
    var actual = extract.first(str);
    assert.equal(actual, '// this is a comment');
  });

  it('should return null if no comments are found', function() {
    var str = 'foo';
    var actual = extract.first(str);
    assert.equal(actual, null);
  });
});
