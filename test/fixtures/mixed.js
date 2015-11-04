/*!
 * this is a multiline
 * block comment
 */
'use strict';

/**
 * and this multiline
 * block comment
 */
var foo = function(/* and these single-line block comment */) {};

/**
 * and this
 * multiline block
 * comment
 */
var bar = function(/* and that */) {};

var foo = '//bar baz not a comment';

// this single-line line comment
var baz = function() {
  // this multiline
  // line comment
  var some = true;
  //this
  var fafa = true; //and this
  // var also = 'that';
  var but = 'not'; //! that comment
};

// also this multiline
// line comment
var fun = false;
var path = '/path/to/*/something/that/not/be/stripped.js';
var globstar = '/path/to/globstar/not/be/stripped/**/*.js';
var globstar = '/path/to//globstar//not/be/stripped/**/*/.js';

/* inline block comment */

process.stdout.write('string literals: ');
console.dir({
  str0: '&apos;',
  str1: "&quot;",
  str2: ". // ' \\ . // ' \\ .",
});

process.stdout.write('RegExp literals: ');
console.dir({
  regexp0: /I'm the easiest in Chomsky hierarchy!/,
});

// eos