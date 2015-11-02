'use strict';

var cr = require('cr');
var bom = require('strip-bom-string');
var quotedStringRegex = require('quoted-string-regex');
var repeat = require('repeat-string');
var range = require('to-regex-range');

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

utils.getRanges = function (str) {
  var re = quotedStringRegex();
  var m, ranges = [];

  while (m = re.exec(str)) {
    var len = m[0].length;
    ranges.push(new RegExp(range(m.index, m.index + len)));
    var filler = repeat(' ', len);
    str = str.replace(m[0], filler);
  }
  return ranges;
};

utils.isQuotedString = function (num, ranges) {
  var len = ranges.length, i = -1;
  if (len === 0) return false;

  while (++i < len) {
    var re = ranges[i];
    if (re.test(num.toString())) {
      return true;
    }
  }
  return false;
};
