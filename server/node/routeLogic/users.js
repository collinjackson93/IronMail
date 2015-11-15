var User = require('../db/userModel');

function login(params, cb) {
  var invalidLogin = 'Invalid username or password';
  User.findOne({'username':params.username}, function(err, user) {
    if (!user) {
      // incorrect username
      cb(true, invalidLogin);
    } else if (params.password === user.password) {
      cb(false, 'Successfully logged in');
    } else {
      // incorrect password
      cb(true, invalidLogin);
    }
  });
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
      cb(true, err.toString());
    } else {
      cb(false, 'Successfully registered');
    }
  })
}

module.exports = {
  login: login,
  register: register
}
