'use strict';

var Position = require('./position');
var utils = require('./utils');
var Code = require('./code');

/**
 * Create a new BlockComment with:
 *   - `str` the entire string
 *   - `idx` the starting index of the comment
 *   - `end` the ending index of the comment
 *   - `options`
 *     * `options.open` the opening character(s) of the comment (e.g. '//')
 *     * `options.close` the closing character(s) of the comment (e.g. '\n')
 */

function BlockComment(str, idx, end, options) {
  var opts = utils.extend({ open: '/*', close: '*/'}, options);

  this.type = 'block';
  this.loc = new Position(str, idx, end, opts);
  this.raw = opts.value || str.slice(this.loc.start.pos, this.loc.end.pos);
  this.value = utils.stripStars(this.raw);

  // console.log(this.value)

  /**
   * Code context
   */

  if (opts.context !== false) {
    this.code = new Code(str, this, opts);
  } else {
    this.code = {context: {}};
  }
}

/**
 * expose `BlockComment`
 */

module.exports = BlockComment;
