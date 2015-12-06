# Steve Initialize.ck #
A wrapper for performing actions on the `Initialize.ck` file specified by  [`steve`](https://www.github.com/brycekbargar/steve).

### Usage ###
Right now the package is a single function that has two parameters

1. The absolute path the file
1. A callback for when the function is loaded.

The callback should take two parameters

1. Any `Error` that ocurred while loading the file. This will be null if there are no errors.
1. An `Array` of absolute file paths as strings pointing to the ChucK files listed in the `Initialize.ck` file


```
var initializeFile = require('chuck-steve-initialize-file'):

var onLoad = function(err, filePathList) {
  if(err) {
    console.error(err):
    return;
  }

  filePathList.forEach(console.log);
}

initializeFile('./Initialize.ck', onLoad);
```

### Possible Errors ###
An error may be returned for the following cases

1. The file couldn't be read
1. The file contains lines of code that are not
  - Statements defined in the [steve section on the `Initialize.ck file`](https://www.github.com/brycekbargar/steve)
  - Comments
