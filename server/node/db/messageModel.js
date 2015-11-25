var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./userModel');

var messageSchema = new Schema({
  sender: { type: String, required: true, validate: validUser },
  receiver: { type: String, required: true, validate: validUser },
  sharedPrime: { type: Number, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true }
});

// check that user exists in database
function validUser(username) {
  User.count({username: username}, function(err, count) {
    return !err && count === 1;
  });
}

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;
