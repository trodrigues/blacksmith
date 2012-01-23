var vows = require('vows'),
    assert = require('assert'),
    forge = require('../lib/forge'),
    plugins = forge.plugins,
    util = require('util');

vows.describe('blacksmith.forge').addBatch({
  'A basic generator with no plugins': {
    topic: function () {
      var topic = this;

      var generator = forge({
        logger: console.log
      });

      generator.init(function (err) {
        topic.callback(err, generator);
      });

    },
    'doesn\'t throw an error': function (err, generator) {
      assert.doesNotThrow(function () {
        if (err) {
          throw err;
        }
      });
    },
    'can do a basic weld job': function (err, generator) {

      // Why you hatin' on my method dawg? (I do wish proxying generator() to
      // .generate was something I was/could be doing)
      var html = generator.generate({
        template: [
          '<ul class="contacts">',
          '  <li class="contact">',
          '    <span class="name">My Name</span>',
          '    <p class="title">Leet Developer</p>',
          '  </li>',
          '</ul>'
        ].join('\n'),
        contacts: [
          { name: 'hij1nx', title : 'code slayer' },
          { name: 'tmpvar', title : 'code pimp' }
        ]
      });

      // Not a particularly robust way of testing this (string comps I mean)
      assert.equal(html, [
        '<ul class="contacts">',
        '  <li class="contact">',
        '    <span class="name">hij1nx</span>',
        '    <p class="title">code slayer</p>',
        '  </li>',
        '</ul><ul class="contacts">',
        '  <li class="contact">',
        '    <span class="name">tmpvar</span>',
        '    <p class="title">code pimp</p>',
        '  </li>',
        '</ul>'
      ].join('\n'));
    }
  },

  'A basic generator with a plugin that does nothing': {
    topic: function () {
      var topic = this;

      var generator = forge({
        logger: console.log
      });

      generator.use({
        attach: function () {},
        init: function (d) { d(); }
      });

      generator.init(function (err) {
        topic.callback(err, generator);
      });

    },
    'doesn\'t throw an error': function (err, generator) {
      assert.doesNotThrow(function () {
        if (err) {
          throw err;
        }
      });
    },
    'can do a basic weld job': function (err, generator) {

      // Copypasted from earlier, doesn't test the plugins rigorously
      var html = generator.generate({
        template: [
          '<ul class="contacts">',
          '  <li class="contact">',
          '    <span class="name">My Name</span>',
          '    <p class="title">Leet Developer</p>',
          '  </li>',
          '</ul>'
        ].join('\n'),
        markdown: '# HELLO',
        contacts: [
          { name: 'hij1nx', title : 'code slayer' },
          { name: 'tmpvar', title : 'code pimp' }
        ]
      });

      assert.equal(html, [
        '<ul class="contacts">',
        '  <li class="contact">',
        '    <span class="name">hij1nx</span>',
        '    <p class="title">code slayer</p>',
        '  </li>',
        '</ul><ul class="contacts">',
        '  <li class="contact">',
        '    <span class="name">tmpvar</span>',
        '    <p class="title">code pimp</p>',
        '  </li>',
        '</ul>'
      ].join('\n'));
    }
  },
}).export(module);
