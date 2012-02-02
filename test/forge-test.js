var vows = require('vows'),
    assert = require('assert'),
    forge = require('../lib/forge'),
    plugins = forge.plugins,
    util = require('util');

vows.describe('blacksmith.forge').addBatch({
  'A basic generator with no plugins': {
    topic: function () {
      var topic = this;

      var generator = forge();

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

      var generator = forge();

      generator.use({
        attach: function () {
          var self = this;
        }
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
  'A generator with the markdownReader plugin': {
    topic: function () {
      var topic = this;

      var generator = forge();

      generator.use(plugins.markdownReader, {
        "property": "markdown"
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
    'properly parses the markdown': function (err, generator) {

      var html = generator.generate({
        template: [
          '<div class="markdown">',
          '  foo',
          '</div>'
        ].join('\n'),
        markdown: '# HELLO\n'
      });

      assert.equal(html, [
        '<div class="markdown">',
        '  <h1>HELLO</h1>',
        '</div>'
      ].join('\n'));
    }
  }
}).export(module);
