'use strict';

var cr = require('cr');
var bom = require('strip-bom-string');
var BlockComment = require('./lib/block');

function normalize(str) {
  return cr(bom(str));
}

function extractLine(str) {
  str = normalize(str);
  var len = str.length;
  var end = 0, i = 0, n = 0;
  var comments = [];

  do {
    i = str.indexOf('//', n);
    var prev = str[i - 1];

    if (prev && /['"\w]/.test(prev)) {
      i = str.indexOf('//', i + 1);
      prev = str[i - 1];
    }

    if (i === -1) break;
    var end = str.indexOf('\n', i + 2);
    if (end === -1) end = len;

    var comment = str.slice(i, end);
    comments.push(new BlockComment(comment, i, end, 'line'));
    n = end + 2;

  } while (i !== -1 && end < len);
  return comments;
}

function extract(str) {
  str = normalize(str);

  var len = str.length;
  var end = 0, i = 0, n = 0;
  var comments = [];

  do {
    i = startIndex(str, n);
    if (i === -1) break;

    end = str.indexOf('*/', i + 2);
    end = endIndex(str, end, len);

    var comment = new BlockComment(str, i, end);
    comments.push(comment);
    n = end + 2;

  } while (i !== -1 && end < len);

  return comments;
}

function startIndex(str, idx) {
  var i = str.indexOf('/*', idx);
  var prev = str[i - 1];

  if (prev && /['"\w]/.test(prev)) {
    i = str.indexOf('/*', i + 1);
    prev = str[i - 1];
  }
  return i;
}

function endIndex(str, idx, len) {
  var i = str[idx + 2];
  while (i && /['"]/.test(i)) {
    idx = str.indexOf('*/', idx + 2);
    i = str[idx + 2];
  }
  if (idx === -1) idx = len;
  return idx;
}

/**
 * Expose `extract` module
 */

module.exports = extract;

/**
 * Expose `extract.line` method
 */

module.exports.line = extractLine;
