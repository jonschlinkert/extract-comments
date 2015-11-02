'use strict';

function Code(str, comment) {
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
      token.loc = comment.loc;
      token.value = line.trim();
      break;
    }
  }
  return token;
}

/**
 * Expose `Code`
 */

module.exports = Code;
