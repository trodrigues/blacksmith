var fs = require('fs');


module.exports = function (stat, options) {
  options = options || {};

  var self = this;

  return function (cb) {
    return fs.readFile(fullPath, cb.bind(self));
  }
};
