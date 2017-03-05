'use strict';

function noop () {}

function copy(data) {
    if ('copy' in data && data.copy instanceof Function) return data.copy(data);
    return JSON.parse(JSON.stringify(data));
}

module.exports = { noop, copy };