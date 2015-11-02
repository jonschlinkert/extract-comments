'use strict';

function Code(str, comment) {
  var start = comment.loc.end.pos;
  var endLine = comment.loc.end.line;
  var orig = str;

  str = str.slice(start);
  var slen = str.length, idx = -1;
  var chars, lines = 0;

  while (++idx < slen) {
    var ch = str[idx];
    if (ch === '\n') {
      ++lines;
      continue;
    }
    if (!/[\W\s]/.test(ch)) {
      chars = idx;
      break;
    }
  }

  start += chars;
  var next = orig.indexOf('\n', start);
  var code = orig.slice(start);
  var codeLine = code.slice(0, next);
  var lineno = endLine + lines - 1;

  return {
    line: lineno,
    loc: {
      start: { line: lineno, pos: start },
      end: { line: lineno, pos: next }
    },
    value: codeLine.trim(),
  };
}

/**
 * Expose `Code`
 */

module.exports = Code;
