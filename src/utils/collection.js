'use strict';

let { is } = require('./is');

function hasCycle(collection, references) {
    references = references || [];
    references.push(collection);

    return collection.some((el) => {
        return references.indexOf(el) > -1 ||
            (el instanceof Array && hasCycle(el, [...references]));

    });
}

function flatten(collection) {
    if (hasCycle(collection)) throw Error('Cannot flatten cyclical collections');
    if (is.arr(collection)) {
        let arr = [];

        collection.forEach((el) => {
            if (is.arr(el)) {
                arr = arr.concat(flatten(el));
            } else {
                arr.push(el);
            }
        });

        return arr;
    }
}

module.exports = { flatten, hasCycle };