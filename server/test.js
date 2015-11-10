var chai = require('chai');
var expect = chai.expect;
var sinonChai = require('sinon-chai');
var sinon = require('sinon');
chai.use(sinonChai);

describe('General Tests', function() {
  it('should pass an empty test', function() {
    expect(true).to.equal(true);
  });
});
