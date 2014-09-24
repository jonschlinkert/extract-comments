/*!
 * extract-comments <https://github.com/jonschlinkert/extract-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

// this code was inspired by https://github.com/yavorskiy/comment-parser
module.exports = function (opts) {
  var obj = {};
  obj.comment = {};

  var start = /^\s*\/\*\*?\s*/;
  var middle  = /^\s*\*(?:\s|$)/;
  var end   = /^\s*\*\/\s*/;

  var i = 0;
  return function extract(line) {
    i++;

    if (line.match(start)) {
      obj.begin = i;
      obj.comment = [line.replace(start, '')];
      return null;
    }

    if (obj.comment) {
      if (line.match(middle)) {
        obj.comment.push(line.replace(middle, ''));
        return null;
      }
      if (line.match(end)) {
        obj.end = i;
        obj.comment.push(line.replace(end, ''));
        return obj;
      }
    }
    obj = {};
  };
};