class AbstractFieldType {
    constructor() { throw new Error('Abstract Type, do not use for construction.'); }

    set default (val) { throw new Error('Abstract Type method not overwritten.'); }
    get default () { throw new Error('Abstract Type method not overwritten.'); }

    set name (val) { throw new Error('Abstract Type method not overwritten.'); }
    get name () { throw new Error('Abstract Type method not overwritten.'); }

    get size () { throw new Error('Abstract Type method not overwritten.'); }

    new () { throw new Error('Abstract Type method not overwritten.'); }
}

class AbstractFieldInstance {
    constructor () { throw new Error('Abstract Type, do not use for construction.'); }

    write () { throw new Error('Abstract Type method not overwritten.'); }
    read () { throw new Error('Abstract Type method not overwritten.'); }

    set value (val) { throw new Error('Abstract Type method not overwritten.'); }
    get value () { throw new Error('Abstract Type method not overwritten.'); }
}

module.exports = { AbstractFieldType, AbstractFieldInstance };