'use strict';

let DEFAULT_LEN = 6;
let DEFAULT_CHAR_SET = "_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-";
let DEFAULT_SHIFT = 982451653;
let DEFAULT_FACTOR = 103067;
let DEFAULT_USE_TWIST = true;

class Hash {
    constructor(
        len = DEFAULT_LEN,
        charSet = DEFAULT_CHAR_SET,
        shift = DEFAULT_SHIFT,
        factor = DEFAULT_FACTOR,
        useTwist = DEFAULT_USE_TWIST
    ) {
        this.len = len;
        this.charSet = charSet;
        this.shift = shift;
        this.factor = factor;
        this.useTwist = useTwist;
        this.size = charSet.length;
        this.max = Math.pow(this.size, this.len);
    }

    hash(num) {
        num = (num * this.factor + this.shift) % this.max;

        let str = '';
        while (num > 0) {
            str += this.charSet[num % this.size];
            num = Math.floor(num / this.size);
        }
        while (str.length < this.len) str += this.charSet[0];

        return this.useTwist ? Hash.twist(str) : str;
    }

    parse(str) {
        if (this.useTwist) str = Hash.untwist(str);
        let num = str.split('').reduce((num, c, i) => {
            return num + Math.pow(this.size, i) * this.charSet.indexOf(c);
        }, 0);

        num -= this.shift;
        while ((num / this.factor) % 1) num += this.max;
        num /= this.factor;

        return num;
    }

    static twist(str) {
        let a = str.substr(0, (str.length + 1) / 2);
        let b = str.substr((str.length + 1) / 2);
        return a.split('').map((c, i) => c + (b[i] || '')).join('');
    }

    static untwist(str) {
        let chars = str.split('');
        let evens = chars.filter((c, i) => i % 2 == 0);
        let odds = chars.filter((c, i) => i % 2);

        return evens.concat(odds).join('');
    }
}

module.exports = { Hash };