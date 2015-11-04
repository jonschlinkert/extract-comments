'use strict';

var utils = require('./utils');

/**
 * Create a new LineComment with:
 *   - `str` the entire string
 *   - `idx` the starting index of the comment
 *   - `end` the ending index of the comment
 *   - `open` the opening character(s) of the comment (e.g. '//')
 *   - `close` the closing character(s) of the comment (e.g. '\n')
 */

function LineComment(str, idx, end, open, close) {
  var lineno = utils.linesCount(str, idx);
  var value = utils.restore(str.slice(idx, end));

  this.type = 'line';
  this.raw = value;
  this.value = this.raw.replace(/^\s*[\/\s]+/, '');

  this.loc = {
    start: {
      line: lineno,
      pos: idx
    },
    end: {
      line: lineno + utils.linesCount(value) - 1,
      pos: end
    }
  };
}

/**
 * expose `LineComment`
 */

module.exports = LineComment;
