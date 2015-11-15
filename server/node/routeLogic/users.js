var User = require('../db/userModel');

function login(req, res) {
  res.send('login');
}

function register(params, cb) {
  var user = new User({
    username: params.username,
    password: params.password,
    email: params.email,
    publicKey: params.publicKey
  });
  user.save(function(err) {
    if (err) {
      cb(err.toString());
    } else {
      cb('Successfully registered');
    }
  })
}

module.exports = {
  login: login,
  register: register
}
