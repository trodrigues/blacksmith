/*
 * index.js: Load all the plugins from this folder (so, not this file).
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */


var fs = require('fs'),
    path = require('path'),
    modules = fs.readdirSync(__dirname);

// Helper for making pretty looking method names from filenames
function filename2method (fname) {
  return path.basename(fname, path.extname(fname)).replace(/-(\w)/g, function (match) {
    return match[1].toUpperCase();
  });
}

// Load all the plugins!
modules.forEach(function (lib) {
  if (lib !== 'index.js') {
    exports[filename2method(lib)] = require(path.resolve(__dirname, lib));
  }
});
