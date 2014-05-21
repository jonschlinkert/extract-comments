var file = require('fs-utils');
var expect = require('chai').expect;
var extract = require('../');

var fixtures = 'test/fixtures/**/*.js';

describe('when extract-comments is passed an array of file paths:', function () {
  it('should read each file as a string and extract comments from the code.', function () {
    var files = file.find(fixtures);
    var firstFileName = file.basename(files[0]);
    var actual = extract(fixtures);

    expect(actual).to.be.an('object');
    expect(Object.keys(actual)).to.have.length.above(1);
    expect(actual).to.have.property(firstFileName);
  });
});

describe('when true is passed as a second parameter', function () {
  it('should generate an array, instead of an object', function () {
    var actual = extract(fixtures, true);
    expect(actual).to.be.an('array');
    expect(actual).to.have.length.above(1);
  });
});