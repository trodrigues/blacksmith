
// Shared scopage between attach and init
var resource,
    property;

exports.attach = function (opts) {
  opts = opts || {};

  resource = opts.resource,
  property = opts.property;

  if (typeof resource == 'undefined') {
    throw new Error('You need to define a resourceful resource!');
  }

  if (typeof property == 'undefined') {
    throw new Error('You need to specify a property!');
  }

}

exports.init = function (done) {
  var self = this;

  // Look up the resource on init instead of on transform.
  resource.get(property, function (err, obj) {
    if (err) {
      return done(err);
    }

    // Add the doc transform to our object now.
    // Note: This approach may end up causing some out-of-order issues..?
    self.addDocTransform(function (doc) {
      doc[property] = obj;
    });

    done();
  });
}
