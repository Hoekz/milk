let fs = require('fs');

module.exports = {};

for (let file of fs.readdirSync(__dirname)) {
    if (file != 'index.js') {
        let exports = require('./' + file);
        for (let key in exports) {
            module.exports[key] = exports[key];
        }
    }
}