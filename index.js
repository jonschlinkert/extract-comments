/*!
 * extract-comments <https://github.com/jonschlinkert/extract-comments>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isWhitespace = require('is-whitespace');
var commentPattern = require('comment-patterns');
var qm = require('quotemeta');

/**
 * expose `extract`
 */

module.exports = extract;

/**
 * Extract code comments from the given `string`.
 *
 * ```js
 * var extract = require('extract-comments');
 * extract('// this is a code comment');
 *
 * // pass a callback to process each comment
 * // directly after it's parsed
 * var context = require('code-context');
 * extract(str, function(comment) {
 *   comment.context = context(comment.after);
 *   return comment;
 * });
 * ```
 *
 * @param  {String} `str` the source code to extract comments from
 * @param  {Function} [`fn`] the transformer-callback
 * @param  {Object} `options` an object with optional paramters
 * @param  {String} [`options.filename`] a file name to determine the comment-patterns
 * @return {Object} Object of code comments.
 *
 * @api public
 */

function extract(str, fn, options) {
  if (typeof fn !== 'function' && typeof options === "undefined") {
    options = fn;
    fn = null;
  }
  // default filename is a javascript file (for backwards compatibility)
  var filename = (options && options.filename) || "abc.js";
  var patterns = buildRegexes(commentPattern(filename));

  var lines = str.split(/[\r\n]/);
  var len = lines.length, i = 0;
  var comments = {};
  var afterCount;
  var b, o = {};

  // See the `checkStart`-function for possible values.
  var currentComment = null;

  while (i < len) {
    var line = lines[i++].trim();
    if (currentComment == null) {
      // Check if any of the comment-patterns matches
      currentComment = checkStart(line,patterns);
      if (currentComment != null) {
        // We are now inside a comment
        afterCount = 0;
        o = {begin: null, end: null};
        o.begin = b = i;
        o.code = '';
        o.content = '';
      }
    } else {
      // Inside a comment...
      if (currentComment.multi) {
        // Inside a multiline comment
        if (currentComment.pattern.end.test(line)) {
          // End of comment reached
          o.end = i;
          comments[b] = o;
          currentComment = null;
        } else if (currentComment.pattern.middle.test(line)) {
          o.content += line.replace(currentComment.pattern.middle,"") + '\n';
        }
      } else {
        // Last line was a single-line comment
        if (currentComment.pattern.test(line)) {
          o.content += line.replace(currentComment.pattern,"") + '\n';
        } else {
          // End of comment was reached one line before
          o.end = i-1;
          comments[b] = o;
          currentComment = null;
        }
      }
    }


    if (currentComment == null && o.end && i > o.end && afterCount < 2) {
      if (!isWhitespace(line)) {
        o.codeStart = i;
      }
      o.code += line + '\n';
      afterCount++;
    }

    if (b && o.code !== '') {
      o.code = o.code.trim();

      // callback
      if (typeof fn === 'function') {
        comments[b] = fn(comments[b], b, o.end);
      }
    }
  }
  return comments;
}

/**
 * Check, whether the current line starts a comment.
 * Return the pattern-set marking the current comment:
 * This can be either `null`, if the current line is no comment,
 * or `{multi:true, pattern:{start:,middle:,end:}}` for multiline-comments
 * or `{multi:false, pattern: 'string'}` for single-line-commments
 * @param {String} `line` the current line of code
 * @param {Object} `patterns` the comment-patterns for the current language
 */
function checkStart(line, patterns) {

  var i;
  // Check for multiline-comment. `pattern.multiLine` is never `null` due to the `buildRegexes`-function
  for (i = 0; i < patterns.multiLine.length; i++) {
    if (patterns.multiLine[i].start.test(line)) {
      return {
        multi: true,
        pattern: patterns.multiLine[i]
      }
    }
  }
  // Check for single-line-comment. `pattern.singleLine` is never `null` due to the `buildRegexes`-function
  for (i = 0; i < patterns.singleLine.length; i++) {
    if (patterns.singleLine[i].test(line)) {
      return {
        multi: false,
        pattern: patterns.singleLine[i]
      }
    }
  }
  // No comment start detected
  return null;
}

/**
 * Convert the string-based comment-delimiters from the `comment-patterns` result
 * into regex-based comment-patterns.
 * @param {Object} `patterns` the `comment-patterns`
 * @returns {{multiLine: Array, singleLine: Array}} regexes for multi-line and single-line comments
 */
function buildRegexes(patterns) {
  var i = 0;
  var result = {
    multiLine: [],
    singleLine: []
  };
  if (patterns.multiLineComment) {
    for (i = 0; i < patterns.multiLineComment.length; i++) {

      var ml = patterns.multiLineComment[i];
      result.multiLine.push({
        start: new RegExp("^" + qm(ml.start)),
        middle: new RegExp("^" + qm(ml.middle)+"\\s?"),
        end: new RegExp("^" + qm(ml.end))
      });
    }
  }
  if (patterns.singleLineComment) {
    for (i = 0; i < patterns.singleLineComment.length; i++) {
      var sl = patterns.singleLineComment[i];
      result.singleLine.push(new RegExp("^" + qm(sl)));
    }
  }
  return result;
}
