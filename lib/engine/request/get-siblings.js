var fs = require('fs'),
    util = require('utile');

var getChildren = require('./get-children'),
    getParent = require('./get-parent');

module.exports = function (h) {
  var self = this;

  return function (cb) {

    getParent.call(self, h, function (err, h) {
      if (err) {
        return cb.call(self, err);
      }

      getChildren.call(self, h, function (err, hs) {
        cb.call(self, err, hs);
      });
    });
  };
}
