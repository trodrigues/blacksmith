/*
 * "generator" object factory based on a weld and jquery shell and extensible
 * with broadway.
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */

var core = require('./core'),
    broadway = require('broadway'),
    plugins = require('./plugins');

// Nice little generator factory that returns a broadway with the core attached.
module.exports = function (options) {

  var generator = new broadway.App();

  generator.use(core, options);

  return generator;

};

exports.core = core;

exports.plugins = plugins;
