var express = require('express');
var app = express();
var db = require('monk')('mongo:27017/test');
var users = db.get('users');
var path = require('path');
var cors = require('cors');

users.insert({name: 'World'});

app.use(express.static(path.join("./../client/", 'public')));
app.use(cors());

app.get('/', function (req, res) {
  res.sendFile("IronMail.html", {"root": "./../client"});
});

app.get('/len', function(req, res) {
  users.find({}, function(err, docs) {
    res.send(''+docs.length);
  });
});

app.get('/clear', function(req, res) {
  users.remove({}, function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send('Successfully cleared database');
    }
  });
});

var server = app.listen(3000, function () {
  console.log("Server listening at http://localhost:3000");
});
