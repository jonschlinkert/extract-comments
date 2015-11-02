'use strict';

var utils = require('./utils');

function Comment(str, start, end) {
  var i = start;
  var value = str.slice(i, end + 2);

  var lineno = str.slice(0, i).split('\n').length;
  var rawLines = value.split('\n');
  var linesLen = rawLines.length;
  var lines = utils.strip(value.slice(2, -2).split('\n'));

  this.type = null;
  this.raw = value;
  // this.value = lines.join('\n');
  this.lines = lines;
  // this.rawLines = rawLines;
  // this.lineno = lineno;
  // this.start = i;
  // this.end = end + 2;

  this.loc = {
    start: {
      line: lineno,
      pos: i
    },
    end: {
      line: lineno + linesLen - 1,
      pos: end + 2
    }
  };
}

Comment.prototype.loc = function() {
  // body...
};

/**
 * expose `Comment`
 */

module.exports = Comment;
