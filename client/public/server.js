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
    port: 443,
    path: '/',
    method: 'GET'
};

var bigserver = https._options(options);


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

    if (validateCredentials(username, password)) {
        res.send(); //inbox
    } else {
        res.send(loginPage, {root: __dirname});
    };

};

var validateCredentials = function() {

};

var onSignUp = function() {
    onSignUpClicked();
    // store user name and password (and public key?)
}


app.post('/', function(req, res) {
    console.log(req.body);
    onLoginAttempt(username, password);
});