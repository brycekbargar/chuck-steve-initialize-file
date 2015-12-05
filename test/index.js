'use strict';
const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const spy = sinon.spy;
const stub = sinon.stub;
const expect = require('chai').use(require('sinon-chai')).expect;

const proxyquireStubs = { };

const _ = '';

describe('For the Steve Initialize File', () => {
  beforeEach('Setup Spies', () => {
    this.callbackSpy = spy();
    this.readFileStub = stub();
    proxyquireStubs['fs'] = { readFile: this.readFileStub };
  });
  beforeEach('Setup File', () => {
    this.file = proxyquire('./../index.js', proxyquireStubs);
  });
  describe('when loading the file', () => {
    it('expect the file name to be passed', () => {
      let filePath = 'THE BEST FILE EVER! PROBABLY ABOUT BANANA PANCAKES!!!';
      this.file(filePath, this.callbackSpy);
      expect(this.readFileStub).to.have.been.calledOnce;
      expect(this.readFileStub).to.have.been.calledWith(filePath);
    });
    it('and it fails expect an error', () => {
      let error = new Error();
      this.readFileStub.callsArgWith(1, error);

      this.file(_, this.callbackSpy);
      expect(this.callbackSpy).to.have.been.calledOnce;
      expect(this.callbackSpy).to.have.been.calledWith(error);
    });
    describe('and it suceeds', () => {
      beforeEach('Setup Assertion', () => {
        let callbackSpy = this.callbackSpy;
        this.results = () => {
          return callbackSpy.getCall(0).args[1];
        };
      });
      beforeEach('Setup Spies', () => {
        let readFileStub = this.readFileStub;
        this.setFileContents = (contents) => {
          readFileStub.callsArgWith(1, null, contents);
        };
      });
      it('expect there to be no error assuming the file isn\'t terrible', () => {
        this.readFileStub.callsArgWith(1, null, '');
        this.file(_, this.callbackSpy);
        expect(this.callbackSpy).to.have.been.calledWith(null);
      });
      describe('expect it to return the correct values for', () => {
        it('a null file', () => {
          this.setFileContents(null);
          this.file(_, this.callbackSpy);
          expect(this.results()).to.eql([]);
        });
        it('an empty file', () => {
          this.setFileContents('');
          this.file(_, this.callbackSpy);
          expect(this.results()).to.eql([]);
        });
        it('an file with only whitespace', () => {
          this.setFileContents('  \n\n  ');
          this.file(_, this.callbackSpy);
          expect(this.results()).to.eql([]);
        });
        it('a file with one entry', () => {
          let chuckFilePaths = ['aSuperCoolChucKFile.ck'];
          this.setFileContents(`Machine.add(me.dir()+"${chuckFilePaths[0]}");`);
          this.file(_, this.callbackSpy);
          expect(this.results()).to.eql(chuckFilePaths);
        });
        it('a file with various formats', () => {
          let chuckFilePaths = [
            '0aSuperCoolChucKFile.ck',
            '1aSuperCoolChucKFile.ck',
            '2aSuperCoolChucKFile.ck',
            '3aSuperCoolChucKFile.ck',
            '4aSuperCoolChucKFile.ck',
            '5aSuperCoolChucKFile.ck',
            '6aSuperCoolChucKFile.ck',
            '7aSuperCoolChucKFile.ck',
            '8aSuperCoolChucKFile.ck',
            '9aSuperCoolChucKFile.ck'
          ];
          this.setFileContents(`
Machine.add(me.dir()+"${chuckFilePaths[0]}");
Machine.add(me.dir() + "${chuckFilePaths[1]}");
Machine.add(me.dir()+ "${chuckFilePaths[2]}");
Machine.add(me.dir() +"${chuckFilePaths[3]}");
Machine.add("${chuckFilePaths[4]}");
Machine.add(me.dir()+"${chuckFilePaths[5]}" );
Machine.add(me.dir()   +   "${chuckFilePaths[6]}" );
Machine.add(me.dir()+   "${chuckFilePaths[7]}" );
Machine.add(me.dir()   +"${chuckFilePaths[8]}" );
Machine.add("${chuckFilePaths[9]}" );`
          );
          this.file(_, this.callbackSpy);
          expect(this.results()).to.eql(chuckFilePaths);
        });
        it('a file with single line comments and whitespace', () => {
          let chuckFilePaths = [
            'aCoolFile.ck',
            'anotherCoolFile.ck',
            'oneMoreCoolFile.ck',
            'yetAnotherCoolFile.ck',
            'theLastCoolFile.ck'
          ];
          this.setFileContents(`
// I\'m irrelevent!',
Machine.add(me.dir()+"${chuckFilePaths[0]}");
// Machine.add(me.dir() + "${chuckFilePaths[0]}");
Machine.add(me.dir() + "${chuckFilePaths[1]}");

// Machine.add(me.dir() + "${chuckFilePaths[1]}");
Machine.add(me.dir() + "${chuckFilePaths[2]}"); // This file is special or something
Machine.add(me.dir() + "${chuckFilePaths[3]}"); // Machine.add(me.dir() + "${chuckFilePaths[3]}");
//Machine.add(me.dir() + "${chuckFilePaths[3]}");

// I\'m probably lying!
//Machine.add(me.dir() + "${chuckFilePaths[2]}");
// I\'m definitely lying!!!
Machine.add(me.dir()+ "${chuckFilePaths[4]}");
//Why would you comment the last line in a file?`
          );
          this.file(_, this.callbackSpy);
          expect(this.results()).to.eql(chuckFilePaths);
        });
        it('a file with multi-line comments and whitespace', () => {
          let chuckFilePaths = [
            'aCoolFile.ck',
            'anotherCoolFile.ck',
            'oneMoreCoolFile.ck',
            'yetAnotherCoolFile.ck',
            'theLastCoolFile.ck'
          ];
          this.setFileContents(`
/* I\'m irrelevent!
 *
 * Machine.add(me.dir() + "${chuckFilePaths[2]}");
 *
 * I\'m also irrelevent!*/
Machine.add(me.dir()+"${chuckFilePaths[0]}");
Machine.add(me.dir()/* really?*/ + /* wtf... */"${chuckFilePaths[1]}" /* ... */);


/* Machine.add(me.dir()+ "${chuckFilePaths[2]}");
I\'m probably lying!
I\'m definitely lying!!!
Machine.add(me.dir()+ "${chuckFilePaths[2]}");*/

/* Machine.add(me.dir()+ "${chuckFilePaths[2]}");
*/ /* Something important */ Machine.add(me.dir()+ "${chuckFilePaths[2]}"); /* and something else
Who programs like this?
*/

Machine.add(me.dir()+ "${chuckFilePaths[3]}"); /* Machine.add(me.dir()+ "${chuckFilePaths[0]}"); */
/*Why am I not a single line comment */
/* Now */ /* this is getting */Machine.add(me.dir()+ "${chuckFilePaths[4]}"); /* silly */`
          );
          this.file(_, this.callbackSpy);
          expect(this.results()).to.eql(chuckFilePaths);
        });
      });
    });
  });
});
