var path = require('path'),
    fs = require('fs');

module.exports = function (p, cb) {

  var self = this;

  // TODO: Any reason to make lstat/stat configurable?
  fs.stat(p, function (err, stat) {
    stat = stat || {};

    stat.fullPath = p;

    stat.relPath = path.relative(self.root || '/', p);

    cb.call(self, err, stat);

  });
}
