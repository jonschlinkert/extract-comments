'use strict';

/**
 * Create a new LineComment.
 *
 * @param {String} `str` string of JavaScript
 * @param {Object} `token` Parsed AST token
 */

function LineComment(str, token) {
  this.type = token.type;
  this.range = token.range;
  this.loc = token.loc;
  this.raw = token.value;
  this.value = this.raw.trim();
}

/**
 * expose `LineComment`
 */

module.exports = LineComment;
