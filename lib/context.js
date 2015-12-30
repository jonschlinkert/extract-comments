'use strict';

var codeContext = require('parse-code-context');

/**
 * Create a new Context object for the given comment.
 *
 * @param {String} `str` string of JavaScript
 * @param {Object} `comment` Block comment instance
 */

function Context(str, comment) {
  var start = comment.range[1];
  var lineno = comment.loc.end.line;
  var afterComment = str.slice(start);
  var len = afterComment.length, i = 0;
  var newlines = 0;
  var col = null;

  this.context = {};
  this.value = '';
  this.line = null;

  /**
   * Loop until we get to a non-whitespace, non-newline character
   * If codeContext returns a parsed object, it's used as context,
   * otherwise we assume that no code follows the comment.
   */

  while (++i < len) {
    var ch = afterComment[i];

    if (ch === '/' || ch === '*') {
      break;
    }

    if (ch !== '\n' && ch !== ' ' && ch !== '\t') {
      col = start + i;

      var line = str.slice(col, str.indexOf('\n', col));
      var res = codeContext(line);
      if (res) {
        this.context = res;
        this.value = line;
        this.line = lineno + newlines + 1;
      }
      break;
    }

    if (ch === '\n') {
      newlines++;
    }
  }

  /**
   * Create location stats
   */

  var end = col !== null
    ? col + (this.value || '').length
    : null;

  this.loc = {
    start: {
      line: this.line,
      column: col
    },
    end: {
      line: this.line,
      column: end
    }
  };
}

/**
 * Expose `Context`
 */

module.exports = Context;
