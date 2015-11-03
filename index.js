'use strict';

var extend = require('extend-shallow');
var Block = require('./lib/block');
var Line = require('./lib/line');
var utils = require('./lib/utils');


/**
 * Get the first block comment from the given string
 */

function first(str) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  str = utils.normalize(str);
  if (!/^\/\*{1,2}!?/.test(str)) {
    return null;
  }
  var i = str.indexOf('*/');
  if (i === -1) return null;
  if (/['"\w]/.test(str[i + 2])) {
    return null;
  }
  return str.slice(0, i + 2);
}

/**
 * Get block and line comments from the given string
 */

function comments(str, options, fn) {
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

  var ranges = utils.getRanges(str);
  var opts = extend({}, options);
  str = utils.normalize(str);
  var arr = [];

  var start = findStart('/*');
  var end = findEnd('*/');
  var len = str.length;
  var startIdx = start(str, 0);
  var endIdx = 0, prevIdx;

  while (startIdx !== -1 && endIdx < len) {
    endIdx = end(str, startIdx, len);
    if (endIdx === -1) break;

    var quoted = utils.isQuotedString(startIdx, ranges);
    if (quoted) {
      startIdx = endIdx;
      continue;
    }

    if (typeof prevIdx === 'number' && opts.line !== false) {
      if (typeof opts.combine === 'undefined') {
        opts.combine = true;
      }
      var nonblock = str.slice(prevIdx, startIdx);
      var lineComments = line(nonblock, opts, fn);
      arr = arr.concat(lineComments);
    }

    var comment = fn(new Block(str, startIdx, endIdx));
    arr.push(comment);
    if (opts.first && arr.length === 1) {
      return arr;
    }

    prevIdx = endIdx + 2;
    startIdx = start(str, prevIdx);
    if (startIdx >= len) break;
  }

  if (!arr.length) {
    return line(str, opts, fn);
  }
  return arr;
}
/**
 * Get block comments from the given string
 */

function block(str, fn) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }
  return comments(str, {line: false}, fn);
}

/**
 * Get line comments from the given string
 */

function line(str, options, fn) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  str = utils.normalize(str);
  var comments = [];

  if (typeof options === 'function') {
    fn = options;
    options = {};
  }

  if (typeof fn !== 'function') {
    fn = utils.identity;
  }

  var ranges = utils.getRanges(str);
  var opts = extend({}, options);
  var combine = opts.combine === true;
  var start = findStart('//');
  var end = findEnd('\n');
  var len = str.length;
  var startIdx = start(str, 0);
  var endIdx = 0, prev;
  var stacked = null;

  while (startIdx !== -1 && endIdx < len) {
    if (startIdx >= len || endIdx >= len) {
      break;
    }

    endIdx = end(str, startIdx, len);
    if (endIdx === -1) {
      endIdx = len;
    }

    var quoted = utils.isQuotedString(startIdx, ranges);
    var comment = new Line(str, startIdx, endIdx);

    startIdx = start(str, endIdx);
    if (quoted) {
      startIdx = endIdx + 1;
      continue;
    }

    if (prev && combine && isStacked(comment, prev, opts)) {
      var curr = comment.loc.end.line;
      var last = comments[comments.length - 1];
      prev = merge(str, comment, prev);
      if (last && prev.start === last.start) {
        comments.pop();
      }
      prev.loc.start.line = curr;
      stacked = prev;
      continue;
    }

    if (stacked) {
      comments.push(fn(stacked));
      stacked = null;
    }

    comment = fn(comment);
    prev = comment;
    comments.push(comment);
  }

  if (stacked) {
    comments.push(fn(stacked));
  }
  return comments;
}

/**
 * Returns a function for getting the index the
 * given "end" character(s)
 *
 * @param {String} endChars
 */

function findStart(startChars) {
  return function(str, idx) {
    var i = str.indexOf(startChars, idx);
    var prev = str[i - 1];

    if (prev && /['"\w]/.test(prev)) {
      i = str.indexOf(startChars, i + 1);
      prev = str[i - 1];
    }
    return i;
  };
}

/**
 * Returns a function for getting the index the
 * given "end" character(s)
 *
 * @param {String} endChars
 */

function findEnd(endChars) {
  return function(str, start) {
    var idx = str.indexOf(endChars, start + 2);
    var ch = str[idx + 2];
    while (ch && /['"]/.test(ch)) {
      idx = str.indexOf(endChars, idx + 2);
      ch = str[idx + 2];
    }
    return idx;
  };
}

/**
 * Returns true if the previous line was a line comment.
 */

function isStacked(comment, prev) {
  var prevLine = prev.loc.start.line;
  var line = comment.loc.end.line;
  return line === prevLine + 1;
}

/**
 * Merge line comments
 */

function merge(str, curr, prev) {
  var i = prev.loc.start.pos;
  var end = curr.loc.end.pos;
  return new Line(str, i, end);
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
