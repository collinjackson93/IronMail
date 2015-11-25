var Message = require('../db/messageModel');

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

module.exports = {
  send: send
}
