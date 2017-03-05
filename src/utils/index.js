'use strict';

module.exports = {};

require('fs').readdirSync(__dirname).forEach((file) => {
    let req = require('./' + file);

    Object.keys(req).forEach((key) => {
        module.exports[key] = req[key];
    });
});