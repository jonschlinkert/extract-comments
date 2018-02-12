/*!
 * extract-comments <https://github.com/jonschlinkert/extract-comments>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

const Extractor = require('./lib/extractor');

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
  const extractor = new Extractor(options, fn);
  return extractor.extract(str);
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

extract.block = (str, options) => {
  return extract(str, Object.assign({ line: false }, options));
};

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

extract.line = (str, options) => {
  return extract(str, Object.assign({ block: false }, options));
};

/**
 * Extract the first comment from the given `string`.
 *
 * @name .first
 * @param {String} `string`
 * @param {Object} `options` Pass `first: true` to return after the first comment is found.
 * @return {String}
 * @api public
 */

extract.first = str => extract(str, { first: true });

/**
 * Expose `Extractor` constructor, to
 * allow custom plugins to be registered.
 */

extract.Extractor = Extractor;

/**
 * Expose `extract`
 */

module.exports = extract;
