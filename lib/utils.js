'use strict';

var cr = require('cr');
var bom = require('strip-bom-string');
var quotesRegex = require('quoted-string-regex');
var nonchar = require('noncharacters');

/**
 * Expose `utils`
 */

var utils = module.exports;

/**
 * Normalize newlines, strip carriage returns and
 * byte order marks from `str`
 */

utils.normalize = function(str) {
  return cr(bom(str));
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
  return nonchar[num] + nonchar[num];
}

/**
 * Escaped comment characters in quoted strings
 *
 * @param {String} str
 * @return {String}
 */

utils.escapeQuoted = function(str) {
  return str.replace(quotesRegex(), function(val) {
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
  return str.replace(quotesRegex(), function(val) {
    val = val.split(ch(0)).join('//');
    val = val.split(ch(1)).join('/*');
    val = val.split(ch(2)).join('*/');
    return val;
  });
};

/**
 * Strip stars from the beginning of each comment line,
 * and strip whitespace from the end of each line. We
 * can't strip whitespace from the beginning since comments
 * use markdown or other whitespace-sensitive formatting.
 *
 * @param {Array} `lines`
 * @return {Array}
 */

utils.strip = function(lines) {
  var len = lines.length, i = -1;
  var res = [];

  while (++i < len) {
    var line = lines[i].replace(/^\s*[*\/]+\s?|\s+$/g, '');
    if (!line) continue;
    res.push(line);
  }
  return res;
};
