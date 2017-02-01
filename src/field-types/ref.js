const REF_SIZE = 4;//uses 4 bytes to store a reference

let { is, isThrow } = require('../utils');
let { Model } = require('../model');
let { AbstractFieldType, AbstractFieldInstance, AbstractFieldChange } = require('./abstract');

class RefField extends AbstractFieldType {
    constructor (model, field = null) {
        isThrow.a(model, Model);
        this.model = model;

        if (is.def(field)) {
            isThrow.str(field);
            isThrow.in(field, model.fields);
            this.field = field;
        } else {
            this.field = '*';
        }
    }

    update (model, field = null) {
        let oldModel = this.model;
        let oldField = this.field;
        try {
            this.model = model;
            this.field = field;
        } catch (e) {
            this.model = oldModel;
            this.field = oldField;
            throw e;
        }
    }

    set model (model) {
        isThrow.a(model, Model);
        return this._model = model;
    }
    set field (field) {
        if (is.nil(field)) return this._field = null;
        isThrow.str(field);
        return this._field = field;
    }

    get model () { return this._model; }
    get field () { return this._field; }
    get size () { return REF_SIZE; }
    get default () { return null; }

    new () {
        this._data = this._data || [];
        let datum = new Ref(this);
        this._data.push(datum);
        return datum;
    }

    test (val) {
        return is.a(val.model, this.model.Instance);
    }
}

class Ref extends AbstractFieldInstance {
    constructor (field) {
        isThrow.a(field, RefField);
        this._field = field;
        this.value = field.default;
    }

    write (buf = Buffer.alloc(this._field.size), pos = 0) {
        isThrow.a(buf, Buffer);
        isThrow.int(pos);
        buf.writeUInt32BE(this.value.id, pos);
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