'use strict';

var utils = require('./utils');
var Code = require('./code');

function Comment(str, i, end) {
  var value = utils.restore(str.slice(i, end + 2));
  var lineno = str.slice(0, i).split('\n').length;
  var rawLines = value.split('\n');
  var linesLen = rawLines.length;
  var lines = utils.strip(value.slice(2, -2).split('\n'));

  this.type = 'block';
  this.raw = value;
  this.value = lines.join('\n');
  this.lines = lines;
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
  this.code = new Code(str, this);
}

/**
 * expose `Comment`
 */

module.exports = Comment;
