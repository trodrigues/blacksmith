var fs = require('fs'),
    path = require('path'),
    util = require('utile');

var resourceful = require('resourceful'),
    Cache = resourceful.Cache;

var readTree = require('./readTree');

exports.stores = {};
exports.caches = {}; // TODO: Hook into caches


// TODO: Enforce no walking outside root

var Engine = exports.Engine = function (options) {

  // In this case, this.uri refers to file paths!
  this.uri = options.root || options.uri || path.resolve('./');

  // new filename generator
  this.newKey = (function filenameGenerator() {
    var counter = 0;

    return function () {
      var number = ++counter;
      // TODO: CHECK TO SEE IF THAT FILE ALREADY EXISTS
      // TODO: smarter filenames (alternative: '.dat')
      return path.resolve(root, String(number)+'.json');
    }

  })();

  // Read in all the file paths.
  // This helper is sync to better fit the engines workflow, but there is also
  // an equivalent async helper in the same namespace (readTree.async).
  //
  // I think I don't want to cache this.
  // this.files = readTree.sync(this.uri);

  // Set up a cache.
  this.cache = new Cache;

};

// Make "requests" against a file p
// TODO: Think about the semantics here. What should this look like?
Engine.prototype.request = function (p, cb) {
  var self = this,
      id = path.resolve(self.uri, p); // TODO: path resolution should be configurable

  path.exists(p, function (exists) {
    if (!exists) {
      // Signal that file doesn't exist
      cb.call(self, util.mixin(new Error('File not found'), { status: 404 }));
    }
    else {

      // TODO: Any reason to make lstat/stat configurable?
      fs.stat(id, function (err, stat) {
        if (err) {
          return cb.call(self, err);
        }

        // TODO: Make these pluggable for custom resource/file mappings
        // TODO: Choose a deliberate, sane subset of the fs module here.
        cb.call(self,
          null,
          util.mixin(
            stat,
            { fullpath: id },
            fs.map(function (m) {
              // for example, file.readFile(cb)
              return m.bind(null, id);
            })
          )
        );
      });
    }
  });
}

Engine.prototype.protocol = 'file';

// Save with relative path 'key' and object 'val'
// Works regardless of prior existence.
Engine.prototype.save = function (key, val, callback) {

  // roll through the args, handling lack thereof
  var args = Array.prototype.slice.call(arguments);
  var callback = args.pop(), val = args.pop();

  // In the case that there is no key, create one.
  // ie, create a filename.
  // This is what this.increment is for.
  // TODO: Write a sane error message if the case of no key.
  // TODO: Make this behavior configurable.
  if (!args.length || !key) {
    key = this.newKey();
    val._id = key; // TODO: Make sure this behavior is consistent.
  }

  // Make a save "request" here.
  this.request(key, function (err, f) {
    var self = this,
        update = true;

    if (err) {
      // Handle "not found" case
      if (err.status && err.status == 404) {
        update = false;
      }
      else {
        throw err;
      }
    }

    // TODO: Make typecasting more robust, and include with helper!
    // TODO: Use the fs2-style writeFile
    // TODO: Make writing pluggable!
    f.writeFile(String(val), function (err) {
      if (err) {
        callback(err, { status: 500 });
      }

      callback(null, util.mixin({ status: update ? 200 : 201 }, val));
    });
  });
};

// In the case of this engine, an alias for save.
// In the case of couch, 'save' is a convenience wrapper around 'put' and 'post'
// TODO: Implement couch-style
Engine.prototype.put = function () {
  this.save.apply(this, arguments);
};

// Update is a shorthand for mixing in new data with current data.
// This uses 'put'.
// TODO: Implement couch-style
Engine.prototype.update = function (key, obj, callback) {
  this.put(key, resourceful.mixin({}, this.store[key], obj), callback);
};


// Pulls data from disk
Engine.prototype.get =  function (key, callback) {
  key = key.toString();

  this.request(key, function (err, f) {
    if (err) {
      // Deal with the case of missing file
      if (err.status && err.status == 404) {
        return callback(err);
      }
      else {
        throw err;
      }
    }

    // Grab the file
    f.readFile(function (err, f) {
      // TODO: Add in custom file reading HERE
      callback(err, f);
    });

  });
};

// Removes a file from disk
// TODO: Add cache support
Engine.prototype.destroy = function (key, callback) {
  this.request(key, function (err, f) {
    if (err) {
      // Deal with the case of already-missing file
      if (err.status && err.status == 404) {
        return callback(err);
      }
      else {
        throw err;
      }
    }

    // TODO: Use rimraf here?
    f.unlink(function (err) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, { status: 204 });
      }
    });

  });
}

// Lets you find documents that match properties exactly.
// A specific case of filter.
// TODO: Implement for files
Engine.prototype.find = function (conditions, callback) {
  this.filter(function (obj) {
    return Object.keys(conditions).every(function (k) {
      return conditions[k] ===  obj[k];
    });
  }, callback);
};

// Run user-supplied function filter against all the files
// user gets synchronous exposure to select fs and stat data.
// TODO: Implement for files
Engine.prototype.filter = function (filter, callback) {
  var result = [];

  readTree(this.uri, function (err, resources) {
    if (err) {
      throw err;
    }

    Object.keys(resources).forEach(function (p) {
      // TODO: Filter against the most useful things.
      // Right now, resources[p] is *just* a stat object.
      if (filter(resources[p])) {
        result.push(resources[p]);
      }
    });

    callback(null, result);
  });
};

// Apparently used to sync against the design doc on the couch.
// We almost definitely don't need to implement this.
Engine.prototype.sync = function (factory, callback) {
  process.nextTick(function () { callback(); });
};
