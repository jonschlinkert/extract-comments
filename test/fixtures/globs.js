/*!
 * Banner comment
 */

/** 
 * globs
 */

// a line comment
var foo = '/path/to/*/something/that/not/be/stripped.js';
var bar = '/path/to/globstar/not/be/stripped/**/*.js';
var baz = '/path/to//globstar//not/be/stripped/**/*/.js';
var qux = '/*/to//globstar//not/be/stripped/**/*/.js';
var fez = 'abc/to /*/globstar//not/be/stripped/**/ */foo.js';

/* inline block comment */
