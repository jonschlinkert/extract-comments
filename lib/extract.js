/*!
 * extract-comments <https://github.com/jonschlinkert/extract-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (str, opts) {
  str = str.replace(/\r/g, '');
  var comments = [];
  var obj = {};
  obj.comment = '';

  var start = /^\s*\/\*\*?\s*/;
  var middle  = /^\s*\*(?:\s|$)/;
  var end   = /^\s*\*\/\s*/;
  var lines = str.split('\n');
  var len = lines.length;
  var i = 0;

  var isComment = false;

  while (i < len) {
    var line = lines[i++];

    if (start.test(line)) {
      isComment = true;
      obj.comment += line + '\n';
      obj.begin = i;
    }

    if (isComment && end.test(line)) {
      isComment = false;
      obj.comment += line;
      obj.end = i;
      comments.push(obj);

      // reset
      obj = {};
      obj.comment = '';
    }

    if (isComment) {
      obj.comment += line + '\n';
    }
  }
  return comments;
};