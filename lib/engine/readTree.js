var findit = require('findit'),
    fs = require('fs'),
    path = require('path'),
    util = require('utile'),
    Engine = require('./engine');


// A helper for getting the engine "file" object together.
// TODO: Formalize, share with Engine.prototype.request
var getFile = function (p, stat) {

  return util.mixin(
    stat,
    { fullpath: p },
    fs.map(function (m) {
      // for example, file.readFile(cb)
      return m.bind(null, id);
    })
  );
}

// Helpers to read in the file paths for the whole directory tree.
// YES ALL OF THEM
// TODO: Catch and direct foreseeable errors

// Async version. Obviously the best one.
module.exports = function (p, cb) {
  var fullPath = path.resolve(p),
      badPathError = new Error(fullPath+' is not a directory.'),
      finder;

  // TODO: PR to fix finder error throw bug
  path.exists(fullPath, function (exists) {
    if (!exists) {
      return cb(badPathError);
    }


    // TODO: Support lstat?
    fs.stat(fullPath, function (err, stat) {
      if (err) {
        return cb(err);
      }
      else if (!stat.isDirectory()) {
        return cb(badPathError);
      }
      else {
        finder = findit.find(fullPath);
      }

      var resources = {};

      finder.on('directory', function (p, stat) {
        resources[p] = getFile(p, stat);
      });
      finder.on('file', function (p, stat) {
        resources[p] = getFile(p, stat);
      });

      finder.on('link', function (p, stat) {
        // TODO: Add ability to follow links?
        return;
      });

      finder.on('end', function () {
        cb(null, resources);
      });



      finder.on('error', function (err) {
        cb(err);
      });
    });
  });
}

// Sync version.
// Probably the easiest way to handle the stat reads with resourceful
// Alternately: throw an EE somewhere, emit "ready" event
exports.sync = function (p) {
  var fullPath = path.resolve(p),
      badPathError = new Error(fullPath+' is not a directory.'),
      finder;

  if (path.existSync(fullPath)) {
    finder = findit.sync(fullPath);
  }
  else {
    throw badPathError;
  }

  var resources = {};

  finder.forEach(function (p) {
    resources[p] = fs.statSync(p);
  });

  return resources;

}
