'use strict';

var utils = require('./utils');

function Position(str, startIdx, endIdx, opts) {
  var lineno = opts.startLine || utils.linesCount(str, startIdx);
  var close = opts.close;

  var cl = close.length;
  var value = str.slice(startIdx, endIdx + cl);

  this.start = {
    line: lineno,
    pos: startIdx
  };

  this.end = {
    line: opts.endLine || (lineno + utils.linesCount(value) - 1),
    pos: endIdx + cl
  };
}

/**
 * Expose `Position`
 */

module.exports = Position;
