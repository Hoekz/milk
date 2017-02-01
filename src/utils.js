"use strict";
const FS = require('fs');

function promise (fn, thisArg) {
    return (...args) => {
        let res, rej, prom = new Promise((s, f) => { res = s; rej = f; });

        fn.apply(thisArg || fn, [...args, (err, ...data) => err ? rej(err) : res(data.length > 1 ? data : data[0])]);

        return prom;
    };
}

let fs = {
    open: promise(FS.open, FS),
    read: promise(FS.read, FS),
    write: promise(FS.write, FS),
    close: promise(FS.close, FS),
    exists: promise(FS.access, FS)
};

function copy(data) {
    if ('copy' in data && data.copy instanceof Function) return data.copy(data);
    return JSON.parse(JSON.stringify(data));
}

function throwMsg(msg) { throw new Error(msg); }

let is = {
    a: (val, cls) => val instanceof cls,
    def: (val) => val === undefined,
    nil: (val) => val === null,
    bool: (val) => is.a(val, Boolean) || typeof val === 'boolean',
    num: (val) => is.a(val, Number) || typeof val === 'number',
    int: (val) => is.num(val) && val % 1 === 0,
    str: (val) => is.a(val, String) || typeof val === 'string',
    in: (val, arr) => arr.some((e) => e === val),
    key: (val, obj) => val in obj,
    pass: (val, test) => !!test(val),
    pow: (val, base) => is.int(Math.log(val) / Math.log(base))
};

let isThrow = {
    a: (val, cls) => is.a(val, cls) || throwMsg(`${val} is not of type ${cls}`),
    def: (val) => is.def(val) || throwMsg(`${val} is not defined`),
    nil: (val) => is.nil(val) || throwMsg(`${val} is not null`),
    bool: (val) => is.bool(val) || throwMsg(`${val} is not a boolean`),
    num: (val) => is.num(val) || throwMsg(`${val} is not a number`),
    int: (val) => is.int(val) || throwMsg(`${val} is not an integer`),
    str: (val) => is.str(val) || throwMsg(`${val} is not a string`),
    in: (val, arr) => is.in(val, arr) || throwMsg(`${val} is not in the array`),
    key: (val, obj) => is.key(val, obj) || throwMsg(`${val} is not a key in ${JSON.stringify(obj)}`),
    pass: (val, test) => is.pass(val, test) || throwMsg(`${val} does not pass ${test.toString()}`)
};

module.exports = { fs, copy, promise, is, isThrow };