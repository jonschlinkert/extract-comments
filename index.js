'use strict';

var extend = require('extend-shallow');
var Block = require('./lib/block');
var Line = require('./lib/line');
var utils = require('./lib/utils');

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

function comments(str, options, fn) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }
  return block(str, options, fn)
    .concat(line(str, options, fn))
    .sort(compare);
}

/**
 * Extract block comments from the given `string`.
 *
 * ```js
 * extract.block(str, options);
 * ```
 * @param {String} `string`
 * @param {Object} `options` Pass `first: true` to return after the first comment is found.
 * @return {String}
 * @api public
 */

function block(str, options, fn) {
  return factory('/*', '*/', Block)(str, options, fn);
}

/**
 * Extract line comments from the given `string`.
 *
 * ```js
 * extract.line(str, options);
 * ```
 * @param {String} `string`
 * @param {Object} `options` Pass `first: true` to return after the first comment is found.
 * @return {String}
 * @api public
 */

function line(str, options, fn) {
  return factory('//', '\n', Line)(str, options, fn);
}

/**
 * Factory for extracting comments from a string.
 *
 * @param {String} `string`
 * @return {String}
 */

function factory(open, close, Ctor) {
  return function(str, options, fn) {
    if (typeof str !== 'string') {
      throw new TypeError('expected a string');
    }

    if (typeof options === 'function') {
      fn = options;
      options = {};
    }

    if (typeof fn !== 'function') {
      fn = utils.identity;
    }

    var opts = extend({}, options);
    str = utils.normalize(str);
    str = utils.escapeQuoted(str);

    var res = [];
    var start = str.indexOf(open);
    var end = str.indexOf(close, start);
    var len = str.length;
    if (end === -1) {
      end = len;
    }

    while (start !== -1 && end <= len) {
      var comment = fn(new Ctor(str, start, end, open, close));
      res.push(comment);
      if (opts.first && res.length === 1) {
        return res;
      }
      start = str.indexOf(open, end + 1);
      end = str.indexOf(close, start);
      if (end === -1) {
        end = len;
      }
    }
    return res;
  };
}

/**
 * Extract the first comment from the given `string`.
 *
 * @param {String} `string`
 * @param {Object} `options` Pass `first: true` to return after the first comment is found.
 * @return {String}
 * @api public
 */

function first(str) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  var arr = comments(str, {first: true});
  if (arr && arr.length) {
    return arr[0].raw;
  } else {
    return null;
  }
}

/**
 * Utility for sorting line and block comments into
 * the correct order.
 */

function compare(a, b) {
  return a.loc.start.pos - b.loc.start.pos;
}

/**
 * Expose `extract` module
 */

module.exports = comments;

/**
 * Expose `extract.first` method
 */

module.exports.first = first;

/**
 * Expose `extract.block` method
 */

module.exports.block = block;

/**
 * Expose `extract.line` method
 */

module.exports.line = line;

/**
 * Expose `extract.factory` method
 */

module.exports.factory = factory;
