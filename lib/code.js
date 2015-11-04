'use strict';

var codeContext = require('parse-code-context');
var isWhitespace = require('is-whitespace');
var utils = require('./utils');

function Code(str, comment) {
  str = utils.restore(str);
  var start = comment.loc.end.pos;
  var endLine = comment.loc.end.line;
  var orig = str;

  str = str.slice(start);
  var slen = str.length, idx = -1;
  var chars, lines = 0;

  var arr = str.split('\n');
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    var ctx = codeContext(arr[i], endLine + i);
    if (ctx) {
      res = ctx;
      break;
    }
  }
  console.log(res)


  while (++idx < slen) {
    var ch = str[idx];
    if (idx === 0 && /^\W/.test(ch)) {
      continue;
    }
    if (ch === '\n') {
      ++lines;
      continue;
    }
    if (!isWhitespace(ch) && ch !== ')') {
      chars = idx;
      break;
    }
  }

  if (isNaN(start) || typeof chars === 'undefined') {
    return {};
  }

  start += chars;
  var code = orig.slice(start);
  var codeLine = code.split('\n').shift();
  var lineno = endLine + lines - 1;

  return {
    line: lineno,
    loc: {
      start: { line: lineno, pos: start },
      end: { line: lineno, pos: start + codeLine.length }
    },
    value: codeLine.trim(),
  };
}

/**
 * Expose `Code`
 */

module.exports = Code;
