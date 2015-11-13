var express = require('express');
var app = express();
var users = require('./routeLogic/users');

app.get('/', function (req, res) {
  res.send('Testing')
});

app.post('/login', users.login);

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log("Server listening at http://localhost:%s", port);
});
