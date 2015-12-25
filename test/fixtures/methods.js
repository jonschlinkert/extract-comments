/*!
 * This is a banner!
 */

/**
 * Create an instance of App with `options`
 *
 * @param {Object} options
 */

function App(options) {
  this.options = options || {};
}

/**
 * Set `key` with the given value.
 *
 * @param {String} key
 * @param {any} val
 */

App.prototype.set = function(key, val) {
  this[key] = val;
  return this;
};

/**
 * Get the value of `key`
 *
 * @param {String} key
 */



App.prototype.get = function(key) {
  return this[key];
};