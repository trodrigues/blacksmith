var fs = require('fs');

// TODO: Write fs2 style.
module.exports = function (stat, options) {
  options = options || {};

  var self = this;

  return function (cb) {
    return fs.writeFile(fullPath, cb.bind(self));
  }
};
