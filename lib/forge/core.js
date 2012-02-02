/*
 * core.js: The foundations of the generator.
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */

var jsdom = require('jsdom'),
    weld = require('weld').weld,
    broadway = require('broadway'),
    plugins = require('./plugins');

exports.name = "core";

// TODO: Add a format management library (dom vs. jquery vs. raw html detection)

// On attach, set up the infrastructure for attaching more plugins.
exports.attach = function (options) {
  var core = this;

  core.welder = function welder (doc) {
    var dom = core.dom,
        $ = core.$;

    // doc includes a "template" property.
    dom.innerHTML = doc.template;

    weld(dom, doc, {
      "map": core.mapper, // Mapper will probably be extended somehow.
      "alias": core.aliases // May not use "alias" but I'd be dumb to ignore.
    });

    // May want to use callbacks instead.
    return dom;
      
  };

  // Some sense of doc transformational "middlewares"
  // `this` refers to "core."
  core.docXforms = [];
  core.domXforms = [];
  core.postXforms = [];

  core.aliases = {};

  // This is an "identity" mapper.
  core.mapper = function () {
    return true;
  };

  core.addDocTransform = function addDocTransform (xform) {
    core.docXforms.push(xform);
  };

  core.addDomTransform = function addDomTransform (xform) {
    core.domXforms.push(xform);
  };

  core.addPostTransform = function addPostTransform (xform) {
    core.postXforms.push(xform);
  };

  core.addWeldAlias = function (key, val) {
    core.aliases[key] = val;
  };

};

// On init, create the jsdom.
exports.init = function (done) {
  var core = this;

  // Create a dom and attach stuff to the main document.
  jsdom.env("<html><body></body></html>", [
    "./jquery.js"
  ], function (err, window) {

    if (err) {
      return cb(new Error("Error while creating jsdom: "+err.message));
    };

    var document = core.document = window.document;

    core.dom = document.createElement('div');
    core.$ = window.$;

    // Should probably init before defining this method.
    core.generate = function (doc) {

      var dom,
          text;

      if (typeof doc.template === 'undefined') {
        throw new Error('Generator requires `opts.template`.');
      }

      var processStack = function (stack, cb) {

        if (!Array.isArray(stack)) {
          stack = [stack];
        }

        // Hopefully this is never a perf. issue...
        stack.slice().reverse().forEach(cb);
      };

      // Sync for now, may use util.async later.
      // TODO: Come up with an elegant way of putting these out-of-order.
      // relatively low priority.

      processStack(core.docXforms, function (f) {
        doc = f.call(core, doc);
      });

      dom = core.welder.call(core, doc);

      processStack(core.domXforms, function (f) {
        dom = f.call(core, doc, dom);
      });

      text = dom.innerHTML;
      
      processStack(core.postXforms, function (f) {
        text = f.call(core, text);
      });

      return text;
      
    }

    done();
  });
};
