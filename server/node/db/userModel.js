var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, validate: function(email) {
    // validate email using HTML5 regex specified by w3 (see
    // http://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single)
    return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
  }},
  publicKey: { type: String, required: true}
});

var User = mongoose.model('User', userSchema);

module.exports = User;
