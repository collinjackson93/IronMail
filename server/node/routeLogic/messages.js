var Message = require('../db/messageModel');
var dbHelper = require('../db/dbHelper');

function send(params, sender, cb) {
  var message = new Message({
    sender: sender,
    receiver: params.receiver,
    sharedPrime: params.prime,
    subject: params.subject,
    content: params.content
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

function del(id, username, cb) {
  Message.findOneAndRemove({'_id': id, 'receiver': username}, cb);
}

module.exports = {
  send: send,
  get: get,
  delete: del
}
