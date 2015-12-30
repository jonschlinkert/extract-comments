/**
 * @license AngularJS v1.5.0-rc.0
 * (c) 2010-2015 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, document, undefined) {'use strict';

/**
 * @description
 *
 * This object provides a utility for producing rich Error messages within
 * Angular. It can be called as follows:
 *
 * var exampleMinErr = minErr('example');
 * throw exampleMinErr('one', 'This {0} is {1}', foo, bar);
 *
 * The above creates an instance of minErr in the example namespace. The
 * resulting error will have a namespaced error code of example.one.  The
 * resulting error will replace {0} with the value of foo, and {1} with the
 * value of bar. The object is not restricted in the number of arguments it can
 * take.
 *
 * If fewer arguments are specified than necessary for interpolation, the extra
 * interpolation markers will be preserved in the final string.
 *
 * Since data will be parsed statically during a build step, some restrictions
 * are applied with respect to how minErr instances are created and called.
 * Instances should have names of the form namespaceMinErr for a minErr created
 * using minErr('namespace') . Error codes, namespaces and template strings
 * should all be static strings, not variables or general expressions.
 *
 * @param {string} module The namespace to use for the new minErr instance.
 * @param {function} ErrorConstructor Custom error constructor to be instantiated when returning
 *   error from returned function, for cases when a particular type of error is useful.
 * @returns {function(code:string, template:string, ...templateArgs): Error} minErr instance
 */

var foo = '/* this is a quoted string */';

function minErr(module, ErrorConstructor) {
  ErrorConstructor = ErrorConstructor || Error;
  return function() {
    var SKIP_INDEXES = 2;

    var templateArgs = arguments,
      code = templateArgs[0],
      message = '[' + (module ? module + ':' : '') + code + '] ',
      template = templateArgs[1],
      paramPrefix, i;

    message += template.replace(/\{\d+\}/g, function(match) {
      var index = +match.slice(1, -1),
        shiftedIndex = index + SKIP_INDEXES;

      if (shiftedIndex < templateArgs.length) {
        return toDebugString(templateArgs[shiftedIndex]);
      }

      return match;
    });

    message += '\nhttp://errors.angularjs.org/1.5.0-rc.0/' +
      (module ? module + '/' : '') + code;

    for (i = SKIP_INDEXES, paramPrefix = '?'; i < templateArgs.length; i++, paramPrefix = '&') {
      message += paramPrefix + 'p' + (i - SKIP_INDEXES) + '=' +
        encodeURIComponent(toDebugString(templateArgs[i]));
    }

    return new ErrorConstructor(message);
  };
}

/* We need to tell jshint what variables are being exported */
/* global angular: true,
  msie: true,
  jqLite: true,
  jQuery: true,
  slice: true,
  splice: true,
  push: true,
  toString: true,
  ngMinErr: true,
  angularModule: true,
  uid: true,
  REGEX_STRING_REGEXP: true,
  VALIDITY_STATE_PROPERTY: true,

  lowercase: true,
  uppercase: true,
  manualLowercase: true,
  manualUppercase: true,
  nodeName_: true,
  isArrayLike: true,
  forEach: true,
  forEachSorted: true,
  reverseParams: true,
  nextUid: true,
  setHashKey: true,
  extend: true,
  toInt: true,
  inherit: true,
  merge: true,
  noop: true,
  identity: true,
  valueFn: true,
  isUndefined: true,
  isDefined: true,
  isObject: true,
  isBlankObject: true,
  isString: true,
  isNumber: true,
  isDate: true,
  isArray: true,
  isFunction: true,
  isRegExp: true,
  isWindow: true,
  isScope: true,
  isFile: true,
  isFormData: true,
  isBlob: true,
  isBoolean: true,
  isPromiseLike: true,
  trim: true,
  escapeForRegexp: true,
  isElement: true,
  makeMap: true,
  includes: true,
  arrayRemove: true,
  copy: true,
  shallowCopy: true,
  equals: true,
  csp: true,
  jq: true,
  concat: true,
  sliceArgs: true,
  bind: true,
  toJsonReplacer: true,
  toJson: true,
  fromJson: true,
  convertTimezoneToLocal: true,
  timezoneToOffset: true,
  startingTag: true,
  tryDecodeURIComponent: true,
  parseKeyValue: true,
  toKeyValue: true,
  encodeUriSegment: true,
  encodeUriQuery: true,
  angularInit: true,
  bootstrap: true,
  getTestability: true,
  snake_case: true,
  bindJQuery: true,
  assertArg: true,
  assertArgFn: true,
  assertNotHasOwnProperty: true,
  getter: true,
  getBlockNodes: true,
  hasOwnProperty: true,
  createMap: true,

  NODE_TYPE_ELEMENT: true,
  NODE_TYPE_ATTRIBUTE: true,
  NODE_TYPE_TEXT: true,
  NODE_TYPE_COMMENT: true,
  NODE_TYPE_DOCUMENT: true,
  NODE_TYPE_DOCUMENT_FRAGMENT: true,
*/

////////////////////////////////////

/**
 * @ngdoc module
 * @name ng
 * @module ng
 * @description
 *
 * # ng (core module)
 * The ng module is loaded by default when an AngularJS application is started. The module itself
 * contains the essential components for an AngularJS application to function. The table below
 * lists a high level breakdown of each of the services/factories, filters, directives and testing
 * components available within this core module.
 *
 * <div doc-module-components="ng"></div>
 */

var REGEX_STRING_REGEXP = /^\/(.+)\/([a-z]*)$/;

// The name of a form control's ValidityState property.
// This is used so that it's possible for internal tests to create mock ValidityStates.
var VALIDITY_STATE_PROPERTY = 'validity';
