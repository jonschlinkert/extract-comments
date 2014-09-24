/*!
 * extract-comments <https://github.com/jonschlinkert/extract-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var assert = require('assert');
var should = require('should');
var extract = require('./');

describe('.extract():', function () {
  it('should read each file as a string and extract comments from the code.', function () {
    var actual = extract.fromFiles('fixtures/**/*.js');

    actual.should.be.an.object;
    actual.should.have.property('fixtures/assemble.js');
    actual['fixtures/assemble.js'].should.have.property('122', {
      begin: 122,
      comment: '\nInitialize default configuration.\n\n@api private\n',
      end: 126,
      type: 'comment'
    });
  });
});

