var File = exports.File = function (head) {

  this.head = head;
  this.create = require('./create').call(this, head);
  this.read = require('./read').call(this, head);
  this.write = require('./write').call(this, head);
  this.destroy = require('./destroy').call(this, head);
  this.getParent = require('./get-parent').call(this, head);
  this.getSiblings: require('./get-siblings').call(this, head),
  this.getChildren: require('./get-children').call(this, head)

};
