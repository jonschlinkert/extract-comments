'use strict';

function Context(str, comment) {
  var start = comment.loc.end.pos;
  var endLine = comment.loc.end.line;

  str = str.slice(start);
  var lines = str.split('\n');
  var len = lines.length, i = -1;
  var token = {};

  while (++i < len) {
    var line = lines[i];
    if (line) {
      token.line = i + endLine;
      token.code = line.trim();
      break;
    }
  }
  return token;
}

/**
 * Expose `Context`
 */

module.exports = Context;
