var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');
var https = require('https');
var fs = require('fs');
var PORT = 3000;
var HOST = 'localhost';
//var router = require('http://localhost:5000/server/node/router.js');
//var forever = require('http://localhost:5000/server/node/forever.js');

var loginPage = "IronMail.html";

var options = {
    hostname: '107.170.176.250',
    port: PORT,
    path: '/',
    method: 'GET'
};

var bigserver = https(options);


app.use(express.static(path.join("./", 'public')));
app.use(cors());

var server = app.listen(5000, function () {
  console.log("Server listening at http://localhost:5000");
  /*var pathname = server.pathname;
  var port = server.port;*/
});

app.get('/', function (req, res) {
    res.sendFile(loginPage, {root: __dirname});
    console.log("sent the page");
});

var onSignUpClicked = function() {
    console.log("this guy's signing up");
    document.write("sign me up scottie");
};


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
    return bigserver.get('/login(params)')
};

var onSignUp = function(user, pass) {
    onSignUpClicked();
    // store user name and password (and public key?)
    var params = {
        username: user,
        password: pass
    }
    if (makeCredentials) {
        // take user to inbox
    } else {
        res.send(); //reason why not successful
    }
}

var makeCredentials = function(params) {
    return bigserver.get('/register(params)');
}

app.post('/', function(req, res) {
    console.log(req.body);
    onLoginAttempt(username, password);
});