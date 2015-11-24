var User = require('../db/userModel');
var bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

function login(params, cb) {
  var invalidLogin = 'Invalid username or password';
  User.findOne({'username':params.username}, function(err, user) {
    if (!user) {
      // incorrect username
      cb(true, invalidLogin);
    } else {
      if(bcrypt.compareSync(params.password, user.password)) {
        cb(false, 'Successfully logged in');
      } else {
        cb(true, invalidLogin);
      }
    }
  });
}

function register(params, cb) {
  var user = new User({
    username: params.username,
    password: bcrypt.hashSync(params.password, SALT_WORK_FACTOR),
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

function hashPass(plainText) {
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    bcrypt.hash(plainText, salt, function(err, hash) {
      return hash;
    });
  });
}

module.exports = {
  login: login,
  register: register
}
