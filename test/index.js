var proxyquire = require('proxyquire').noCallThru();

var proxyquireStubs = {};

describe('For the Steve Initialize File', function() {
  beforeEach('Setup File', function() {
    this.file = proxyquire('./../index.js', proxyquireStubs);
  });
  it('expect to pass', function() {
    this.file();
  });
});
