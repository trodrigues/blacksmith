var fs = require('fs'),
    path = require('path'),
    util = require('utile'),
    head = require('./head'),
    File = require('./file').File;

// This function is used to interact with the filesystem in a db-like way.
var request = module.exports = function (relPath, cb) {

  // Passes the context to the callback.
  var self = this,
      // TODO: Should the method of path resolution be somehow configurable?
      fullPath = path.resolve(self.uri, relPath.toString()); 

  path.exists(fullPath, function (exists) {
    if (!exists) {

      // File does not exist. Return 404.
      cb.call(self, util.mixin(
        new Error('File '+ fullPath +'not found'),
        { status: 404 }
      ));
    }
    else {

      head(fullPath, function (err, stat) {
        if (err) {
          return cb.call(self, err, stat);
        }

        // TODO: Make these pluggable for custom resource/file mappings
        cb.call(self, null, new File(stat) );
      });
    }
  });
}

