'use strict';

var q = require("quotemeta");
var LineCounter = require("line-counter");
var EventEmitter = require('events').EventEmitter;
var util = require("util");

/**
 *
 * @param {object} pattern
 * @param {RegExp} pattern.regex
 * @param {RegExp[]} pattern.middle
 * @param {object} pattern.cg
 * @param {number} pattern.cg.indent
 * @param {number} pattern.cg.wholeComment
 * @param {number} pattern.cg.contentStart
 * @param {number} pattern.cg.beforeCode
 * @param {number} pattern.cg.code
 * @constructor
 */
function Scanner(pattern) {
  var _this = this;
  var cg = pattern.cg;

  /**
   * Return the spec that was responsible for a comment match
   * @param commentMatch
   * @returns {*}
   */
  function contentCg(commentMatch) {
    var start = pattern.cg.contentStart;
    var end = start + pattern.middle.length;
    for (var i = start; i < end; i++) {
      if (typeof commentMatch[i] !== "undefined") {
        return i;
      }
    }
    console.log(commentMatch);
    throw new Error("No comment-part had a match. This should not happen");
  }

  this.scan = function (contents) {

    var counter = new LineCounter(contents);
    var match;
    // The first part of the string is always code (if the string starts with
    // a comment, we treat is as if the is a zero-length code-part before the comment
    // This part ends with the beginning of the first comment
    this.emit("codeStart",0);
    while ((match = pattern.regex.exec(contents)) != null) {
      // Find the matched capturing group for the comment-alternative of the regex

      var i = contentCg(match);
      var content = match[i];
      var indentRegex = new RegExp("^" + q(match[cg.indent]), "mg");
      content = content.replace(indentRegex, "");
      var middle = pattern.middle[i - pattern.cg.contentStart];
      content = content.replace(middle, "");
      // Remove empty lines from the beginning of the comment
      content = content.replace(/^[\n\r]*/, "");

      var commentEndIndex = match.index + match[cg.indent].length + match[cg.wholeComment].length;
      var codeStartIndex = match.index + match[0].length;

      // Comment found, code ends here
      _this.emit("codeEnd",match.index);
      // Emit the comment details
      _this.emit("comment",
        {
          // The order of the .countUpTo-calls must be preserved or errors will occur
          begin: counter.countUpTo(match.index),
          end: counter.countUpTo(commentEndIndex),
          codeStart: counter.countUpTo(codeStartIndex),
          content: content
        });
      // The start of the next code part
      _this.emit("codeStart",match.index + match[0].length);
    }
    _this.emit("codeEnd",contents.length);
  }
}

util.inherits(Scanner, EventEmitter);

module.exports = Scanner;
