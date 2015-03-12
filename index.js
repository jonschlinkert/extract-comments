/*!
 * extract-comments <https://github.com/jonschlinkert/extract-comments>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isWhitespace = require('is-whitespace');

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
 * @param  {String} `string`
 * @return {Object} Object of code comments.
 * @api public
 */

function extract(str, fn) {
  var start = /^\/\*\*?/;
  var middle = /^\*([^*][^\/])*/;
  var end = /^\*\//;

  var lines = str.split(/[\r\n]/);
  var len = lines.length, i = 0, m;
  var comments = {};
  var isComment = false, afterCount;
  var from, to, b, o = {};

  while (i < len) {
    var line = lines[i++].trim();

    if (!isComment && start.test(line)) {
      afterCount = 0;
      isComment = true;
      o = {begin: null, end: null};
      o.begin = b = i;
      o.after = '';
      o.content = '';
    }

    if (isComment && end.test(line)) {
      o.end = i;
      comments[b] = o;
      isComment = false;
    }

    if (isComment && i > b) {
      if (isMiddle(line)) {
        o.content += stripStars(line) + '\n';
      }
    }

    if (!isComment && o.end && i > o.end && afterCount < 2) {
      if (!isWhitespace(line)) {
        o.codeStart = i;
      }
      o.after += line + '\n';
      afterCount++;
    }

    if (b && o.after !== '') {
      o.after = o.after.trim().split('\n')[0];
      comments[b].blocks = comments[b].content.split('\n\n');

      // callback
      if (typeof fn === 'function') {
        comments[b] = fn(comments[b], b, o.end);
      }
    }
  }
  return comments;
};

/**
 * Strip the leading `*` from a line, ensuring
 * not to eat too many whitespaces after the delimiter.
 */

function stripStars(str) {
  str = str.replace(/^\s*/, '');
  if (str.charAt(0) === '/') {
    str = str.slice(1);
  }
  if (str.charAt(0) === '*') {
    str = str.slice(1);
  }
  if (str.charAt(0) === ' ') {
    str = str.slice(1);
  }
  return str;
}

/**
 * Detect if the given line is in the middle
 * of a comment.
 */

function isMiddle(str) {
  return typeof str === 'string'
   && str.charAt(0) === '*'
   && str.charAt(1) !== '/';
}
