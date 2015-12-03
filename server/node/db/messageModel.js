var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./userModel');

var messageSchema = new Schema({
  sender: { type: String, required: true, validate: validUser },
  receiver: { type: String, required: true, validate: validUser },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  hash: { type: String, required: true },
  cypher: { type: String, required: true },
});

// check that user exists in database
function validUser(username, cb) {
  User.count({username: username}, function(err, count) {
    cb(!err && count === 1);
  });
}

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;
