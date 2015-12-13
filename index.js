'use strict';

const Promise = require('bluebird');
const fsp = Promise.promisifyAll(require('fs'));
const path = require('path');

class MultiLineContext {
  constructor(line, inBlock) {
    this.line = line;
    this.inBlock = inBlock;
  }
}

const stripMultiLineComments = (ctx) => {
  if(ctx.inBlock) {
    let endCommentBlockIndex = ctx.line.indexOf('*/');
    if(endCommentBlockIndex !== -1) {
      ctx = stripMultiLineComments(new MultiLineContext(
        ctx.line.slice(endCommentBlockIndex + 2),
        false
      ));
    } else {
      ctx.line = '';
    }
  }
  else if(!ctx.inBlock) {
    let beginCommentBlockIndex = ctx.line.indexOf('/*');
    if(beginCommentBlockIndex !== -1) {
      let nonBlockPortion = ctx.line.substring(0, beginCommentBlockIndex);
      ctx = stripMultiLineComments(new MultiLineContext(
        ctx.line.slice(beginCommentBlockIndex + 2),
        true
      ));
      ctx.line = nonBlockPortion + ctx.line;
    }
  }
  return ctx;
};

class InitializeFile {
  constructor(filePath) {
    this.filePath = filePath;
    this.fileDir = path.dirname(filePath);

    this.getFilePaths = () => fsp
      .readFileAsync(this.filePath, 'utf-8')
      .then((contents) => {
      // I tried using a lexer + parser but apparantly I'm not smart enough...
        let filePaths = [];
        let inBlock = false;
        (contents || '')
          .split(/\n|;/)
          .forEach((thisLine) => {
            let singleLineCommentIndex = thisLine.indexOf('//');
            if(singleLineCommentIndex !== -1) {
              thisLine = thisLine.substring(0, singleLineCommentIndex);
            }

            let ctx = stripMultiLineComments(new MultiLineContext(
              thisLine,
              inBlock
            ));
            thisLine = ctx.line.trim();
            inBlock = ctx.inBlock;

            if(thisLine === '') {
              return;
            }

            if(!thisLine.startsWith('Machine.add')) {
              throw new Error('Only Machine.add() and comments are valid in Initialize.ck files!');
            }

            let filePathMatch = thisLine.match(/"(.*?\.ck)"/);
            if(filePathMatch) {
              filePaths.push(path.join(this.fileDir, filePathMatch[1]));
            }
          });
        return filePaths;
      });
  }
}

module.exports = InitializeFile;
