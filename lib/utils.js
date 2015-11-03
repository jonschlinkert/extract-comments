'use strict';

var cr = require('cr');
var bom = require('strip-bom-string');
var quotesRe = require('quoted-string-regex');
var repeat = require('repeat-string');
var range = require('to-regex-range');
var cache = {};

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
  if (cache[str]) return cache[str];
  var re = quotesRe();
  var ranges = [];
  var m;

  while (m = re.exec(str)) {
    var regex = utils.toRange(m.index, m.index + m[0].length);
    ranges.push({
      regex: regex,
      index: m.index,
      match: m,
    });
  }
  cache[str] = ranges;
  return ranges;
};

utils.toRange = function (a, b) {
  return new RegExp(range(a, b));
};

utils.isQuotedString = function (num, ranges) {
  var len = ranges.length, i = -1;
  if (len === 0) return false;
  var m;

  while (++i < len) {
    var range = ranges[i];
    var re = range.regex;
    if (re.test(num.toString())) {
      return range;
    }
  }
  return false;
};
