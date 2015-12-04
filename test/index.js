var proxyquire = require('proxyquire').noCallThru();
var sinon = require('sinon');
var spy = sinon.spy;
var stub = sinon.stub;
var expect = require('chai').use(require('sinon-chai')).expect;

var proxyquireStubs = {};

var _ = '';

describe('For the Steve Initialize File', function() {
  beforeEach('Setup Spies', function() {
    this.callbackSpy = spy();
    this.readFileStub = stub();
    proxyquireStubs['fs'] = { readFile: this.readFileStub };
  });
  beforeEach('Setup File', function() {
    this.file = proxyquire('./../index.js', proxyquireStubs);
  });
  describe('when loading the file', function() {
    it('when fs errors expect an error', function() {
      var error = new Error();
      this.readFileStub.callsArgWith(1, error);

      this.file(_, this.callbackSpy);
      expect(this.callbackSpy).to.have.been.calledOnce;
      expect(this.callbackSpy).to.have.been.calledWith(error);
    });
    it('expect the file name to be passed', function() {
      var filePath = 'THE BEST FILE EVER! PROBABLY ABOUT BANANA PANCAKES!!!';

      this.file(filePath, this.callbackSpy);
      expect(this.readFileStub).to.have.been.calledOnce;
      expect(this.readFileStub).to.have.been.calledWith(filePath);
    });
    describe('and it suceeds', function() {
      beforeEach('Setup Spies', function() {
        this.readFileStub.callsArgWith(1, null);
      });
      it('expect there to be no error', function() {
        this.file(_, this.callbackSpy);
        expect(this.callbackSpy).to.have.been.calledWith(null);
      });
    });
  });
});
