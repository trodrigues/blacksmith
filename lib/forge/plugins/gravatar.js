/*
 * gravatar.js: Forge plugin for rendering gravatars from email.
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */


var crypto = require('crypto');

// Feed email, return gravatar
function email2gravatar (email, opts) {
  var size = (opts && opts.size) || '200',
      md5 = crypto.createHash('md5')
        .update(String(email).trim().toLowerCase())
        .digest('hex');

  return "http://www.gravatar.com/avatar/"
    + md5 + "?r=pg&s="
    + size + ".jpg&d=identicon";
}



exports.attach = function (opts) {

  opts = opts || {};

  var self = this;

  self.addTransform(function gravatar (doc) {

    // Alias, since the identifying mark of the gravatar is your email.
    doc.gravatar = doc.gravatar || doc.email;

    // Custom alias for gravatar.
    self.addAlias('gravatar', function (parent, element, key, value) {
      if (value) {

        // TODO: Migrate gravatar helper here.
        self.$(element).attr('src', email2gravatar(val, opts));
      }
    });

  });
}
