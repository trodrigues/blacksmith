exports.attach = function (opts) {

  var self = this;

  opts = opts || {};

  self.addDocTransform(function setDefaults (doc) {
    Object.keys(opts).forEach(function (k) {
      if (!doc[k]) {
        doc[k] = opts[k];
      }
    });
  });
}
