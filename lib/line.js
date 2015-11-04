'use strict';

var utils = require('./utils');

function LineComment(str, i, end) {
  var value = utils.restore(str.slice(i, end));
  var lineno = str.slice(0, i).split('\n').length;
  var rawLines = value.split('\n');
  var linesLen = rawLines.length;

  this.type = 'line';
  this.raw = value;
  value = this.raw.replace(/^\s*[\/\s]+/, '');
  this.value = value.split(/\n\/\//).join('\n');

  this.loc = {
    start: {
      line: lineno,
      pos: i
    },
    end: {
      line: lineno + linesLen - 1,
      pos: end
    }
  };
}

/**
 * expose `LineComment`
 */

module.exports = LineComment;
