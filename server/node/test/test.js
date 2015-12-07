var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var should = chai.should();
chai.use(sinonChai);

describe('Users', function() {
  var users = require('../routeLogic/users');
  // use mocha-mongoose to automatically clear the database after each test
  var clearDB = require('mocha-mongoose')('mongodb://mongo/ironmailtest');
  require('../db/dbConnect');

  describe('Registration', function() {

    var validParams = {
      username: 'u1',
      password: 'p1',
      publicKey: 'test'
    };
    afterEach(function() {
      // reset validParams in case it got modified in a test
      validParams = {
        username: 'u1',
        password: 'p1',
        publicKey: 'test'
      };
    });

    it('should register a new user with valid data', function(done) {
      users.register(validParams, function(err, response) {
        err.should.be.false;
        response.should.equal('Successfully registered');
        done();
      });
    });

    it('should ensure that username is unique', function(done) {
      users.register(validParams, function(err, response) {
        err.should.be.false;
        response.should.equal('Successfully registered');
        users.register(validParams, function(err2, res2) {
          err2.should.be.true;
          res2.should.contain('duplicate key error');
          done();
        });
      });
    });

    // it('should not accept an invalid email', function(done) {
    //   var badEmail = validParams;
    //   badEmail.email = 'notanEmail';
    //   users.register(badEmail, function(err, response) {
    //     err.should.be.true;
    //     response.should.equal("ValidationError: Validator failed for path `email` with value `notanEmail`");
    //     done();
    //   });
    // });

    it('should not store passwords in plain text', function(done) {
      var userModel = require('../db/userModel');
      users.register(validParams, function(err, response) {
        err.should.be.false;
        userModel.findOne({'username': validParams.username}, function(err, user) {
          should.not.exist(err);
          user.password.should.not.equal(validParams.password);
          done();
        });
      });
    });
  });

  describe('Login', function() {

    // register a user
    beforeEach(function(done) {
      var validParams = {
        username: 'u1',
        password: 'p1',
        publicKey: 'test'
      };
      users.register(validParams, function(err, response) {
        if (!err) {
          done();
        }
      });
    });

    it('should allow a successful login', function(done) {
      users.login({username: 'u1', password: 'p1'}, function(err, response) {
        err.should.be.false;
        response.should.equal('Successfully logged in');
        done();
      });
    });

    it('should prevent logging in with an invalid username', function(done) {
      users.login({username: 'u2', password: 'p1'}, function(err, response) {
        err.should.be.true;
        response.should.equal('Invalid username or password');
        done();
      });
    });

    it('should prevent logging in with an invalid password', function(done) {
      users.login({username: 'u1', password: 'bad'}, function(err, response) {
        err.should.be.true;
        response.should.equal('Invalid username or password');
        done();
      });
    });
  });

  describe('List', function() {
    // register some users
    beforeEach(function(done) {
      var validParams = {
        username: 'u1',
        password: 'p1',
        publicKey: 'test'
      };
      users.register(validParams, function(err, response) {
        if (!err) {
          validParams.username = 'u2';
          users.register(validParams, function(err, response) {
            if (!err) {
              validParams.username = 'differentName';
              users.register(validParams, function(err, response) {
                if (!err) {
                  done();
                }
              });
            }
          });
        }
      });
    });

    it('should list all users when provided with an empty string', function(done) {
      users.list({username: ''}, function(err, users) {
        users.should.have.length(3);
        done();
      });
    });

    it('should list users that match the given criteria', function(done) {
      users.list({username: 'u'}, function(err, users) {
        users.should.have.length(2);
        var expectedReturn = [
          {username: 'u1', publicKey: 'test'},
          {username: 'u2', publicKey: 'test'}
        ];
        users.should.deep.equal(expectedReturn);
        done();
      });
    });
  });
});

describe('Messages', function() {
  var messages = require('../routeLogic/messages');
  var clearDB = require('mocha-mongoose')('mongodb://mongo/ironmailtest', {noClear: true});
  require('../db/dbConnect');

  before(function(done) {
    clearDB(done);
  });
  // register some users
  before(function(done) {
    var users = require('../routeLogic/users');
    var validParams = {
      username: 'u1',
      password: 'p1',
      email: 'test@test.com',
      publicKey: 'test'
    };
    users.register(validParams, function(err, response) {
      if (!err) {
        validParams.username = 'u2';
        users.register(validParams, function(err, response) {
          if (!err) {
            done();
          }
        });
      }
    });
  });

  var timeEstimate;
  it('should save a properly formatted message', function(done) {
    messages.send({receiver: 'u2', prime: 13, subject: 'Testing', content: 'Secret'}, 'u1', function(err, response) {
      // create a timestamp to compare against later
      timeEstimate = Date.now();
      err.should.be.false;
      response.should.equal('Message sent');
      done();
    });
  });

  it('should not send a message to a user that does not exist', function(done) {
    messages.send({receiver: 'invalid', prime: 13, subject: 'Testing', content: 'Secret'}, 'u1', function(err, response) {
      err.should.be.true;
      response.should.equal("ValidationError: Validator failed for path `receiver` with value `invalid`");
      done();
    });
  });

  var messageID;
  it('should get all messages sent to a user', function(done) {
    messages.get('u2', function(err, response) {
      response.should.have.length(1);
      var retrievedMessage = response[0];
      retrievedMessage.should.have.keys('_id', 'sender', 'receiver', 'sharedPrime', 'subject', 'content', 'timestamp');
      messageID = retrievedMessage._id;
      retrievedMessage.sender.should.equal('u1');
      retrievedMessage.receiver.should.equal('u2');
      retrievedMessage.sharedPrime.should.equal('13');
      retrievedMessage.subject.should.equal('Testing');
      retrievedMessage.content.should.equal('Secret');
      // compare the saved timestamp to the one we created earlier with
      // an error margin of half a second (500 milliseconds)
      var returnedTimestamp = new Date(retrievedMessage.timestamp).getTime();
      returnedTimestamp.should.be.closeTo(timeEstimate, 500);
      done();
    });
  });

  it('should only let the receiver of a message delete it', function(done) {
    messages.delete(messageID, 'u1', function(err, doc) {
      should.not.exist(err);
      should.not.exist(doc);
      done();
    });
  });

  it('should delete a message', function(done) {
    messages.delete(messageID, 'u2', function(err, doc) {
      should.not.exist(err);
      should.exist(doc);
      messages.get('u2', function(err, response) {
        response.should.have.length(0);
        done();
      });
    });
  });
});
