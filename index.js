module.exports = function(filePath, cb){
  require('fs').readFile(filePath, function(err, contents) {
    if(err) {
      cb(err);
      return;
    };
    var filePaths = [];

    var filePathMatches = contents.match(/^.*"(.*\.ck)"\);$/);
    if(filePathMatches && filePathMatches.length > 1) {
      filePaths[0] = filePathMatches[1];
    }
    cb(null, filePaths);
  });
};
