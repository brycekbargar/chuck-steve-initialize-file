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
      beforeEach('Setup Assertion', function() {
        callbackSpy = this.callbackSpy
        this.expectResults = function(result) {
          expect(callbackSpy.getCall(0).args[1]).to.eql(result);
          return { to: { be: { ok: {}}}};
        };
      });
      beforeEach('Setup Spies', function() {
        var readFileStub = this.readFileStub;
        this.setFileContents = function(contents) {
          readFileStub.callsArgWith(1, null, contents);
        };
      });
      it('expect there to be no error', function() {
        this.readFileStub.callsArgWith(1, null, '');
        this.file(_, this.callbackSpy);
        expect(this.callbackSpy).to.have.been.calledWith(null);
      });
      describe('expect it to return the correct values for', function() {
        it('an empty file', function() {
          this.setFileContents('');
          this.file(_, this.callbackSpy);
          this.expectResults([]).to.be.ok;
        });
        it('a file with one entry', function() {
          var chuckFilePath = "aSuperCoolChucKFile.ck"
          this.setFileContents('Machine.add(me.dir()+"' + chuckFilePath + '");');
          this.file(_, this.callbackSpy);
          this.expectResults([chuckFilePath]).to.be.ok;
        });
      });
    });
  });
});
