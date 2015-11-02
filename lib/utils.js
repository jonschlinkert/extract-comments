'use strict';

var cr = require('cr');
var bom = require('strip-bom-string');

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
  return val
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
