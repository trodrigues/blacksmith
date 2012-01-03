var fs = require('fs'),
    path = require('path'),
    touch = require('touch'),
    util = require('utile');

var resourceful = require('resourceful'),
    Cache = resourceful.Cache;

var readTree = require('./readTree'),
    request = require('./request'); // NOT the same as mikeal/request
                                    // TODO: Rename?

exports.stores = {};
exports.caches = {}; // TODO: Hook into caches


// TODO: Enforce no walking outside root

var Engine = exports.Engine = function (options) {

  // In this case, this.uri refers to file paths!
  this.uri = options.root || options.uri || path.resolve('./');

  // new filename generator
  this.newKey = (function filenameGenerator() {
    var counter = 0;

    return function iterate () {

      // TODO: smarter filenames (alternative: '.dat')
      var number = ++counter,
          p = path.resolve(root, String(number)+'.dat');

      // Make sure the file doesn't already exist.
      //
      // NOTE: A bunch of auto-named resources will take a relatively long time
      // to be dealt with on the first run.
      if (path.existsSync(p)) {
        return iterate();
      }
      else {
        return p;
      }
    }

  })();

  // Set up a cache.
  // TODO: Use cache.
  this.cache = new Cache;

};

// Make "requests" against a file p
// TODO: Think about the semantics here. What should this look like?
Engine.prototype.request = function (p, cb) {
  return request.call(this, p, cb);
}

Engine.prototype.protocol = 'file';

// "head" requests on couch only return the headers and not the file itself.
// Here, it's an alias for the standard "request" which doesn't read files
// anyway.
Engine.prototype.head = function () {
  this.request.apply(this, arguments);
}

// Create a file. Alias for post.
Engine.prototype.create = Engine.prototype.post = function (key, callback) {
  // TODO: Implement.

  var self = this;

  // Note, you still get the f helper so we can do it in one "request"
  self.request(key, function (err, stat, f) {
    if (err) {
      // Missing file? Good.
      if (err.status && err.status == 404) {
        // Create the file here.
        // TODO: Allow for writing file contents?
        f.create(function (err) {
          if (err) {
            return callback(err);
          }

          // Let's get the latest stats and f!
          self.request(key, callback);
        });
        
      }
      else {
        // There's a non-404 error? That's probably bad.
        callback(err);
      }
    }
    else {
      // File exists? Throw an error.
      callback(new Error('File ' + stat.fullPath + ' already exists!'));
    }
  });
}

// Read a file from disk.
Engine.prototype.get =  function (key, callback) {

  key = key.toString();

  this.request(key, function (err, stat, f) {
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
    f.read(function (err, contents) {
      // TODO: Add in custom file reading HERE
      callback(err, contents);
    });

  });
};


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
  this.request(key, function (err, stat, f) {
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

// Only save a document if it already exists.
// Overwrites entire document without attempting to merge content.
Engine.prototype.put = function (key, val, callback) {

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
  this.request(key, function (err, stat, f) {
    var self = this;

    if (err) {
      // Handle "not found" case
      if (err.status && err.status == 404) {
        callback(null, error, val);
      }
      else {
        throw err;
      }
    }

    // TODO: Use the fs2-style writeFile
    // TODO: Make writing pluggable!
    f.writeFile(String(val), function (err) {
      if (err) {
        callback(err, { status: 500 });
      }

      callback(null, util.mixin({ status: 200 }, val));
    });
  });
};

// Update is a shorthand for mixing in new data with current data.
// This uses 'put'.
// TODO: Implement for files.
Engine.prototype.update = function (key, obj, callback) {
  this.get(key, function (err, contents) {
    // TODO: Pluggable merging functions
    if (err) {
      return callback(err);
    }

    // TODO: Figure out how to handle cases where "content" is NOT a {}
    this.put(key, resourceful.mixin({}, contents, obj), callback);
  });
};


// Loads data from disk
// TODO: Add cache support
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
Engine.prototype.find = function (conditions, callback) {
  this.filter(function (obj) {
    return Object.keys(conditions).every(function (k) {
      return conditions[k] ===  obj[k];
    });
  }, callback);
};

// Run user-supplied function filter against all the files
// user gets synchronous exposure to select fs and stat data.
Engine.prototype.filter = function (filter, callback) {
  var result = [];

  // A helper for doing .all, basically.
  readTree(this.uri, function (err, resources) {
    if (err) {
      callback(err);
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
