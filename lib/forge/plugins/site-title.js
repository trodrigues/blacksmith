/*
 * site-title.js: Forge plugin for Adjusting the web site's <title>
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */


exports.attach = function (opts) {

  opts = opts || {};

  var self = this;

  // Use some jquery wizardry!
  self.addDomTransform(function (dom, doc) {
    var $ = this.$;

    // Give the page a title.
    // TODO: Add masking?
    $('title', dom).text(
      opts.title || doc.title || ''
      + $('title', dom).text()
    );
  });
}
