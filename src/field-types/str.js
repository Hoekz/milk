let { isThrow } = require('../utils');
let { AbstractFieldType, AbstractFieldInstance } = require('./abstract');

class StrField extends AbstractFieldType {

}

class Str extends AbstractFieldInstance {
    constructor (field) {
        isThrow.a(field, StrField);
        this._field = field;
        this.value = field.default;
    }

    write (buf = Buffer.alloc(this.size), pos = 0) {
        isThrow.a(buf, Buffer);
        isThrow.int(pos);

    }
    read (buf, pos = 0, len = 0) {
        isThrow.a(buf, Buffer);
        isThrow.int(pos);
        return this.value = (buf.readStr)
    }
}

module.exports = { StrField, Str };