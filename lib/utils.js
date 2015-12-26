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

require('cr');
require('strip-bom-string', 'bom');
require('quoted-string-regex', 'quotesRegex');
require('parse-code-context', 'codeContext');
require('noncharacters', 'nonchar');
require('extend-shallow', 'extend');
require = fn;

/**
 * Normalize newlines, strip carriage returns and
 * byte order marks from `str`
 */

utils.normalize = function(str) {
  return utils.cr(utils.bom(str));
};

/**
 * Return the given value unchanged
 */

utils.identity = function(val) {
  return val;
};

/**
 * Get the total number of lines from the start
 * of a string to the given index.
 */

utils.linesCount = function(str, i) {
  if (typeof i === 'number') {
    return str.slice(0, i).split('\n').length;
  }
  return str.split('\n').length;
};

/**
 * Utility for getting a sequence of non-characters. The
 * goal is to return a non-character string that is the
 * same length as the characters we're replacing.
 *
 * http://www.unicode.org/faq/private_use.html#noncharacters
 */

function ch(num) {
  return utils.nonchar[num] + utils.nonchar[num];
}

/**
 * Escaped comment characters in quoted strings
 *
 * @param {String} str
 * @return {String}
 */

utils.escapeQuoted = function(str) {
  return str.replace(utils.quotesRegex(), function(val) {
    val = val.split('//').join(ch(0));
    val = val.split('/*').join(ch(1));
    val = val.split('*/').join(ch(2));
    return val;
  });
};

/**
 * Restore comment characters in quoted strings
 *
 * @param {String} str
 * @return {String}
 */

utils.restore = function(str) {
  return str.replace(utils.quotesRegex(), function(val) {
    val = val.split(ch(0)).join('//');
    val = val.split(ch(1)).join('/*');
    val = val.split(ch(2)).join('*/');
    return val;
  });
};

/**
 * Strip stars from the beginning of each comment line.
 *
 * @param {String} `str`
 * @return {String}
 */

utils.stripStars = function(str) {
  str = str.replace(/^[\/* ]*|[\/* ]*$/g, '');
  str = str.replace(/^ *[\/*]/gm, '');
  var m = /(?:^|\n)([ \t]*)[^\s]/.exec(str);
  if (m) {
    str = str.replace(new RegExp('(^|\\n)' + m[1], 'g'), '$1');
  }
  str = str.replace(/^ *@(?=[^\s])/gm, '@');
  return str.replace(/\s+$/, '');
};

/**
 * Expose `utils`
 */

module.exports = utils;
