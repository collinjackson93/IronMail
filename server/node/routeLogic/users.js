var User = require('../db/userModel');

function login(req, res) {
  res.send('login');
}

function register(params, res) {
  var user = new User({
    username: params.username,
    password: params.password,
    email: params.email,
    publicKey: params.publicKey
  });
  user.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send('Successfully registered');
    }
  })
}

module.exports = {
  login: login,
  register: register
}
