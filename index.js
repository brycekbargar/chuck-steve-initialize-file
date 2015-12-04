module.exports = function(filePath, cb){
  require('fs').readFile(filePath, function(err) {
    if(err) {
      cb(err);
      return;
    };
    cb(null, []);
  });
};
