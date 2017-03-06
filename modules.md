## Module Declaration Pattern
Since there are some inconsistencies between ES6 and Node, I decided to try to use
a pattern that can be mirrored in both with a simple translation between the two for
import/export and require.

```javascript
let { property } = require('./module');
// is equivalent to
import { property } from './module';

module.exports = { property };
// is equivalent to
export { property };
```

The other major part of this pattern comes from the file structure pattern. Because 
`require` automatically will resolve a `directory` to `directory/index.js`, each
directory receives the following `index.js` so that requiring the directory pulls in
all the files in it.

```javascript
module.exports = {};

require('fs').readdirSync(__dirname).forEach((file) => {
    let req = require('./' + file);

    Object.keys(req).forEach((key) => {
        module.exports[key] = req[key];
    });
});
```

This pattern allows you to include anything from any subdirectory directly while
also allowing the choice of exclusively including that file. It also discourages
naming collisions so as not to override exports of other modules. It also means that
including the `src` directory will automatically load every module and it expose
their properties.