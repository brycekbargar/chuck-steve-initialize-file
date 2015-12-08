# Steve Initialize.ck #
A wrapper for performing actions on the `Initialize.ck` file specified by  [`steve`](https://www.github.com/brycekbargar/steve).

### Usage ###
Requiring this package returns an `InitializeFile` class. The class has the following methods:

##### `.constructor()` #####
Takes a single string containing the absolute path to the `initialize.ck` file

##### `.getFilePaths()` #####
Returns a `Promise` that resolves to a list of file paths added to the ChucK vm

### Example ###
```
const InitializeFile = require('chuck-steve-initialize-file'):

let initializeFile = new InitializeFile('some path to initialize.ck');

initializeFile
  .getFilePaths()
  .then(fp => fp.forEach(console.log))
  .catch(console.error);
```

### Possible Errors ###
An error may be returned for the following cases

1. The file couldn't be read
1. The file contains lines of code that are not
  - Statements defined in the [steve section on the `Initialize.ck file`](https://www.github.com/brycekbargar/steve)
  - Comments
