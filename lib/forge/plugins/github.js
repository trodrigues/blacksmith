/*
 * github.js: Forge plugin for rendering github information.
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */


exports.attach = function (opts) {

  opts = opts || {};

  var self = this;

  // Custom alias for github username (link to your github)
  self.addWeldAlias('github', function (parent, element, key, value) {
    if (value) {

      if (val) {
        $(element).text("");
        $(element).append(
          $("<a>")
            .attr("href", "https://github.com/"+val)
            .text(val)
          );
        }
      return false;
    }
  });
}
