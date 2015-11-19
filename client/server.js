var express = require('express');
var app = express();
var path = require('path');
// var cors = require('cors');
var https = require('https');
var bodyParser = require('body-parser');
var fs = require('fs');
const HOST = '107.170.176.250';

var loginPage = "IronMail.html";

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

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// app.use(cors());

var onLoginAttempt = function(username, password) {
  var params = {
    username: username,
    pasasword: password
  };
  if (callServer(loginOptions, params)) {
    res.send('logged in');
  } else {
    res.send('login failed');
  };
};

var onSignUp = function(user, pass, email) {
    onSignUpClicked();
    // store user name and password (and public key?)
    var params = {
        username: user,
        password: pass
    };
    if (callServer(registerOptions, params)) {
        res.send('signed up');
    } else {
        res.send("register failed");
    }
}

// TODO: re-write this to take a callback so we can pass the failure reason
function callServer(options, data) {
  options.headers = {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  };

  var req = https.request(options, function(res) {
    if (res.statusCode == 200) {
      // success condition
      return true;
    } else {
      res.on('data', function(d) {
        // TODO: pass reason for failure
        return false;
      });
    }
  });

  req.on('error', function(e) {
    console.error(e);
    return false;
  });

  req.write(data);
  req.end();
}

app.get('/', function (req, res) {
  res.sendFile( __dirname + "/IronMail.html" );
  console.log("sent the page");
});

app.post('/logIn', function(req, res) {
  onLoginAttempt(req.body.username, req.body.password);
});

app.post('/addNewUser', function(req, res) {
  onSignUp(req.body.username, req.body.password, req.body.email);
});

var server = app.listen(5000, function () {
  console.log("Server listening at http://localhost:5000");
});
