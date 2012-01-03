var fs = require('fs'),
    util = require('utile');

var head = require('./head');

module.exports = function (h) {
  var self = this;

  return function (cb) {
    if (h.isDirectory()) {

      // Read its directory contents.
      fs.readdir(h.fullPath, function (err, children) {

        // Loop through files and get their "heads".
        // TODO: Intelligent errors
        util.async.map(children, function (f, callback) {
          var fullPath = path.resolve(h.fullPath, f);

          head(fullPath, callback);

        }, function (err, children) {
          cb.call(self, err, children);
        });

        

      });
    }
    else {
      // No children, right?
      cb.call(self, null, []);
    }
  }
}
