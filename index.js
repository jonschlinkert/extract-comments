'use strict';

var extend = require('extend-shallow');
var Block = require('./lib/block');
var Line = require('./lib/line');
var utils = require('./lib/utils');
var cache = {};

/**
 * Get block comments from the given string
 */

function comments(str, fn) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  var block = blockComments(str, fn);
  var line = lineComments(str, fn);
  return block.concat(line).sort(function(a, b) {
    return a.loc.start.pos - b.loc.start.pos;
  });
}

/**
 * Get block and line comments from the given string
 */

function blockComments(str, options, fn) {
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

  var opts = extend({}, options);
  str = utils.normalize(str);
  str = utils.escapeQuoted(str, cache);

  var arr = [];
  var start = findStart('/*');
  var end = findEnd('*/');
  var len = str.length;
  var startIdx = start(str, 0);
  var endIdx = 0;

  while (startIdx !== -1) {
    endIdx = end(str, startIdx, len);
    if (endIdx === -1) {
      endIdx = len;
    }

    var comment = fn(new Block(str, startIdx, endIdx, cache));
    arr.push(comment);
    if (opts.first && arr.length === 1) {
      return arr;
    }

    if (comment.code.value) {
      endIdx += comment.code.value.length;
    }
    startIdx = start(str, endIdx + 2);
  }
  return arr;
}

/**
 * Get line comments from the given string
 */

function lineComments(str, options, fn) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  str = utils.normalize(str);
  str = utils.escapeQuoted(str, cache);
  var comments = [];

  if (typeof options === 'function') {
    fn = options;
    options = {};
  }

  if (typeof fn !== 'function') {
    fn = utils.identity;
  }

  var opts = extend({}, options);
  var combine = opts.combine === true;
  var start = findStart('//');
  var end = findEnd('\n');
  var len = str.length;
  var startIdx = start(str, 0);
  var endIdx = 0, prev;
  var stacked = null;

  while (startIdx !== -1) {
    if (startIdx >= len) {
      break;
    }

    endIdx = end(str, startIdx, len);
    if (endIdx === -1 || endIdx > len) {
      endIdx = len;
    }

    var comment = new Line(str, startIdx, endIdx);
    startIdx = start(str, endIdx);

    if (prev && combine && isStacked(comment, prev, opts, cache)) {
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

module.exports.block = blockComments;

/**
 * Expose `extract.line` method
 */

module.exports.line = lineComments;
