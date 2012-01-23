var marked = require('marked');

exports.attach = function (opts) {

  var self = this;

  opts = opts || {};

  var property = opts.property;

  if (property) {
    self.addDocTransform(function markdownReader (doc) {
      if (doc[property]) {
        // Throw some markdown down.
        doc[property] = marked(String(doc[property]));
      }
    });

    // This is to tell Weld to simply attach the results without trying to
    // do an html encoding.
    self.addWeldAlias(property, function () {
      return false;
    });
  }
  else {
    throw new Error('Markdown reader does not know which field to parse.');
  }
}
