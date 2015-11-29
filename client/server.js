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

const logoutOptions = {
  hostname: HOST,
  path: '/logout',
  method: 'GET'
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// app.use(cors());

// **Default Callback**
// Default callback function that is sent to cloud server
// and used to pass back reasons that certain actions fail
// TODO: ask collin to take a look at this to see what he needs for error cases
var callback = function(error, returnval) {
  if (error) {
    console.log(error);
    return;
  }
  //console.log(returnval);
};

// all calls to server sent through this function
// TODO: re-write this to use callback to pass explanation of errors
function callServer(options, data, cb) {
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
        // talk to Collin about this process
        cb();
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
};

var onLoginAttempt = function(username, password) {
  var params = {
    username: username,
    pasasword: password
  };
  if (callServer(loginOptions, params, callback)) {
    res.send('logged in');
  } else {
    res.send('login failed');
  };
};

var onLogoutAttempt = function(username) {
  var params = {
    username: username
  };
  if (callServer(logoutOptions, params, callback)) {
    res.send('logged out');
  } else {
    res.send('logout failed');
  }
};

var onSignUp = function(user, pass, email) {
    var params = {
        username: user,
        password: pass
    };
    if (callServer(registerOptions, params, callback)) {
        res.send('signed up');
    } else {
        res.send("register failed");
    }
}

var onSentEmail = function(from, to, email) {
  var params = {
    from: from,
    to: to,
    subject: email.subject,
    body: email.body
  }

  if (callServer(sendMailOptions, params, callback)) {
    res.send('email sent');
  } else {
    res.send('email failed to send');
  };
};

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

// TODO: what will emails and receivers of emails be called/look like in terms of requests?
app.post('/sendEmail', function(req, res) {
  onSentEmail(req.body.username, req.body.address, req.body.email);
});

app.get('/logout', function(req, res) {
  onLogoutAttempt(req.body.username);
});

var server = app.listen(5000, function () {
  console.log("Server listening at http://localhost:5000");
});
