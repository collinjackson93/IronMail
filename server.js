/**
 * Created by Lawrence on 11/6/15.
 */

var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "IronMail.html" );
});

var server = app.listen(8080, function () {
    console.log("Server listening at http://localhost:8080");
});