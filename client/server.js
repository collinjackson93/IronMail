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

const DUMMYPRIVATEKEY = "E9 87 3D 79 C6 D8 7D C0 FB 6A 57 78 63 33 89 F4 45 32 13 30 3D A6 1F 20 BD 67 FC 23 3A A3 32 62";
const DUMMYPUBLICKEY = "E9 69 3D 79 C6 D8 7D C0 FB 6A 57 78 63 33 89 F4 45 32 13 30 3D A6 1F 20 BD 67 FC 23 3A A3 32 62";
const CYPHER = "aes-256-ctr";
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
  var keyExchangeObject = crypto.getDiffieHellman('modp14');
  var pubKey = keyExchangeObject.generateKeys('hex');
  var privKey = keyExchangeObject.getPrivateKey('hex');

  storePrivateKeyLocally(privKey);

  var cb = function(err, response, val) {
    if (err || response.status !== 200) {
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
    if (err || response.status !== 200) {
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
    if (err || response.status !== 200) {
      res.send(val);
    } else {
      res.send('email sent');
    }
  };
  onSentMessage(req.body.receiver, req.body.subject, req.body.content, cb);
});
function onSentMessage(receiver, sub, content, cb) {
  // 1. get user's private key
  var localPrivateKey = DUMMYPRIVATEKEY;

  // 2. get intended recipient's public key
  //var recipientPublicKey = getPublicKeyOf(receiver);
  var localRecipientKey = DUMMYPUBLICKEY;

  // 3. initialize DH object with a random prime of length 512
  var dhObject = crypto.createDiffieHellman(512);
  dhObject.setPrivateKey(DUMMYPRIVATEKEY, 'hex');

 // 4. generate shared secret, interpreting the string localRecipientKey using hex encoding
  var sharedSecret = dhObject.computeSecret(localRecipientKey, 'hex', 'hex');

  // 5. encrypt message using shared secret, hash and cypher
  var hashedSecret = crypto.createHash(HASH).update(sharedSecret).digest("binary");
  var createdCypher = crypto.createCypher(CYPHER, hashedSecret, crypto.randomBytes(128));

  var encryptedText = createdCypher.update(content);

  var params = {
    receiver: receiver,
    subject: sub,
    sharedPrime: dhObject.getPrime(),
    content: encryptedText
  };
  callServer(sentMessageOptions, params, cb);
};

// ***RETRIEVE MESSAGES***
app.get('/getMessages', function(req, res) {
  var cb = function(err, response, val) {
    if (err || response.status !== 200) {
      console.log('failed to retrieve messages: ' + val.toSring());
      res.send(val);
    } else {
      console.log('messages retrieved');
      res.json(val);

      // iterate through array, creating a map for faster lookup later
      for (var i = 0; i < val.length; ++i) {
        inbox[val[0]._id] = val[0];
      }
    }
  };
  retrieveMessages(cb);
});
function retrieveMessages(cb) {
  var params = {};
  callServer(getMessagesOptions, params, cb);
};

// ***OPEN MESSAGE***
app.post('/openMessage', function(req, res) {
  var messageID = req.body._id;
  var message = inbox[messageID];

  // 1. get sender's public key
  //var senderPublicKey = getPublicKeyOf(req.body.sender);
  var senderPublicKey = DUMMYPUBLICKEY;

  // 2. generate DH object with prime that was originally used
  var dhObject = crypto.createDiffieHellman(message.sharedPrime);
  dhObject.setPrivateKey(DUMMYPRIVATEKEY, 'hex');

  // 3. generate shared secret, interpreting the string localRecipientKey using hex encoding
  var sharedSecret = dhObject.computeSecret(senderPublicKey, 'hex', 'hex');

  // 4. construct symmetric block cypher
  var hashedSecret = crypto.createHash(HASH).update(sharedSecret).digest("binary");
  var decipherObject = crypto.createDecipher(CYPHER, hashedSecret);

  var decipheredMessage = decipherObject.update(req.body.content);
  res.send(decipheredMessage);
});

// ***GET USER's KEYS***
function getPublicKeyOf(user) {
  var keyValue = -1;
  var cb = function(err, response, val) {
    if (err || response.status !== 200) {
      keyValue = null;
    } else {
      keyValue = val;
    }
  }
  callServer(userListOptions, user, cb);
  if (keyValue == -1) {
    return 'synchronizing issue';
  } else {
    return keyValue;
  }
}
function getPrivateKey() {
  var privateKey = fs.readFile(FILENAME, function(error, data) {
    if (error) {
      console.log('private key not found');
      throw new Error;
      } else {
        console.log('private key found');
        return data;
      }
  })
  return privateKey;
};

// ***LOGOUT***
app.get('/logout', function(req, res) {
  var cb = function(err, response, val) {
    if (err || response.status !== 200) {
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
};



// ***REMOVE THIS FUNCTION LATER***
app.get('/publicPrivateKeyGen', function(req, res) {
  var keys = {
    public: DUMMYPUBLICKEY,
    private: DUMMYPRIVATEKEY
  }
  res.send(keys);
});
