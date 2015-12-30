'use strict';

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

  var blocks = block(str, options, fn);
  var lines = line(str, options, fn);

  blocks = blocks.concat(lines);
  return blocks.sort(compare);
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
  var comments = factory(Block, { open: '/*', close: '*/' });
  return comments(str, options, fn);
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
  var comments = factory(Line, { open: '//', close: '\n' });
  return comments(str, options, fn);
}

/**
 * Factory for extracting comments from a string.
 *
 * @param {String} `string`
 * @return {String}
 */

function factory(Ctor, config) {
  config = config || {};
  var open = config.open;
  var close = config.close;

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

    // shallow clone options
    var opts = utils.extend({}, options);

    // normalize newlines and strip BOM
    str = utils.normalize(str);
    // str = utils.escapeQuoted(str);

    var comments = [];
    var start = str.indexOf(open);
    var end = str.indexOf(close, start);
    var len = str.length;
    if (end === -1) {
      end = len;
    }

    while (start !== -1 && end <= len) {
      var prev = str.charAt(start - 1);

      // commentspect escaped slashes and urls
      if (prev !== '\\' && prev !== ':') {
        var comment = new Ctor(str, start, end, open, close);
        comments.push(fn(comment));
      }

      if (opts.first && comments.length === 1) {
        return comments;
      }

      start = str.indexOf(open, end + close.length);
      end = str.indexOf(close, start);
      if (end === -1) {
        end = len;
      }
    }

    return comments;
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
