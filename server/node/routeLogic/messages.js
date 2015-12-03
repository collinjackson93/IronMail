var Message = require('../db/messageModel');
var dbHelper = require('../db/dbHelper');

function send(params, sender, cb) {
  var message = new Message({
    sender: sender,
    receiver: params.receiver,
    subject: params.subject,
    content: params.content,
    hash: params.hash,
    cypher: params.cypher
  });
  message.save(function(err) {
    if (err) {
      cb(true, err.toString());
    } else {
      cb(false, 'Message sent');
    }
  });
}

function get(receiver, cb) {
  Message.find({'receiver': receiver}, '-__v', function(err, data) {
    dbHelper.docsToObjects(err, data, cb);
  });
}

module.exports = {
  send: send,
  get: get
}
