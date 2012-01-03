// Create files.

var path = require('path');

// TODO: Do I *really* want to remove YES ALL OF IT ? Probably.
var rimraf = require('utile').rimraf;


// TODO: Allow for initializing file contents?
module.exports = function (stat, options) {
  options = options || {};

  return function (cb) {
    return rimraf(stat.fullPath, cb);
  }
};
