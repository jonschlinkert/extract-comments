/*!
 * extract-comments <https://github.com/jonschlinkert/extract-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var mapFiles = require('map-files');
var lineCount = require('line-count');
var extend = require('mixin-deep');
var extractComments = require('./lib/extract');


/**
 * Extract code comments from the given `string`.
 *
 * **Example:**
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

function extract(str, opts) {
  str = str.replace(/\r/g, '');
  opts = opts || {};

  var extract = extractComments(opts);
  var lines   = str.split(/\n/);
  var comments  = [];
  var comment;

  while (lines.length) {
    comment = extract(lines.shift());
    if (comment) {
      comments.push(comment);
    }
  }

  return comments.reduce(function(acc, obj) {
    obj.type = 'comment';
    obj.comment = obj.comment.join('\n');
    acc[obj.begin] = obj;
    return acc;
  }, {});
}



/**
 * Extract code comments from a file or glob of files:
 *
 * **Example:**
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

extract.fromFiles = function(patterns, options) {
  return mapFiles(patterns, extend({
    rename: function(filepath) {
      return filepath;
    },
    parse: function (filepath, options) {
      var code = fs.readFileSync(filepath, 'utf8');
      return extract(code, options);
    }
  }, options));
};


/**
 * Expose `extract`
 */

module.exports = extract;