'use strict';

function throwMsg(msg) { throw new Error(msg); }

let is = {
    a: (val, cls) => val instanceof cls,
    def: (val) => val !== undefined,
    nil: (val) => val === null,
    bool: (val) => is.a(val, Boolean) || typeof val === 'boolean',
    num: (val) => (is.a(val, Number) || typeof val === 'number') && !isNaN(val),
    int: (val) => is.num(val) && val % 1 === 0,
    str: (val) => is.a(val, String) || typeof val === 'string',
    obj: (val) => is.a(val, Object),
    arr: (val) => is.a(val, Array),
    func: (val) => is.a(val, Function),
    in: (val, arr) => is.arr(arr) && arr.some((e) => e === val),
    key: (val, obj) => is.obj(obj) && val in obj,
    pass: (val, test) => is.func(test) && !!test(val),
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
    obj: (val) => is.obj(val) || throwMsg(`${val} is not an Object`),
    arr: (val) => is.arr(val) || throwMsg(`${val} is not an Array`),
    func: (val) => is.func(val) || throwMsg(`${val} is not an Function`),
    in: (val, arr) => is.in(val, arr) || throwMsg(`${val} is not in the array`),
    key: (val, obj) => is.key(val, obj) || throwMsg(`${val} is not a key in ${JSON.stringify(obj)}`),
    pass: (val, test) => is.pass(val, test) || throwMsg(`${val} does not pass ${test.toString()}`),
    pow: (val, base) => is.pow(val, base) || throwMsg(`${val} is not a power of ${base}`),
};

module.exports = { is, isThrow };