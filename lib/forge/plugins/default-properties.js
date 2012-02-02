/*
 * default-properties.js: Forge plugin to set default properties in the
 *  document, if they aren't already defined.
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */


exports.attach = function (opts) {

  var self = this;

  opts = opts || {};

  self.addDocTransform(function setDefaults (doc) {

    // Iterate through keys, set them if necessary
    Object.keys(opts).forEach(function (k) {
      if (!doc[k]) {
        doc[k] = opts[k];
      }

    });
  });
}
