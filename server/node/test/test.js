var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var should = chai.should();
chai.use(sinonChai);

describe('Users', function() {
  var users = require('../routeLogic/users');

  before(function() {
    // use mocha-mongoose to automatically clear the database after each test
    require('mocha-mongoose')('mongodb://mongo/ironmailtest');
    require('../db/dbConnect');
  });

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
        if(!err) {
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
});