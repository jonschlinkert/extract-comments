'use strict';

var utils = require('./utils');
var Code = require('./code');

/**
 * Create a new BlockComment with:
 *   - `str` the entire string
 *   - `idx` the starting index of the comment
 *   - `end` the ending index of the comment
 *   - `open` the opening character(s) of the comment
 *   - `close` the closing character(s) of the comment
 */

function BlockComment(str, idx, end, open, close) {
  var cl = close.length;
  var lineno = utils.linesCount(str, idx);
  var value = utils.restore(str.slice(idx, end + cl));

  this.type = 'block';
  this.raw = value;
  this.value = utils.stripStars(value);

  this.loc = {
    start: {
      line: lineno,
      pos: idx
    },
    end: {
      line: lineno + utils.linesCount(value) - 1,
      pos: end + cl
    }
  };

  /**
   * Add code context
   */

  this.code = new Code(str, this);
}

/**
 * expose `BlockComment`
 */

module.exports = BlockComment;
