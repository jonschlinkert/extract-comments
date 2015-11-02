'use strict';

var cr = require('cr');
var bom = require('strip-bom-string');
var Block = require('./lib/block');
var Line = require('./lib/line');
var utils = require('./lib/utils');

function normalize(str) {
  return cr(bom(str));
}

// function line(str) {
//   str = normalize(str);
//   var len = str.length;
//   var end = 0, i = 0, n = 0;
//   var comments = [];

//   do {
//     i = str.indexOf('//', n);
//     var prev = str[i - 1];

//     if (prev && /['"\w]/.test(prev)) {
//       i = str.indexOf('//', i + 1);
//       prev = str[i - 1];
//     }

//     if (i === -1) break;
//     var end = str.indexOf('\n', i + 2);
//     if (end === -1) end = len;

//     var comment = str.slice(i, end);
//     comments.push(new Block(comment, i, end, 'line'));
//     n = end + 2;

//   } while (i !== -1 && end < len);
//   return comments;
// }

function line(str, opts, fn) {
  str = normalize(str);

  if (typeof opts === 'function') {
    fn = opts;
    opts = {};
  }

  if (typeof fn !== 'function') {
    fn = utils.identity;
  }

  var comments = [];
  var start = findStart('//');
  var end = findEnd('\n');
  var len = str.length;
  var startIdx = start(str, 0);
  var endIdx = 0;

  while (startIdx !== -1 && endIdx < len) {
    endIdx = end(str, startIdx, len);
    if (endIdx === -1) endIdx = len;

    var comment = fn(new Line(str, startIdx, endIdx));

    comments.push(comment);
    startIdx = start(str, endIdx);
  }
  return comments;
}

function block(str, fn) {
  return comments(str, {line: false}, fn);
}

function comments(str, opts, fn) {
  if (typeof opts === 'function') {
    fn = opts;
    opts = {};
  }

  str = normalize(str);
  var comments = [];

  var start = findStart('/*');
  var end = findEnd('*/');
  var len = str.length;
  var startIdx = start(str, 0);
  var endIdx = 0, prevIdx;

  if (typeof fn !== 'function') {
    fn = utils.identity;
  }

  while (startIdx !== -1 && endIdx < len) {
    if (typeof prevIdx === 'number' && opts.line !== false) {
      var nonblock = str.slice(prevIdx, startIdx);
      console.log(nonblock)
      var lineComments = line(nonblock, fn, opts);
      comments = comments.concat(lineComments);
    }

    endIdx = end(str, startIdx, len);
    if (endIdx === -1) break;

    var comment = fn(new Block(str, startIdx, endIdx));
    comments.push(comment);

    prevIdx = endIdx + 2;
    startIdx = start(str, prevIdx);
  }
  return comments;
}

function findStart(ch) {
  return function(str, idx) {
    var i = str.indexOf(ch, idx);
    var prev = str[i - 1];

    if (prev && /['"\w]/.test(prev)) {
      i = str.indexOf(ch, i + 1);
      prev = str[i - 1];
    }
    return i;
  };
}

function findEnd(ch) {
  return function(str, start, len) {
    var idx = str.indexOf(ch, start + 2);
    var i = str[idx + 2];
    while (i && /['"]/.test(i)) {
      idx = str.indexOf(ch, idx + 2);
      i = str[idx + 2];
    }
    return idx;
  };
}

/**
 * Expose `extract` module
 */

module.exports = comments;

/**
 * Expose `extract.block` method
 */

module.exports.block = block;

/**
 * Expose `extract.line` method
 */

module.exports.line = line;
