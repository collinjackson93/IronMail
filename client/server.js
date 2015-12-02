var express = require('express');
var app = express();
var path = require('path');
// var cors = require('cors');
var https = require('https');
var bodyParser = require('body-parser');
var fs = require('fs');
const HOST = '107.170.176.250';
var cookies = require('cookies');
var loginPage = "IronMail.html";

var server = app.listen(5000, function () {
  console.log("Server listening at http://localhost:5000");
});

const loginOptions = {
  hostname: HOST,
  path: '/login',
  method: 'POST'
};

const registerOptions = {
  hostname: HOST,
  path: '/register',
  method: 'POST'
};

const logoutOptions = {
  hostname: HOST,
  path: '/logout',
  method: 'GET'
};

const sentMessageOptions = {
  hostname: HOST,
  path: '/sendMessage',
  method: 'POST'
};

const getMessagesOptions = {
  hostname: HOST,
  path: '/getMessages',
  method: 'GET'
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// app.use(cors());

// all calls to server sent through this function
function callServer(options, data, cb) {
  options.headers = {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  };

  var req = https.request(options, function(res) {
    res.on('data', function(data) {
      // if the status code is not 200, there was an error
      var error = res.statusCode !== 200;
      cb(error, data);
    });
  });

  req.on('error', function(e) {
    console.error(e);
    cb(true, e);
  });

  req.write(data);
  req.end();
};

// sends webpage initially
app.get('/', function (req, res) {
  res.sendFile( __dirname + "/IronMail.html" );
  console.log("sent the page");
});

// ***REGISTRATION***
app.post('/addNewUser', function(req, res) {
  var cb = function(err, val) {
    if (err) {
      res.send("register failed");
      console.error(val);
    } else {
      res.send('signed up');
    }
  };
  onSignUp(req.body.username, req.body.password, req.body.email, cb);
});
function onSignUp(user, pass, email, cb) {
  var params = {
    username: user,
    password: pass
  };
  callServer(registerOptions, params, cb);
}

// ***LOGIN***
app.post('/logIn', function(req, res) {
  var cb = function(err, val) {
    if (err) {
      res.send('login failed');
      console.error(val);
    } else {
      res.send('logged in');
    }
  };
  onLoginAttempt(req.body.username, req.body.password, cb);
});
function onLoginAttempt(username, password, cb) {
  var params = {
    username: username,
    pasasword: password
  };
  callServer(loginOptions, params, cb);
}

// ***SEND EMAIL***
// TODO: what will emails and receivers of emails be called/look like in terms of requests?
app.post('/sendMessage', function(req, res) {
  var cb = function(err, val) {
    if (err) {
      res.send('email failed to send');
    } else {
      res.send('email sent');
    }
  };
  onSentMessage(req.body.username, req.body.address, req.body.email, cb);
});
function onSentEmail(from, to, email, cb) {
  var params = {
    from: from,
    to: to,
    subject: email.subject,
    body: email.body
  };
  callServer(sendMailOptions, params, cb);
}

// ***RETRIEVE MESSAGES***
app.get('/getMessages', function(req, res) {
  var cb = function(err, val) {
    if (err) {
      res.send('failed to retrieve messages');
    } else {
      res.send();
    }
  }
  onGetMessages(cb);
});
function retrieveMessages(cb) {
  var params = {};
  callServer(getMessagesOptions, params, cb);
};

// ***LOGOUT***
app.get('/logout', function(req, res) {
  onLogoutAttempt();
});
function onLogoutAttempt(username, cb) {
  var params = {
    username: username
  };
  callServer(logoutOptions, params, function(err, val) {
    if (err) {
      res.send('logout failed');
      console.error(val);
    } else {
      res.send('logged out');
    }
  });
}


