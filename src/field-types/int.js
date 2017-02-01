const MAX_PRECISION = 6;// node allows up to 48 bits
let { isThrow } = require('../utils');
let { AbstractFieldType, AbstractFieldInstance } = require('./abstract');

class IntField extends AbstractFieldType {
    constructor(precision, def = 0, signed = true) {
        this.size = precision;
        this.default = def;
        this.signed = signed;
        this._events = new FieldChange();
    }

    get size () { return this._size; }
    get signed () { return this._signed; }
    get default () { return this._default; }

    set size (n) {
        isThrow.pass(n, (n) => n > 0 && n <= MAX_PRECISION && is.int(n));
        n != this._size && this._events.emit('size', n);
        return this._size = n;
    }
    set signed (b) {
        isThrow.bool(b);
        b != this._signed && this._events.emit('sign', b);
        return this._signed = b;
    }
    set default (n) {
        isThrow.pass(n, this.test);
        this._default = n;
    }

    new () {
        this._data = this._data || [];
        let datum = new Int(this);
        this._data.push(datum);
        return datum;
    }

    test (val) {
        let max = Math.pow(2, this.size);
        if (this.signed) max *= 2;

        return val < max && this.signed ? (val > -max) : (val > -1);
    }
}

class Int extends AbstractFieldInstance {
    constructor (field) {
        isThrow.a(field, IntField);
        this._field = field;
        this.value = field.default;
    }

    write (buf = Buffer.alloc(this._field.size), pos = 0) {
        isThrow.a(buf, Buffer);
        isThrow.int(pos);
        (this._field.signed ? buf.writeIntBE : buf.writeUIntBE)(this.value, pos, this._field.size);
        return buf;
    }
    read (buf, pos = 0) {
        isThrow.a(buf, Buffer);
        isThrow.int(pos);
        return this.value = (this._field.signed ? buf.readIntBE : buf.readUIntBE)(pos, this._field.size);
    }

    get value () { return this._value; }
    set value (val) {
        isThrow.pass(val, this._field.test);
        return this._value = val;
    }
}

module.exports = { IntField, Int };