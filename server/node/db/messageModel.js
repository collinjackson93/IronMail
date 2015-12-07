var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./userModel');

var messageSchema = new Schema({
  sender: { type: String, required: true, validate: validUser },
  receiver: { type: String, required: true, validate: validUser },
  sharedPrime: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// check that user exists in database
function validUser(username, cb) {
  User.count({username: username}, function(err, count) {
    cb(!err && count === 1);
  });
}

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;
