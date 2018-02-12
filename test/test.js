'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var extract = require('..');

function read(fp) {
  return fs.readFileSync(__dirname + '/fixtures/' + fp, 'utf8');
}

describe('comments', function() {
  it('should throw an error when comment is not a string', function() {
    assert.throws(() => extract(), /expected/i);
  });

  it('should get block comments and line comments', function() {
    const str = read('mixed.js');
    const actual = extract(str);
    assert.equal(actual[0].raw, '*\n * and this multiline\n * block comment\n ');
    assert.equal(actual[actual.length - 1].raw, ' eos');
  });

  it('should support passing a custom extractor (espree)', function() {
    const str = read('mixed.js');
    const actual = extract(str, {
      extractor: require('espree-extract-comments')
    });
    assert.equal(actual[0].raw, '*\n * and this multiline\n * block comment\n ');
    assert.equal(actual[actual.length - 1].raw, ' eos');
  });

  it('should support passing a custom extractor (babel)', function() {
    const str = read('mixed.js');
    const actual = extract(str, {
      extractor: require('babel-extract-comments')
    });
    assert.equal(actual[0].raw, '*\n * and this multiline\n * block comment\n ');
    assert.equal(actual[actual.length - 1].raw, ' eos');
  });

  it('should return an empty array if no comments are found', function() {
    const str = 'foo';
    const actual = extract(str);
    assert.deepEqual(actual, []);
  });

  it('should not mistake escaped slashes for comments', function() {
    // see https://github.com/jonschlinkert/extract-comments/issues/12
    const actual = extract.line("'foo/bar'.replace(/o\\//, 'g')");
    assert.deepEqual(actual, []);
  });

  it('should support passing a callback as the last argument', function() {
    const str = read('mixed.js');
    const actual = extract(str, function(comment) {
      comment.foo = 'bar';
      return comment;
    });
    assert.equal(actual[0].foo, 'bar');
  });
});

describe('block comments', function() {
  it('should throw an error when comment is not a string', function() {
    assert.throws(() => extract.block(), /expected a string/);
  });

  it('should return an empty array if no comments are found', function() {
    const str = 'foo';
    const actual = extract.block(str);
    assert.deepEqual(actual, []);
  });

  it('should take options as the second argument', function() {
    const str = 'foo';
    const actual = extract.block(str);
    assert.deepEqual(actual, []);
  });

  it('should extract a block comment', function() {
    const str = '/**\n * this is\n *\n * a comment\n*/\n\nvar foo = "bar";\n';
    const actual = extract(str);
    assert.equal(actual[0].value, '\nthis is\n\na comment');
  });

  it('should strip protected comments', function() {
    const str = read('mixed.js');
    const actual = extract.block(str);
    assert.equal(actual[0].value, '\nand this multiline\nblock comment');
  });

  it('should not extract comments in quoted strings', function() {
    const a = '/* this is a block comment */\n\nvar foo = "/* bar */"';
    const actual1 = extract(a);
    assert.equal(actual1.length, 1);
    assert.equal(actual1[0].value, 'this is a block comment');

    const b = '/* this is a block comment */\n\nvar foo = "abc /* bar */ xyz "';
    const actual2 = extract(b);
    assert.equal(actual2.length, 1);
    assert.equal(actual2[0].value, 'this is a block comment');
  });

  it('should extract comments in functions', function() {
    const a = 'function foo(/*a, b, c*/) {}';
    const actual = extract(a);
    assert.equal(actual[0].value, 'a, b, c');
  });

  it('should extract comments after quoted strings', function() {
    const a = '"some code"\n/**\n * some comment\n*/\n';
    const actual = extract(a);
    assert.equal(actual.length, 1);
  });

  it('should strip leading stars to create the "value" property', function() {
    const str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    const actual = extract(str);
    assert.equal(actual[0].value, '\nthis is\n\na comment');
  });

  it('should get the starting line number', function() {
    const str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    const actual = extract(str);
    assert.equal(actual[0].loc.start.line, 1);
  });

  it('should get the starting index', function() {
    const str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    const actual = extract(str);
    assert.equal(actual[0].loc.start.column, 0);
  });

  it('should get the ending line number', function() {
    const str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    const actual = extract(str);
    assert.equal(actual[0].loc.end.line, 5);
  });

  it('should get the ending index', function() {
    const str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n';
    const actual = extract(str);
    const loc = actual[0].loc;
    assert.equal(loc.end.column, 2);
  });
});

