'use strict';

/**
 * Utils
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('define-property', 'define');
require('extend-shallow', 'extend');
require('parse-code-context', 'codeContext');
require('use');
require = fn;

/**
 * Return the given value unmodified
 *
 * @param {any} val
 */

utils.identity = function(val) {
  return val;
};

/**
 * Create regex for matching JavaScript linters
 *
 * @param {Array} `linters`
 * @return {RegExp}
 */

utils.toPrefixRegex = function(linters) {
  var prefixes = '(' + linters.join('|') + ')';
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
 * Strip backticks
 */

utils.stripBackticks = function(str) {
  return str.replace(/^[\s`]+|[\s`]+$/g, '');
};

/**
 * Convert newlines to spaces.
 */

utils.stripNewlines = function(str) {
  if (utils.typeOf(str) === 'object') {
    var obj = str;
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = utils.stripNewlines(obj[key]);
      }
    }
    return obj;
  }
  return str.replace(/\n+/g, ' ').trim();
};

// Sourced from https://github.com/visionmedia/dox
utils.stripIndent = function(str) {
  var m = /(?:^|\n)([ \t]*)[^\s]/.exec(str);
  if (!m) return str;
  return str.replace(new RegExp('(^|\\n)' + m[1], 'g'), '$1');
};

/**
 * Strip slashes from the beginning of each line comment.
 *
 * @param {String} `str`
 * @return {String}
 */

utils.stripSlashes = function(str) {
  return str.replace(/^[ \t]*\/\/[ \t]*/, '');
};

/**
 * Strip stars from the beginning of each comment line.
 *
 * @param {String} `str`
 * @return {String}
 */

utils.stripStars = function(str) {
  str = str.replace(/^[\/* \t]*|[\/* \t]+$/g, '');
  str = str.replace(/^[ \t]*[\/*][^\/]/gm, '');
  str = utils.stripIndent(str);
  str = str.replace(/^[ \t]*@(?=[^\s])/gm, '@');
  return utils.trimRight(str);
};

/**
 * Expose `utils`
 */

module.exports = utils;
