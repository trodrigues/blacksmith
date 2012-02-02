exports.attach = function (opts) {

  var app = this;

  app.on(['log', '*'].join(app.delimiter), function (msg) {
    var event = this.event.split(app.delimiter);

    var m = opts.logger || console.log;

    if (e[1] && m[e]) {
      m = m[e](msg);
    } else if (typeof(m) === 'function') {
      m(e[1]+': '+msg);
    } else {
      throw new Error('Do not know how to use this logger. Either use a function or a winston-compatible logger object.');
    }
  });
}
