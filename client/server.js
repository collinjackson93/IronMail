var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
// set defaults to use cookies and allow self-signed SSL certs
var request = require('request').defaults({jar: true, strictSSL: false});
var crypto = require('crypto');
var ursa = require('ursa');

var server = app.listen(5000, function () {
  console.log("Server listening at https://localhost:5000");
});

const LOGINPAGE = "IronMail.html";
const FILENAME = "pk.txt";
var inbox = {};
var users = {};

const CIPHER = "aes-256-ctr";
const HASH = "sha256";

var privateKey = null;

const HOST = 'https://107.170.176.250';
const loginOptions = {
  path: '/login',
  method: 'POST'
};

const registerOptions = {
  path: '/register',
  method: 'POST'
};

const logoutOptions = {
  path: '/logout',
  method: 'GET'
};

const sentMessageOptions = {
  path: '/sendMessage',
  method: 'POST'
};

const getMessagesOptions = {
  path: '/getMessages',
  method: 'GET'
};

const userListOptions = {
  path: '/user',
  method: 'POST'
};

// TODO: delete message
const deleteMessageOptions = {
  path: '/deleteMessage',
  method: 'Post'
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// all calls to server sent through this function
function callServer(options, params, cb) {
  request({
    url: HOST + options.path,
    method: options.method,
    json: params
  },
  cb);
}

// sends webpage initially
app.get('/', function (req, res) {
  res.sendFile( __dirname + "/IronMail.html" );
  console.log("sent the page");
});

// ***REGISTRATION***
app.post('/addNewUser', function(req, res) {
  var key = ursa.generatePrivateKey();
  var privKey = key.toPrivatePem().toString();
  var pubKey = key.toPublicPem().toString();


  storePrivateKeyLocally(privKey);

  var cb = function(err, response, val) {
    if (err || response.statusCode != 200) {
      res.send("register failed");
      console.error(val);
    } else {
      console.log('signed up');
      res.send(true);
    }
  };

  onSignUp(req.body.username, req.body.password, pubKey, cb);
});
function onSignUp(user, pass, key, cb) {
  var params = {
    username: user,
    password: pass,
    publicKey: key
  };
  callServer(registerOptions, params, cb);
}

function storePrivateKeyLocally(key) {
  /*fs.acess(FILENAME, fs.W_OK, function(error) {
    console.log(error ? 'cannot access pKey.txt' : 'got access to write private key');
      if (!error) {*/
        fs.writeFile(FILENAME, key, null, function(error) {
          if (error) {
            console.error('private key not stored properly');
          } else {
            console.log('private key stored!');
          }
        });
      /*}
  });*/
}

// ***LOGIN***
app.post('/logIn', function(req, res) {
  var cb = function(err, response, val) {
    if (err || response.statusCode !== 200) {
      res.send('login failed');
      console.error(val);
    } else {
      res.send('logged in');
    }
  };
  onLoginAttempt(req.body.username, req.body.password, cb);
});
function onLoginAttempt(username, password, cb) {
  var params = {
    username: username,
    password: password
  };
  callServer(loginOptions, params, cb);
}



// ***SEND EMAIL***
app.post('/sendMessage', function(req, res) {
  var cb = function(err, response, val) {
    if (err || response.statusCode !== 200) {
      res.send(val);
    } else {
      res.send('email sent');
    }
  };
  onSentMessage(req.body.receiver, req.body.subject, req.body.content, cb);
});
function onSentMessage(receiver, sub, content, cb) {
  getPublicKeyOf(receiver, function(pubKeyString) {
    var pubKeyObject = ursa.createPublicKey(pubKeyString);
    var encryptedText = pubKeyObject.encrypt(content, 'utf8', 'hex');

    var params = {
      receiver: receiver,
      subject: sub,
      prime: 17,
      content: encryptedText
    };
    console.log('calling server');
    callServer(sentMessageOptions, params, cb);
  });
}

// ***RETRIEVE MESSAGES***
app.get('/getMessages', function(req, res) {
  var cb = function(err, response, val) {
    if (err || response.statusCode !== 200) {
      console.log('failed to retrieve messages: ' + val.toString());
      res.send(val);
    } else {
      console.log('messages retrieved');
      res.json(val);

      // iterate through array, creating a map for faster lookup later
      for (var i = 0; i < val.length; ++i) {
        inbox[val[i]._id] = val[i];
      }
    }
  };
  retrieveMessages(cb);
});
function retrieveMessages(cb) {
  var params = {};
  callServer(getMessagesOptions, params, cb);
}

// ***OPEN MESSAGE***
app.post('/openMessage', function(req, res) {
  var messageID = req.body._id;
  var message = inbox[messageID];
  var privateKey = ursa.createPrivateKey(getPrivateKey());
  var decipheredMessage = privateKey.decrypt(message.content, 'hex', 'utf8');
  res.send(decipheredMessage);
});

// ***GET USER's KEYS***
function getPublicKeyOf(user, cb) {
  var params = {username: user};
  callServer(userListOptions, params, function(err, response, val) {
    if (err || response.statusCode !== 200) {
      console.error(val);
      cb(null);
    } else {
      for(var i = 0; i < val.length; ++i) {
        if(val[i].username == user) {
          return cb(val[i].publicKey);
        }
      }
      // username was not found for some reason
      cb('failed to find');
    }
  });
}
function getPrivateKey() {
  var retVal;
  try {
    retVal = fs.readFileSync(FILENAME, 'utf8');
  } catch (e) {
    retVal = e.toString();
  } finally {
    return retVal;
  }
}

// ***LOGOUT***
app.get('/logout', function(req, res) {
  var cb = function(err, response, val) {
    if (err || response.statusCode !== 200) {
      res.send('logout failed');
      console.error(val);
    } else {
      res.send('logged out');
    }
  };
  onLogoutAttempt(cb);
});
function onLogoutAttempt(cb) {
  var params = {};
  callServer(logoutOptions, params, cb);
}


// ***DELETE***
app.post('/deleteMessage', function(req, res) {
  var cb = function(err, response, val) {
    if (err || response.statusCode !== 200) {
      res.send('failed to delete message');
      console.error(val);
    } else {
      res.send('message deleted')
    }
  }
  var params = {
    _id: req.body._id
  }
  callServer(deleteMessageOptions, params, cb);
})

// ***DEBUGGING***
app.get('/publicPrivateKeyGen', function(req, res) {
  getPublicKeyOf('u4', function(publicKey) {
    var keys = {
      public: publicKey,
      private: getPrivateKey()
    };
    res.json(keys);
  });
});
