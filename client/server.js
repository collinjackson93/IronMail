var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');
var https = require('https');
var fs = require('fs');
// var PORT = 443;
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
app.use(cors());

var server = app.listen(5000, function () {
  console.log("Server listening at http://localhost:5000");
  /*var pathname = server.pathname;
  var port = server.port;*/
});

app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "IronMail.html" );
    console.log("sent the page");
});

var onLoginAttempt = function(username, password) {
    var params = {
        username: username,
        pasasword: password
    }
    if (validateCredentials(params)) {
        res.sendFile(); //inbox
    } else {
        res.send(loginPage, {root: __dirname}); //back to login page
    };

};

var validateCredentials = function(params) {
    // return bigserver.get('/login(params)')
    var req = https.request(loginOptions, function(res) {
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
    req.end();
    req.on('error', function(e) {
      console.error(e);
    });
};

var onSignUp = function(user, pass) {
    onSignUpClicked();
    // store user name and password (and public key?)
    var params = {
        username: user,
        password: pass
    }
    if (makeCredentials) {
        res.send(inboxPage)// take user to inbox
    } else {
        res.send("register failed"); //reason why not successful
    }
}

var makeCredentials = function(params) {
    // return bigserver.get('/register(params)');
    var req = https.request(loginOptions, function(res) {
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
    req.end();
    req.on('error', function(e) {
      console.error(e);
    });
}

app.post('/', function(req, res) {
    console.log(req.body);
    onLoginAttempt(username, password);
});
