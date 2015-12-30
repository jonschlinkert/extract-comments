'use strict';

var context = require('./context');
var utils = require('./utils');

function Code(str, comment, options) {
  var opts = utils.extend({}, options);

  var start = comment.loc.end.pos;
  var lineno = comment.loc.end.line;
  var ctx = {};
  var val = '';

  // get the string immediated after the comment
  var lines = str.split('\n').slice(lineno);
  var limit = opts.contextLimit || 10;
  var len = lines.length;

  if (limit < len) {
    len = limit;
  }

  for (var i = 0; i < len; i++) {
    var line = lines[i];

    if (line.trim() === '') {
      continue;
    }

    // break on the first line with code after the comment
    var res = utils.codeContext(line, lineno + i);
    if (res) {
      ctx = res;
      val = line;
      lineno += i + 1;
      break;
    }
  }

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
