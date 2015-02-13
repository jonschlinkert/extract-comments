/*!
 * extract-comments <https://github.com/jonschlinkert/extract-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var should = require('should');
var extract = require('./');
var fs = require('fs');

function read(fp) {
  return fs.readFileSync(__dirname + '/fixtures/' + fp, 'utf8');
}

describe('extract comments', function () {
  it('should extract comments from a string.', function () {
    extract('/**\n * this is a comment\n*/\nnext line\n').should.eql({
      '1': {
        comment: 'this is a comment\n',
        begin: 1,
        end: 3,
        type: 'comment',
        after: 'next line'
      }
    })
  });

  it('should take a callback to transform comments:', function () {
    var str = read('assemble.js');
    var comments = extract(str, function (comment) {
      comment.after = comment.after.toUpperCase();
      return comment;
    });

    comments['1316'].after.should.equal('MODULE.EXPORTS = ASSEMBLE;');
  });
});

describe('.fromFiles()', function () {
  it('should extract comments from a file.', function () {
    var actual = extract.fromFiles('fixtures/**/*.js');

    actual.should.be.an.object;
    actual.should.have.property('fixtures/assemble.js');

    var comment = actual['fixtures/assemble.js'];
    comment.should.have.property('122');
    comment['122'].should.have.property('begin', 122);
    comment['122'].should.have.property('end', 126);
    comment['122'].should.have.property('type', 'comment');
    comment['122'].should.have.property('comment', 'Initialize default configuration.\n\n@api private\n');
    comment['122'].should.have.property('after', 'Assemble.prototype.defaultConfig = function (opts) {');
  });

  it('should take a cwd.', function () {
    var actual = extract.fromFiles('*.js', {cwd: 'fixtures'});
    actual.should.be.an.object;
    actual.should.have.property('fixtures/assemble.js');

    var comment = actual['fixtures/assemble.js']
    comment.should.have.property('122');
    comment['122'].should.have.property('begin', 122);
    comment['122'].should.have.property('end', 126);
    comment['122'].should.have.property('type', 'comment');
    comment['122'].should.have.property('comment', 'Initialize default configuration.\n\n@api private\n');
    comment['122'].should.have.property('after', 'Assemble.prototype.defaultConfig = function (opts) {');
  });
});