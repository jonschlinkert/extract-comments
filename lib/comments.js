/*!
 * extract-comments <https://github.com/jonschlinkert/extract-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var extract = require('esprima-extract-comments');
var extend = require('extend-shallow');
var define = require('define-property');
var Context = require('./context');
var Block = require('./block');
var Line = require('./line');
var use = require('use');

/**
 * Create an instance of `Comments` with `options`.
 *
 * ```js
 * extract(str, options);
 * ```
 * @param {String} `string`
 * @param {Object} `options`
 * @param {Object} `options.first` Return the first comment only
 * @param {Object} `options.banner` alias for `options.first`
 * @return {String}
 * @api public
 */

function Comments(options, fn) {
  this.options = extend({type: 'block'}, options);
  this.transform = fn;
  this.comments = [];
}

Comments.prototype.extract = function(str) {
  if (typeof str !== 'string') {
    throw new TypeError('expected a string');
  }

  define(this, 'input', str);

  var opts = this.options;
  var ast = [];

  try {
    ast = extract(this.input);
  } catch (err) {
    throw err;
  }

  var len = ast.length;
  var idx = -1;

  while (++idx < len) {
    var token = ast[idx];
    token.type = token.type.toLowerCase();

    if (typeof this.options.filter === 'function') {
      if (this.options.filter(token)) {
        continue;
      }
    }

    if (token.type === 'block' && opts.block !== false) {
      var comment = new Block(str, token, opts);

      if (opts.context !== false) {
        comment.code = new Context(str, comment, opts);
      }

      if (/^!/.test(token.value) && opts['protected'] !== true) {
        continue;
      }

      if (typeof this.transform === 'function') {
        var res = this.transform(comment, this.options);
        if (res) comment = res;
      }

      this.comments.push(comment);
    }

    if (token.type === 'line' && opts.line !== false) {
      this.comments.push(new Line(str, token, opts));
    }

    if ((opts.first || opts.banner) && this.comments.length === 1) {
      break;
    }
  }
  return this;
};

/**
 * Expose `Comments` constructor, to
 * allow plugins to be registered.
 */

module.exports = Comments;
