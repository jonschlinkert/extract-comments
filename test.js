/*!
 * extract-comments <https://github.com/jonschlinkert/extract-comments>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/* deps:mocha */
var should = require('should');
var context = require('code-context');
var extract = require('./');
var fs = require('fs');

function read(fp) {
  return fs.readFileSync(__dirname + '/fixtures/' + fp, 'utf8');
}

describe('extract comments from javascript', function () {
  it('should extract comments from a string.', function () {
    extract('/**\n * this is\n *\n * a comment\n*/\nvar foo = "bar";\n').should.eql({
      '1': {
        content: 'this is\n\na comment\n',
        begin: 1,
        end: 5,
        code: 'var foo = "bar";',
        codeStart: 6
      }
    });
  });

  it('should work with comments that have slashes.', function () {
    extract('/**\n * this /is/ a/ comment\n*/\nnext line\n').should.eql({
      '1': {
        content: 'this /is/ a/ comment\n',
        begin: 1,
        end: 3,
        code: 'next line',
        codeStart: 4
      }
    })
  });

  it('should take a callback to transform comments:', function () {
    var str = read('assemble.js');
    var comments = extract(str, function (comment) {
      comment.context = context(comment.code);
      return comment;
    });

    comments['1316'].context.should.eql([{
      begin: 1,
      type: 'property',
      receiver: 'module',
      name: 'exports',
      value: 'Assemble',
      string: 'module.exports',
      original: 'module.exports = Assemble;'
    }]);
  });

  it('should add starting and ending numbers for a comment:', function () {
    var str = read('assemble.js');
    var comments = extract(str);

    comments['1274'].begin.should.equal(1274);
    comments['1274'].end.should.equal(1289);
  });

  it('should add the `codeStart`, starting line number for code following a comment:', function () {
    var str = read('assemble.js');
    var comments = extract(str);
    comments['1274'].codeStart.should.equal(1291);
  });
});


describe("extract comments from Handlebars", function () {
  var str = read('body.hbs');
  var comments = extract(str, {
    filename: 'body.hbs'
  });

  it('a simple comment', function () {
    comments['1'].should.eql({
      begin: 1,
      end: 3,
      codeStart: 4,
      content: 'A comment without indent.\n',
      code: '{{>some-partial}}'
    });
  });

  it('a comment with indent content. Indents should be removed such that the smallest indent is 0', function () {
    comments['6'].should.eql({
      begin: 6,
      end: 10,
      codeStart: 11,
      content: 'A comment with indent ...\n\n    ... and an other larger indent\n',
      code: '{{#if definitions}}'
    });
  });

  it('a comment with indent content and delimiters', function () {
    comments['13'].should.eql({
        begin: 13,
        end: 15,
        codeStart: 16,
        content: 'Wholly indented comment\n    ',
        code: '    {{>json-schema/definitions}}'
      }
    );
  })
});
