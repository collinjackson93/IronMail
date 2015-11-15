var app = require('express')();
var bodyParser = require('body-parser');
var users = require('./routeLogic/users');
require('./db/dbConnect');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Testing');
});

app.post('/login', function(req, res) {
  users.login(req.body, function(err, response) {
    if (err) {
      res.status(401).send(response);
    } else {
      res.send(response);
    }
  });
});

app.post('/register', function(req, res) {
  users.register(req.body, function(err, response) {
    if (err) {
      res.status(400).send(response);
    } else {
      res.send(response);
    }
  });
});

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log("Server listening at http://localhost:%s", port);
});
