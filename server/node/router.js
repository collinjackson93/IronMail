var app = require('express')();
var bodyParser = require('body-parser');
var session = require('express-session');
var users = require('./routeLogic/users');
var messages = require('./routeLogic/messages');
require('./db/dbConnect');

app.use(bodyParser.json());
app.use(session({secret: 'IronMailSessionSecret'}));

app.get('/', function (req, res) {
  var user = req.session.username ? req.session.username : 'Stranger';
  res.send('Hello ' + user);
});

app.post('/login', function(req, res) {
  users.login(req.body, function(err, response) {
    if (err) {
      res.status(401).send(response);
    } else {
      req.session.username = req.body.username;
      res.send(response);
    }
  });
});

app.get('/logout', function(req, res) {
  if (!req.session.username) {
    res.status(403).send('Not currently logged in');
  } else {
    req.session.destroy(function(err) {
      if (err) {
        console.error(err);
        res.status(500).send('Error while logging out: ' + err);
      } else {
        res.send('Logged out');
      }
    });
  }
});

app.post('/user', function(req, res) {
  users.list(req.body, function(err, response) {
    if (err) {
      res.status(500).send(response);
    } else {
      res.json(response);
    }
  });
});

app.post('/register', function(req, res) {
  users.register(req.body, function(err, response) {
    if (err) {
      res.status(400).send(response);
    } else {
      req.session.username = req.body.username;
      res.send(response);
    }
  });
});

app.post('/sendMessage', function(req, res) {
  if (!req.session.username) {
    res.status(403).send('Not currently logged in');
  } else {
    messages.send(req.body, req.session.username, function(err, response) {
      if (err) {
        res.status(400).send(response);
      } else {
        res.send(response);
      }
    });
  }
});

app.get('/getMessages', function(req, res) {
  if (!req.session.username) {
    res.status(403).send('Not currently logged in');
  } else {
    messages.get(req.session.username, function(err, response) {
      if (err) {
        res.status(500).send(response);
      } else {
        res.json(response);
      }
    });
  }
});

app.post('/deleteMessage', function(req, res) {
  if (!req.session.username) {
    res.status(403).send('Not currently logged in');
  } else  {
    messages.delete(req.body._id, req.session.username, function(err, doc) {
      if (err) {
        res.status(500).send(err.toString());
      } else if (!doc){
        res.status(400).send('Could not find message');
      } else {
        res.send('Deleted message');
      }
    });
  }
});

app.post('/deleteUser', function(req, res) {
  if (req.body.auth.username === 'admin' && req.body.auth.password === 'pass') {
    users.delete(req.body.username, function(err, doc) {
      if (err) {
        res.status(500).send(err.toString());
      } else if (!doc){
        res.status(400).send('Could not find user');
      } else {
        res.send('Deleted user');
      }
    });
  }
});

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log("Server listening at http://localhost:%s", port);
});
