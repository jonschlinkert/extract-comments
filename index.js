/*!
 * extract-comments <https://github.com/jonschlinkert/extract-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var mapFiles = require('map-files');

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
 * ```
 *
 * @param  {String} `string`
 * @return {Object} Object of code comments.
 * @api public
 */

function extract(str, fn) {
  var start = /^\s*\/\*\*?/;
  var middle = /^\s*\*([^\n*]*)/;
  var end = /^\s*\*\//;

  var lines = str.split('\n');
  var len = lines.length, i = 0, m;
  var comments = {}, o = {};
  var isComment = false, afterCount;

  while (i < len) {
    var line = lines[i++];

    if (!isComment && start.test(line)) {
      afterCount = 0;
      isComment = true;
      o = {};
      o.begin = i;
      o.comment = '';
      o.after = '';
    }

    if (isComment && end.test(line)) {
      o.end = i;
      o.type = 'comment';
      comments[o.begin] = o;
      isComment = false;
    }

    if (isComment && i > o.begin) {
      m = middle.exec(line);
      if (m) line = m[1];

      o.comment += (line || '').trim() + '\n';
    }

    if (!isComment && o.end && i > o.end && afterCount < 2) {
      o.after += line + '\n';
      afterCount++;
    }

    if (o.begin && o.after !== '') {
      o.after = o.after.trim().split('\n')[0];

      // callback
      if (typeof fn === 'function') {
        comments[o.begin] = fn(comments[o.begin]);
      }
    }
  }
  return comments;
};

/**
 * Extract code comments from a file or glob of files.
 * You may also pass a custom `rename` function on the options
 * to change the key of each object returned.
 *
 * See [map-files] for more details and available options.
 *
 * ```js
 * var extract = require('extract-comments');
 * extract.fromFiles(['lib/*.js']);
 * ```
 *
 * @param  {String} `patterns` Glob patterns to used.
 * @param  {Object} `options` Options to pass to [globby], or [map-files].
 * @return {Object} Object of code comments.
 * @api public
 */

extract.fromFiles = function(patterns, opts) {
  opts = opts || {};
  opts.name = opts.rename || function(fp) {
    return fp;
  };
  opts.read = opts.read || function(fp, options) {
    var code = fs.readFileSync(fp, 'utf8');
    return extract(code, options);
  };
  return mapFiles(patterns, opts);
};
