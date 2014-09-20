/*!
 * extract-comments <https://github.com/jonschlinkert/extract-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');

var assert = require('assert');
var should = require('should');
var glob = require('globby');
var extract = require('..');

describe('.parseFiles():', function () {
  it('should read each file as a string and extract comments from the code.', function () {
    var name = glob.sync('test/fixtures/**/*.js')[0];
    var actual = extract('test/fixtures/**/*.js');

    actual.should.be.an.object;
    assert.equal(Object.keys(actual).length > 1, true)
    actual.should.have.property(name);
  });
});

