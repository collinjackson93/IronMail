var app = require('express')();
var bodyParser = require('body-parser');
var users = require('./routeLogic/users');
require('./db/dbConnect');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Testing');
});

app.post('/login', users.login);

app.post('/register', function(req, res) {
  users.register(req.body, function(response) {
    res.send(response);
  });
});

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log("Server listening at http://localhost:%s", port);
});
