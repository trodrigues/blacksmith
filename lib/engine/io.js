var fs = require('fs');

var json = exports.json = {};

json.reader = function (key, done) {

  // this.on('file', fileHandler);
  // this.on('whatever', thing);
  // this.on('end', stuff);


  // TODO: guard against stupid arguments
  // TODO: check extension
  if (this.isFile) {
    this.readFile(function (err, data) {
      // TODO: mixin id as filename
      // TODO: catch errs
      done(err, JSON.stringify(data.toString()));
    });
  }
  else {
    done();
  }
};

json.writer = function (key, data, done) {
  // TODO: writeFile should incorporate the fs2.writeFile features.
  this.writeFile(JSON.stringify(data), function (err) {
    cb(err ? err : null);
  });
}

var content = exports.content = {};

content.reader = function (key, done) {
  if (this.isDirectory) {
    // or something like this
    // dual: this.parent
    // I suspect this will have to be async.
    // TODO: Brainstorm alternatives and downsides.
    this.children.forEach(function (k) {
      // child is like a "this".
      // 'this' is the same context as content.reader.
      // TODO: Consider alternatives. This one is inspired by jquery.
      var child = this.reader(k);

      if ( path.basename(child._id) === 'content.md' ) {
        // do some shit
      }
      if ( path.basename(child._id) === 'page.json' ) {
        // do some other shit
      }

    });
  }
  else {
    done();
  }
}

content.writer = function (key, data, cb) {
  // TODO: Implement!
  cb(new Error('content.writer not implemented.'));
}
