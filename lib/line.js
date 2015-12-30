'use strict';

var Position = require('./position');
var utils = require('./utils');

/**
 * Create a new LineComment with:
 *   - `str` the entire string
 *   - `idx` the starting index of the comment
 *   - `end` the ending index of the comment
 *   - `options`
 *     * `options.open` the opening character(s) of the comment (e.g. '//')
 *     * `options.close` the closing character(s) of the comment (e.g. '\n')
 */

function LineComment(str, idx, end, options) {
  var opts = utils.extend({ open: '//', close: '\n' }, options);
  this.type = 'line';
  this.loc = new Position(str, idx, end, opts);
  this.raw = opts.value || str.slice(this.loc.start.pos, this.loc.end.pos);
  this.value = this.raw.replace(/^[ \t]*\/\/[ \t]*/, '');
}

/**
 * expose `LineComment`
 */

module.exports = LineComment;
