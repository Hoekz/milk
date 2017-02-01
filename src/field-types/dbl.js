let { isThrow } = require('../utils');
let { AbstractFieldType, AbstractFieldInstance, AbstractFieldChange } = require('./abstract');

class DblField extends AbstractFieldType {
    constructor (isFloat = false) {
        this.isFloat = isFloat;
    }

    set isFloat (b) {
        isThrow.bool(b);
        return this._isFloat = b;
    }

    get isFloat () { return this._isFloat; }
    get size () { return this._isFloat ? 4 : 8; }

    new () {
        this._data = this._data || [];
        let datum = new Dbl(this);
        this._data.push(datum);
        return datum;
    }

    test (val) {
        let max = this.isFloat ? 3.402823e+38 : 1.7976931348623158e+308;
        return val < max && val > -max;
    }
}

class Dbl extends AbstractFieldInstance {
    constructor (field) {
        isThrow.a(field, DblField);
        this._field = field;
        this.value = field.default;
    }

    write (buf = Buffer.alloc(this._field.size), pos = 0) {
        isThrow.a(buf, Buffer);
        isThrow.int(pos);
        (this._field.isFloat ? buf.writeFloatBE : buf.writeDoubleBE)(this.value, pos);
        return buf;
    }
    read (buf, pos = 0) {
        isThrow.a(buf, Buffer);
        isThrow.int(pos);
        return this.value = (this._field.isFloat ? buf.readFloatBE : buf.readDoubleBE)(buf);
    }

    get value () { return this._value; }
    set value (val) {
        isThrow.pass(val, this._field.test);
        return this._value = val;
    }
}

module.exports = { DblField, Dbl };