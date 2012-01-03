// Create files.

var path = require('path');

// TODO: Evaluate using a more custom approach.
var touch = require('touch');


// TODO: Allow for initializing file contents?
module.exports = function (stat, options) {
  options = options || {};

  return function (cb) {
    return touch(stat.fullPath, cb);
  }
};
