'use strict';

console.time('total');
process.on('exit', () => console.timeEnd('total'));
const fs = require('fs');
const extract = require('./');

// const str = fs.readFileSync('test/fixtures/angular.js', 'utf8');
// const str = fs.readFileSync('test/fixtures/quoted-string.js', 'utf8');
const str = fs.readFileSync('index.js', 'utf8');
const res = extract(str);
console.log(res[0]);
console.log(str.length);
// res.forEach(function(comment) {
//   if (comment.type === 'BlockComment') {
//     // console.log(comment);
//   }
// });

