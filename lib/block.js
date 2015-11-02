'use strict';

var Context = require('./context');
var Comment = require('./comment');
var utils = require('./utils');

function BlockComment(str, start, end) {
  var comment = new Comment(str, start, end);
  comment.type = 'block';
  comment.code = new Context(str, comment);
  return comment;

  var i = start;
  var value = str.slice(i, end + 2);

  var lineno = str.slice(0, i).split('\n').length;
  var rawLines = value.split('\n');
  var linesLen = rawLines.length;
  var lines = utils.strip(rawLines);

  return {
    type: 'block',
    comment: value,
    value: lines.join('\n'),
    lines: lines,
    start: i,
    end: end + 2,
    loc: {
      start: {
        line: lineno,
        column: i
      },
      end: {
        line: lineno + linesLen - 1,
        column: end + 2
      }
    },
  };
}

/**
 * expose `BlockComment`
 */

module.exports = BlockComment;
