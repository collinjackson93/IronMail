var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var should = chai.should();
chai.use(sinonChai);

describe('User registration', function() {
  var users = require('../routeLogic/users');
  var validParams;

  before(function() {
    // use mocha-mongoose to automatically clear the database after each test
    require('mocha-mongoose')('mongodb://mongo/ironmailtest');
    require('../db/dbConnect');
  });

  beforeEach(function() {
    // reset validParams in case it got modified in a test
    validParams = {
      username: 'u1',
      password: 'p1',
      email: 'test@test.com',
      publicKey: 'test'
    };
  });

  it('should register a new user with valid data', function() {
    users.register(validParams, function(response) {
      response.should.equal('Successfully registered');
    });
  });

  it('should ensure that username is unique', function() {
    users.register(validParams, function(response) {
      response.should.equal('Successfully registered');
      users.register(validParams, function(res2) {
        res2.should.contain('duplicate key error');
      });
    });
  });

  it('should not accept an invalid email', function() {
    var badEmail = validParams;
    badEmail.email = 'notanEmail';
    users.register(badEmail, function(response) {
      response.should.equal("ValidationError: Validator failed for path `email` with value `notanEmail`");
    })
  });
});
