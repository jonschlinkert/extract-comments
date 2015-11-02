'use strict';

function LineComment(str, i, end) {
  var lineno = str.slice(0, i).split('\n').length;

  this.type = 'line';
  this.raw = str.slice(i, end);
  this.value = this.raw.replace(/^[\/\s]+/, '');

  this.loc = {
    start: {
      line: lineno,
      pos: i
    },
    end: {
      line: lineno,
      pos: end + 2
    }
  };
}

/**
 * expose `LineComment`
 */

module.exports = LineComment;
