var User = require('../db/userModel');

function login(req, res) {
  res.send('login');
}

function register(req, res) {
  res.send('register');
}

module.exports = {
  login: login,
  register: register
}
