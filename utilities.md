## Utilities

While making Milk, I attempted to put together a good set of utilities for use inside
the project, but these are exposed to you the user as well.

### promise
 * Source [`src/utils/promise.js`](src/utils/promise.js)
 * Use `let { promise } = require('./src/utils/promise')`
 * Description

The function `promise` takes a function and an optional `this` argument to use for
the function call. The function passed should take a callback as the last argument:
```javascript
function usesCallback(arg1, arg2, arg3, callback) {
    // code here
    callback(err, data);
}
```
When wrapped with `promise`, the resulting function will now return a promise that
will resolve if the first argument to `callback` is falsy and will throw otherwise.
This follows the standard pattern used by Node with callback functions. Due to the
promises only allowing one argument during resolves, passing `callback` more than
2 parameters results in the promise resolving with an array of every argument after
`err`. This is so that functions like `fs.read` and `fs.write` still receive all 
the arguments normally passed. A good way to approach receiving multiple arguments
is to unpack them with an array:
```javascript
fs.read(fd, buffer, off, len, pos).then(([bytesRead, buffer]) => {
    // code here
})
```
This function has already been used to wrap `fs` and is exposed through `utils/fs`

 * Example
 
```javascript
let readFile = promise(fs.readFile, fs);

readFile('./package.json').then(JSON.parse).then((pkg) => {
    console.log(pkg.name);
});
```

### Collection
 * Source [`src/utils/collection.js`](src/utils/collection.js)
 * Use `let { hasCycle, flatten } = require('./src/utils/collection')`
 * Description

These methods are less useful than the rest, but essentially any time I found I
needed to manipulate an array or object, I put the method here. Most of these will
appear in many libraries already, but I didn't want to pull in anything heavy in the
interest of speed and being light.

`hasCycle` - returns true when an array contains a cyclical reference

`flatten` - returns the flattened version of an array. Errors if `hasCycle` returns true

 * Example

```javascript
let array = [1, [2, [3], 4], 5];
let flat = flatten(array);// flat == [1, 2, 3, 4, 5]
```

### FS
 * Source [`src/utils/fs.js`](src/utils/fs.js)
 * Use `let { fs } = require('./src/utils/fs')`
 * Description
 
A set of the standard `fs` functions wrapped by `promise` (see above). Supports
`fs.open`, `fs.read`, `fs.write`, `fs.close`, `fs.stat`, `fs.readdir`. Other provided
methods are `fs.exists` (rename of `fs.access`), `fs.isDir`
(shortcut for `stat.isDirectory`), `fs.isFile` (shortcut for `stats.isFile()`), and 
`fs.glob` (alias for `ls <pattern>` or RegExp search).

`fs.glob` is the only method that does not exist in the core and currently supports
normal `ls` syntax (e.g. `fs.glob('*') === fs.readdir`). When passed a RegExp, it
falls back to loading all the files in the current directory and then filtering the
list by the RegExp. This makes the method very heavy currently, but since this type of
search should only be executed once and the result stored (such as find all `.js`
files), it is tolerated (future implementation may include caching the searched 
directories)
 
 * Example

```javascript
let fd;

fs.open('./file')
    .then((fileDescriptor) => fd = fileDescriptor)
    .then(() => fs.read(fd, buf, off, len, pos))
    .then(() => console.log(buf.toString()))
    .then(() => fs.close(fd));
```

### Hash
 * Source [`src/utils/hash.js`](src/utils/hash.js)
 * Use `let { Hash } = require('./src/utils/hash')`
 * Description
 
Creating a `new Hash()` gives you a `Hash` object that works to obfuscate identifiers.
Using the standard hash (no parameters passed to the constructor), gives you a method
that can hash a number between 0 and 64^6 into a 6 character string consisting of
alphanumeric characters and '-' and '_'. The hash is customizable, changing the
length, character set, shift, factor, and whether or not to 'twist' the result.
 
 * Example

```javascript
let hash = new Hash();

let key = hash.hash(0);// key == '4ymVL_'
let id = hash.parse(key);// id == 0
```

### Is and IsThrow
 * Source [`src/utils/is.js`](src/utils/is.js)
 * Use `let { is, isThrow } = require('./src/utils/is')`
 * Description
 
These are used for quick boolean logic. As the name implies, `isThrow` is a wrapping of
`is` that throws an Error when the result is `false`. The methods available are

`is.a(val, cls)` - `val` is an `instanceof` `cls`. Shortcuts for common uses are: 
`is.bool`, `is.num`, `is.str`, `is.obj`, `is.arr`, `is.func`

`is.def(val)` and `is.nil(val)` - `val` is not `undefined` and `null`

`is.int(val)` and `is.pow(val, base)` - `val` is an integer and val is a power
(e.g. `is.pow(256, 2) === true`)

`is.in(val, arr)` and `is.key(val, obj)` - tests for being a member

`is.pass(val, test)` - `test(val)` is truthy
 
 * Example

```javascript
class Fraction {
    constructor(a, b) {
        isThrow.int(a);
        isThrow.int(b);
        this.num = a;
        this.den = b;
    }
    // ...
}
```

### Miscellaneous
 * Source [`src/utils/misc.js`](src/utils/misc.js)
 * Use `let { noop, copy } = require('./src/utils/misc')`
 * Description
 
Utility methods that just don't really fit anywhere else. `noop` is simply an empty
function call (a 'do nothing' method). `copy` performs a copy of the data passed using
either `JSON.parse(JSON.stringify(data))` or a `data.copy` method if it is present.
 
 * Example

```javascript
let a = {b: [1, [2, 3], true]};
let b = copy(a);// b !== a

function asyncTask (data, callback = noop) {}
```

------
_This document will be updated as more utilities are added_