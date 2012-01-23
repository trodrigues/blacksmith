/*
 * twitter.js: Forge plugin for rendering twitter information.
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */


exports.attach = function (opts) {

  opts = opts || {};

  var self = this;

  // Custom alias for twitter username (link to your twitter)
  self.addWeldAlias('twitter', function (parent, element, key, value) {
    if (value) {

      if (val) {
        $(element).text("");
        $(element).append(
          $("<a>")
            .attr("href", "http://twitter.com/"+val)
            .text(val)
          );
        }
      return false;
    }
  });
}
