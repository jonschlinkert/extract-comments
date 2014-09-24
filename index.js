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

function extract(str) {
  var match, o = {};
  var line = 1;

  while (match = (/\/\*{1,2}[^\*!]([\s\S]*?)\*\//g).exec(str)) {
    var start = str;

    // add lines from before the comment
    line += lineCount(start.substr(0, match.index)) - 1;

    // Update the string
    str = str.substr(match.index + match[1].length);

    o[line] = {
      type: 'comment',
      comment: match[1],
      begin: line,
      end: line + lineCount(match[1]) - 1
    };

    // add lines from the comment itself
    line += lineCount(start.substr(match.index, match[1].length)) - 1;
  }
  return o;
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