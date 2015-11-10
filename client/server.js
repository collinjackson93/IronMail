var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');

app.use(express.static(path.join("./", 'public')));
app.use(cors());

app.get('/', function (req, res) {
  res.sendFile("IronMail.html", {root: __dirname});
});

var server = app.listen(5000, function () {
  console.log("Server listening at http://localhost:5000");
});
