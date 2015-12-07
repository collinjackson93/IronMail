var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
// set defaults to use cookies and allow self-signed SSL certs
var request = require('request').defaults({jar: true, strictSSL: false});
var crypto = require('crypto');

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
  var keyExchangeObject = crypto.createDiffieHellman(1024);
  var pubKey = keyExchangeObject.generateKeys('hex');
  var privKey = keyExchangeObject.getPrivateKey('hex');

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



// ****** OUTDATED ********
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
  // 1. get user's private key
  var localPrivateKey = getPrivateKey();

  // 2. get intended recipient's public key
  getPublicKeyOf(receiver, function(recipientPublicKey) {
    // 3. initialize DH object with a random prime of length 1024
    console.log('creating dhObject');
    var dhObject = crypto.createDiffieHellman(1024);
    console.log('setting private key');
    dhObject.setPrivateKey(localPrivateKey, 'hex');

   // 4. generate shared secret, interpreting the string localRecipientKey using hex encoding
   console.log('generating shared secret');
    var sharedSecret = dhObject.computeSecret(recipientPublicKey, 'hex', 'hex');

    // 5. encrypt message using shared secret and cipher
    console.log('creating cipher');
    var createdCipher = crypto.createCipher(CIPHER, sharedSecret);

    console.log('encrypting text');
    var encryptedText = createdCipher.update(content, 'utf8', 'hex');

    var params = {
      receiver: receiver,
      subject: sub,
      prime: dhObject.getPrime('hex'),
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
      console.log('failed to retrieve messages: ' + val.toSring());
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

  // 1. get sender's public key
  //var senderPublicKey = getPublicKeyOf(req.body.sender);
  getPublicKeyOf(message.sender, function(senderPublicKey) {
    // 2. generate DH object with prime that was originally used
    var dhObject = crypto.createDiffieHellman(message.sharedPrime, 'hex');
    dhObject.setPrivateKey(getPrivateKey(), 'hex');

    // 3. generate shared secret, interpreting the string localRecipientKey using hex encoding
    var sharedSecret = dhObject.computeSecret(senderPublicKey, 'hex', 'hex');

    // 4. create decipher object and decript content
    var decipherObject = crypto.createDecipher(CIPHER, sharedSecret);

    var decipheredMessage = decipherObject.update(message.content, 'hex', 'utf8');
    res.send(decipheredMessage);
  });
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



// ***REMOVE THIS FUNCTION LATER***
app.get('/publicPrivateKeyGen', function(req, res) {
  getPublicKeyOf('u4', function(publicKey) {
    var keys = {
      public: publicKey,
      private: getPrivateKey()
    };
    res.json(keys);
  });
});
