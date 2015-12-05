module.exports = function(filePath, cb){
  'use strict';
  require('fs').readFile(filePath, (err, contents) => {
    if(err) {
      cb(err);
      return;
    }

    // I tried using a lexer + parser but apparantly I'm not smart enough...
    let filePaths = [];
    (contents || '')
      .split('\n')
      .forEach((thisLine) => {
        if(thisLine === '') {
          return;
        }
        if(thisLine.startsWith('//')) {
          return;
        }

        let filePathMatch = thisLine.match(/"(.*\.ck)"/);
        if(filePathMatch && filePathMatch.length > 1) {
          filePaths.push(filePathMatch[1]);
        }
      });

    cb(null, filePaths);
  });
};
