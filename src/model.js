let { is, isThrow } = require('./utils');

class Field {
    constructor(name, type) {
        isThrow.str(name) && (this._name = name);
        isThrow.a(type, AbstractFieldType) && (this._type = type);
    }
}

class Model {
    constructor() {
        this._fields = [];
    }
}

module.exports = { Model };