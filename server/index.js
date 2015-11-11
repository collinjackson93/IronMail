var express = require('express');
var app = express();
var db = require('monk')('mongo:27017/test');
var users = db.get('users');
var path = require('path');

users.insert({name: 'World'});

app.get('/', function (req, res) {
  try {
    users.findOne({}, function(err, doc) {
      res.send('Hello ' + doc.name + '!');
    });
  } catch (e) {
    res.send("Something went wrong!");
  }
});

app.get('/len', function(req, res) {
  users.find({}, function(err, docs) {
    try {
      res.send('' + docs.length);
    }
    catch(exception){
      res.send(exception);
    }
  });
});

app.get('/insert', function(req, res){
  users.insert({name: 'World'});
  res.send("inserted");
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
