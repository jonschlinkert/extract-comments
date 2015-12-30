/*!
 * extract-comments <https://github.com/jonschlinkert/extract-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var extend = require('extend-shallow');
var Comments = require('./lib/comments');

/**
 * Extract comments from the given `string`.
 *
 * ```js
 * extract(str, options);
 * ```
 * @param {String} `string`
 * @param {Object} `options` Pass `first: true` to return after the first comment is found.
 * @return {String}
 * @api public
 */

function extract(str, options, fn) {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }
  var extracted = new Comments(options, fn);
  var res = extracted.extract(str);
  return res.comments || [];
}

/**
 * Extract block comments from the given `string`.
 *
 * ```js
 * extract.block(str, options);
 * ```
 * @name .block
 * @param {String} `string`
 * @param {Object} `options` Pass `first: true` to return after the first comment is found.
 * @return {String}
 * @api public
 */

function block(str, options) {
  return extract(str, extend({line: false}, options));
}

/**
 * Extract line comments from the given `string`.
 *
 * ```js
 * extract.line(str, options);
 * ```
 * @name .line
 * @param {String} `string`
 * @param {Object} `options` Pass `first: true` to return after the first comment is found.
 * @return {String}
 * @api public
 */

function line(str, options) {
  return extract(str, extend({block: false}, options));
}

/**
 * Extract the first comment from the given `string`.
 *
 * @name .first
 * @param {String} `string`
 * @param {Object} `options` Pass `first: true` to return after the first comment is found.
 * @return {String}
 * @api public
 */

function first(str) {
  return extract(str, {first: true});
}

/**
 * Expose `extract`
 */

module.exports = extract;

/**
 * Expose convenience methods
 */

module.exports.block = block;
module.exports.line = line;
module.exports.first = first;

/**
 * Expose `Comments` constructor, to
 * allow custom plugins to be registered.
 */

module.exports.Comments = Comments;
