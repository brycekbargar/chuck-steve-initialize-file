'use strict';
const proxyquire = require('proxyquire').noCallThru();
const Promise = require('bluebird');
const sinon = require('sinon');
require('sinon-as-promised')(Promise);
const stub = sinon.stub;
const expect = require('chai')
  .use(require('sinon-chai'))
  .use(require('chai-as-promised'))
  .expect;

const proxyquireStubs = {
  bluebird: Promise,
  fs: 'fs'
};

const _ = 'initialize.ck';

describe('For the Steve Initialize File', () => {
  beforeEach('Setup Spies', () => {
    stub(Promise, 'promisifyAll')
      .withArgs('fs')
      .returns({
        readFileAsync: this.readFileStub = stub()
      });
  });
  afterEach('Teardown Spies', () => {
    Promise.promisifyAll.restore();
  });
  beforeEach('Setup File', () => {
    let InitializeFile = proxyquire('./../index.js', proxyquireStubs);
    this.initializeFile = new InitializeFile(_);
  });
  describe('when #getFilePaths() is called', () => {
    it('expect the file name and encoding to be passed', () => {
      this.readFileStub.resolves();
      let getFilePaths = this.initializeFile.getFilePaths();
      expect(getFilePaths).to.be.fulfilled;
      expect(this.readFileStub).to.have.been.calledWith(_, 'utf-8');
    });
    it('expect an error if it fails', () => {
      let error = new Error();
      this.readFileStub.rejects(error);
      let getFilePaths = this.initializeFile.getFilePaths();
      expect(getFilePaths).to.be.rejected;
    });
    describe('and it succeeds', () => {
      it('expect the full file path to be returned', () => {
        let InitializeFile = proxyquire('./../index.js', proxyquireStubs);
        let initializeFile = new InitializeFile('some/path/initializeFile.ck');
        this.readFileStub.resolves('Machine.add(me.dir()+"aCoolFile.ck");');
        let getFilePaths = initializeFile.getFilePaths();
        expect(getFilePaths).to.eventually.eql(['some/path/aCoolFile.ck']);
      });
      describe('expect an error if there are non `Machine.add()` statements', () => {
        it('on their own line', () => {
          this.readFileStub.resolves(`
Machine.add(me.dir()+"aCoolFile.ck");
0 ::second => now;
Machine.add(me.dir()+"aCoolFile.ck");`
          );
          let getFilePaths = this.initializeFile.getFilePaths();
          expect(getFilePaths).to.be.rejected;
        });
        it('on the same line', () => {
          this.readFileStub.resolves(`
Machine.add(me.dir()+"aCoolFile.ck"); 0 ::second => now;
Machine.add(me.dir()+"aCoolFile.ck");`
          );
          let getFilePaths = this.initializeFile.getFilePaths();
          expect(getFilePaths).to.be.rejected;
        });
      });
      describe('expect correct values for', () => {
        it('a null file', () => {
          this.readFileStub.resolves(null);
          let getFilePaths = this.initializeFile.getFilePaths();
          expect(getFilePaths).to.eventually.eql([]);
        });
        it('an empty file', () => {
          this.readFileStub.resolves('');
          let getFilePaths = this.initializeFile.getFilePaths();
          expect(getFilePaths).to.eventually.eql([]);
        });
        it('an file with only whitespace', () => {
          this.readFileStub.resolves('  \n\n  ');
          let getFilePaths = this.initializeFile.getFilePaths();
          expect(getFilePaths).to.eventually.eql([]);
        });
        it('a file with one entry', () => {
          let chuckFilePaths = ['aSuperCoolChucKFile.ck'];
          this.readFileStub.resolves(`Machine.add(me.dir()+"${chuckFilePaths[0]}");`);
          let getFilePaths = this.initializeFile.getFilePaths();
          expect(getFilePaths).to.eventually.eql(chuckFilePaths);
        });
        it('a file with multiple matches on one line', () => {
          let chuckFilePaths = [
            'aSuperCoolChucKFile.ck',
            'theSecondChucKFile.ck'
          ];
          this.readFileStub.resolves(`Machine.add(me.dir()+"${chuckFilePaths[0]}"); Machine.add(me.dir()+"${chuckFilePaths[1]}"); `);
          let getFilePaths = this.initializeFile.getFilePaths();
          expect(getFilePaths).to.eventually.eql(chuckFilePaths);
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
          this.readFileStub.resolves(`
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
          let getFilePaths = this.initializeFile.getFilePaths();
          expect(getFilePaths).to.eventually.eql(chuckFilePaths);
        });
        it('a file with single line comments', () => {
          let chuckFilePaths = [
            'aCoolFile.ck',
            'anotherCoolFile.ck',
            'oneMoreCoolFile.ck',
            'yetAnotherCoolFile.ck',
            'theLastCoolFile.ck'
          ];
          this.readFileStub.resolves(`
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
          let getFilePaths = this.initializeFile.getFilePaths();
          expect(getFilePaths).to.eventually.eql(chuckFilePaths);
        });
        it('a file with multi-line comments', () => {
          let chuckFilePaths = [
            'aCoolFile.ck',
            'anotherCoolFile.ck',
            'oneMoreCoolFile.ck',
            'yetAnotherCoolFile.ck',
            'theLastCoolFile.ck'
          ];
          this.readFileStub.resolves(`
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
          let getFilePaths = this.initializeFile.getFilePaths();
          expect(getFilePaths).to.eventually.eql(chuckFilePaths);
        });
      });
    });
  });
});
