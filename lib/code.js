'use strict';

var codeContext = require('parse-code-context');
var utils = require('./utils');

function Code(str, comment) {
  str = utils.restore(str);
  var start = comment.loc.end.pos;
  var lineno = comment.loc.end.line;
  var ctx = {};

  var lines = str.split('\n').slice(lineno);
  for (var i = 0; i < lines.length; i++) {
    var res = codeContext(lines[i], lineno + i);
    if (res) {
      ctx = res;
      lineno += i;
      break;
    }
  }

  var val = ctx.original || '';
  var pos = str.slice(start).indexOf(val) + start;

  this.context = ctx;
  this.value = val.trim();
  this.line = lineno;

  this.loc = {
    start: {
      line: lineno,
      pos: pos
    },
    end: {
      line: lineno,
      pos: pos + val.length
    }
  };
}

/**
 * Expose `Code`
 */

module.exports = Code;
