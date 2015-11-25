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
      email: 'test@test.com',
      publicKey: 'test'
    };
    afterEach(function() {
      // reset validParams in case it got modified in a test
      validParams = {
        username: 'u1',
        password: 'p1',
        email: 'test@test.com',
        publicKey: 'test'
      };
    });

    it('should register a new user with valid data', function() {
      users.register(validParams, function(err, response) {
        err.should.be.false;
        response.should.equal('Successfully registered');
      });
    });

    it('should ensure that username is unique', function() {
      users.register(validParams, function(err, response) {
        err.should.be.false;
        response.should.equal('Successfully registered');
        users.register(validParams, function(err2, res2) {
          err2.should.be.true;
          res2.should.contain('duplicate key error');
        });
      });
    });

    it('should not accept an invalid email', function() {
      var badEmail = validParams;
      badEmail.email = 'notanEmail';
      users.register(badEmail, function(err, response) {
        err.should.be.true;
        response.should.equal("ValidationError: Validator failed for path `email` with value `notanEmail`");
      });
    });

    it('should not store passwords in plain text', function() {
      var userModel = require('../db/userModel');
      users.register(validParams, function(err, response) {
        err.should.be.false;
        userModel.findOne({'username': validParams.username}, function(err, user) {
          should.not.exist(err);
          user.password.should.not.equal(validParams.password);
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
        email: 'test@test.com',
        publicKey: 'test'
      };
      users.register(validParams, function(err, response) {
        if (!err) {
          done();
        }
      });
    });

    it('should allow a successful login', function() {
      users.login({username: 'u1', password: 'p1'}, function(err, response) {
        err.should.be.false;
        response.should.equal('Successfully logged in');
      });
    });

    it('should prevent logging in with an invalid username', function() {
      users.login({username: 'u2', password: 'p1'}, function(err, response) {
        err.should.be.true;
        response.should.equal('Invalid username or password');
      });
    });

    it('should prevent logging in with an invalid password', function() {
      users.login({username: 'u1', password: 'bad'}, function(err, response) {
        err.should.be.true;
        response.should.equal('Invalid username or password');
      });
    });
  });

  describe('List', function() {
    // register some users
    beforeEach(function(done) {
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

    it('should list all users when provided with an empty string', function() {
      users.list({username: ''}, function(err, users) {
        users.should.have.length(3);
      });
    });

    it('should list users that match the given criteria', function() {
      users.list({username: 'u'}, function(err, users) {
        users.should.have.length(2);
        var expectedReturn = [
          {username: 'u1', publicKey: 'test'},
          {username: 'u2', publicKey: 'test'}
        ];
        users.should.deep.equal(expectedReturn);
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
  // before(function(done) {
  //   var users = require('../routeLogic/users');
  //   var validParams = {
  //     username: 'u1',
  //     password: 'p1',
  //     email: 'test@test.com',
  //     publicKey: 'test'
  //   };
  //   users.register(validParams, function(err, response) {
  //     if (!err) {
  //       validParams.username = 'u2';
  //       users.register(validParams, function(err, response) {
  //         if (!err) {
  //           done();
  //         }
  //       });
  //     }
  //   });
  // });

  it('should save a properly formatted message', function() {
    messages.send({receiver: 'u2', sharedPrime: 13, subject: 'Testing', content: 'Secret'}, 'u1', function(err, response) {
      err.should.be.false;
      response.should.equal('Message sent');
    });
  });

  it('should not send a message to a user that does not exist', function() {
    messages.send({receiver: 'invalid', sharedPrime: 13, subject: 'Testing', content: 'Secret'}, 'u1', function(err, response) {
      err.should.be.true;
      response.should.equal("ValidationError: Validator failed for path `receiver` with value `invalid`");
    });
  });
});
