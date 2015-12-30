'use strict';

/**
 * Utils
 */

var utils = module.exports;

/**
 * Create regex for matching JavaScript linting config comments.
 *
 * @param {Array} `vendors`
 * @return {RegExp}
 */

utils.toPrefixRegex = function(vendors) {
  var prefixes = '(' + vendors.join('|') + ')';
  return new RegExp('^' + prefixes);
};

/**
 * Trim trailing whitespace
 *
 * @param {String} `str`
 * @return {String}
 */

utils.trimRight = function(str) {
  return str.replace(/\s+$/, '');
};

/**
 * Strip stars from the beginning of each comment line.
 *
 * @param {String} `str`
 * @return {String}
 */

utils.stripStars = function(str) {
  str = str.replace(/^[ \t]/gm, '');
  str = str.replace(/^[ \t]*\*[ \t]?/gm, '');
  return utils.trimRight(str);
};

/**
 * Expose `utils`
 */

module.exports = utils;
