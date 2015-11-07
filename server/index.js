var express = require('express');
var app = express();
var db = require('monk')('mongo:27017/test');
var users = db.get('users');

users.insert({name: 'World'});

app.get('/', function(req, res) {
  users.findOne({}).on('success', function(doc) {
    res.send('Hello, ' + doc.name + '!');
  });
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

app.listen(3000);
