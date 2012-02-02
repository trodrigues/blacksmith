/*
 * logger.js: Forge plugin for handling logging events.
 *
 * (C) 2012, Nodejitsu Inc.
 *
 */


exports.attach = function (opts) {

  var app = this,
      log = (opts.logger || console.log);

  app.on(['log', '*'].join(app.delimiter), function (msg) {
    var event = this.event.split(app.delimiter);

    if (e[1] && log[e]) {
      log = log[e](msg);
    } else if (typeof(log) === 'function') {
      log(e[1]+': '+msg);
    } else {
      throw new Error('Do not know how to use this logger. Either use a function or a winston-compatible logger object.');
    }
  });
}
