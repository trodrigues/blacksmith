var fs = require('fs'),
    path = require('path'),
    util = require('utile');

var head = require('./head');

module.exports = function (h) {
  var self = this;

  return function (cb) {
    // Build up path for parent
    var fullPath = path.resolve(h.fullPath+'/../');

    // Callback with the new head
    head(fullPath, function () {
      callback.apply(self, arguments);
    });

  }
}
