/**
 * Initialize Assemble.
 *
 *   - setup default configuration
 *   - setup default middleware
 *
 * @api private
 */

Assemble.prototype.foo = function(options) {
  var opts = extend(this.options, options);

  this.files = new Files();
  this.layoutEngines = {};
  this.engines = {};

  collections.cache = [];

  this.defaultConfig(opts);
  this.defaultTemplates(opts);
  this.defaultParsers(opts);
  this.defaultEngines(opts);
  this.defaultHighlighter(opts);
  this.option(opts);
};

// this
// is
// a
// multiline
// line
// comment
var str = '// foo bar'

/**
 * Expose `Assemble`
 */

module.exports = Assemble;
