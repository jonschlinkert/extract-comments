var cp = require("comment-patterns");
var Scanner = require("./scanner.js");
var nextLineRegex = /.*$/mg;

function identityFunction(x) {
  return x;
}

function extract(str, fn, options) {
  if (typeof fn !== 'function' && typeof options === "undefined") {
    options = fn;
    fn = identityFunction;
  }
  // default filename is a javascript file (for backwards compatibility)
  var filename = (options && options.filename) || "abc.js";
  var regexp = cp.regex(filename);

  var result = {};

  // This variable is an intermediate
  // store for comments that have been extracted,
  // but the next-line-of-code is still missing
  // This property is not set until the following
  // comment is processed.
  var lastComment = null;
  var codeStart = null;
  var codeEnd = null;
  new Scanner(regexp)
    .on("comment", function (comment) {
      lastComment = comment;
    })
    .on("codeStart", function (codeStartIndex) {
      codeStart = codeStartIndex;
    })
    .on("codeEnd", function (codeEndIndex) {
      codeEnd = codeEndIndex;
      if (lastComment) {
        nextLineRegex.lastIndex = codeStart;
        var match = nextLineRegex.exec(str);
        if (match[0].length > codeEnd - codeStart) {
          lastComment.code = match[0].substr(codeEnd - codeStart);
        } else {
          lastComment.code = match[0];
        }
        result[lastComment.begin] = fn(lastComment, lastComment.begin, lastComment.end);
      }
    })
    .scan(str);

  return result;
}

module.exports = extract;
//var contents = fs.readFileSync("../extract-comments/fixtures/test.coffee", "utf-8");
//console.log(extract(contents,{ filename: "test.coffee" }));