describe('code', function() {
  it('should get the first line of code after a comment', function() {
    const str = '/**\n * this is\n *\n * a comment\n*/var foo = "bar";\n// var one = two';
    const actual = extract(str);
    assert.equal(actual[0].code.value, 'var foo = "bar";');
  });

  it('should not get code context when disabled', function() {
    const str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n// var one = two';
    const actual = extract(str, { context: false });
    assert.equal(actual[0].code.value, '');
  });

  it('should get the first line of code multiple lines after a comment', function() {
    const str = '/**\n * this is\n *\n * a comment\n*/\n\n\nvar foo = "bar";\n// var one = two';
    const actual = extract(str);
    assert.equal(actual[0].code.value, 'var foo = "bar";');
  });

  it('should not get a comment following a comment', function() {
    const str = '/**\n * this is\n *\n * a comment\n*/\n// var one = two';
    const actual = extract(str);
    assert.equal(actual[0].code.value, '');
  });

  it('should get the code range', function() {
    const str = '/**\n * this is\n *\n * a comment\n*/\n\n\nvar foo = "bar";\n';
    const comments = extract(str);
    const code = comments[0].code;
    const expected = str.slice(code.range[0], code.range[1]);

    assert.equal(code.loc.start.column, 0);
    assert.equal(code.loc.end.column, 16);
    assert.equal(expected, 'var foo = "bar";');
  });

  it('should get comments after code', function() {
    const str = '/**\n * this is\n *\n * a comment\n*/var foo = "bar";\n/* foo */';
    const comments = extract(str);
    const comment = comments[1];
    const range = comments[0].code.range;
    assert.equal(comment.raw, ' foo ');
  });

  it('should get the code starting line number', function() {
    const str = '/**\n * this is\n *\n * a comment\n*/\n\n\n\n    var foo = "bar";\nfoo';
    const comments = extract(str);
    const code = comments[0].code;
    const start = code.loc.start.line;
    const lines = str.split('\n');
    assert.equal(lines[start - 1], code.value);
  });
});

describe('line comments', function() {
  it('should throw an error when comment is not a string', function() {
    assert.throws(() => extract.line(), /expected a string/);
  });

  it('should return an empty array if no comments are found', function() {
    const str = 'foo';
    const actual = extract.line(str);
    assert.deepEqual(actual, []);
  });

  it('should take options as the second argument', function() {
    const str = 'foo';
    const actual = extract.line(str);
    assert.deepEqual(actual, []);
  });

  it('should extract a line comment', function() {
    const str = '// this is a line comment\n\nvar foo = "bar";\n';
    const actual = extract(str);
    assert.equal(actual[0].raw, ' this is a line comment');
  });

  it('should not extract comments in quoted strings', function() {
    const a = '// this is a line comment\n\nvar foo = ". // \' \\ . // \' \\ .";\n';
    const actual1 = extract(a);
    assert.equal(actual1.length, 1);
    assert.equal(actual1[0].raw, ' this is a line comment');

    const b = '// this is a line comment\n\nvar foo = "// one two"';
    const actual2 = extract(b);
    assert.equal(actual2.length, 1);
    assert.equal(actual2[0].raw, ' this is a line comment');
  });

  it('should strip leading slashes to create the "value" property', function() {
    const str = '// this is a line comment\n\nvar foo = "bar";\n';
    const actual = extract(str);
    assert.equal(actual[0].value, 'this is a line comment');
  });

  it('should get the starting line number', function() {
    const str = '// this is a line comment\n\nvar foo = "bar";\n';
    const actual = extract(str);
    assert.equal(actual[0].loc.start.line, 1);
  });

  it('should get the starting index', function() {
    const str = '// this is a line comment\n\nvar foo = "bar";\n';
    const actual = extract(str);
    assert.equal(actual[0].loc.start.column, 0);
  });

  it('should get the ending line number', function() {
    const str = '// this is a line comment\n\nvar foo = "bar";\n';
    const actual = extract(str);
    assert.equal(actual[0].loc.end.line, 1);
  });

  it('should get the ending index', function() {
    const str = '// this is a line comment\n\nvar foo = "bar";\n';
    const actual = extract(str);
    assert.equal(actual[0].loc.end.column, 25);
  });
});

describe('first', function() {
  it('should throw an error when comment is not a string', function() {
    assert.throws(() => extract.first(), /expected a string/);
  });

  it('should extract the first block comment', function() {
    const str = '/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n/* baz */';
    const actual = extract.first(str);
    assert.equal(actual[0].value, '\nthis is\n\na comment');
  });

  it('should extract the first line comment', function() {
    const str = '// this is a comment\n\nvar foo = "bar";\n/* baz */';
    const actual = extract.first(str);
    assert.equal(actual[0].value, 'this is a comment');
  });

  it('should return an empty array if no comments are found', function() {
    const str = 'foo';
    const actual = extract.first(str);
    assert.deepEqual(actual, []);
  });
});
