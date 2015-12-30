'use strict';

var utils = require('./utils');

/**
 * Create a new BlockComment
 *
 * @param {String} `str` string of JavaScript
 * @param {Object} `token` Parsed AST token
 */

function BlockComment(str, token) {
  this.type = token.type;
  this.range = token.range;
  this.loc = token.loc;
  this.raw = token.value;
  this.value = utils.stripStars(this.raw);
}

/**
 * expose `BlockComment`
 */

module.exports = BlockComment;
