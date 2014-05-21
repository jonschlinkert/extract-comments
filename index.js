var path = require('path');
var fs = require('fs');
var glob = require('globule');
var esprima = require('esprima');

var extractComments = function (code) {
  return esprima.parse(code, { comment: true })
    .comments.map(function (comment) {
      return comment;
    });
};

module.exports = function(patterns, arr) {
  var comments = arr ? [] : {};
  var files = glob.find(patterns);

  files.forEach(function(filepath) {
    var name = path.basename(filepath, path.extname(filepath));
    var str = fs.readFileSync(filepath, 'utf8');

    var fileComments = {
      filepath: filepath,
      comments: extractComments(str)
    };

    if (arr) {
      comments.push(fileComments);
    } else {
      comments[name] = fileComments;
    }
  });
  return comments;
};