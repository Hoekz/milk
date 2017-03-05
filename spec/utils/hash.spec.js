'use strict';

let { Hash } = require('../../src/utils/hash');

describe('hash', () => {
    let count = 10;
    let hash = new Hash();

    it(`should produce string that can be parsed to the original`, () => {
        for (let i = 0; i < count; i++) {
            let num = Math.floor(Math.random() * (Math.pow(64, 6) - 1));
            let res = hash.hash(num);
            expect(res).not.toEqual(num);
            expect(res).toEqual(jasmine.any(String));
            expect(res.length).toEqual(6);
            expect(hash.parse(hash.hash(num))).toEqual(num);
        }
    });

    describe('twist', () => {
        it('should take s string and interlace the halves', () => {
            let a = 'abcd';
            let b = 'efgh';
            expect(Hash.twist(a + b)).toEqual('aebfcgdh');
        });
    });

    describe('untwist', () => {
        it('should take a string and put the even chars then odd chars', () => {
            let str = 'aebfcgdh';
            expect(Hash.untwist(str)).toEqual('abcdefgh');
        });
    });

    describe('constructor', () => {
        it('should take configuration params', () => {
            let hash = new Hash(1, 'A', 0, 1, false);

            expect(hash.hash(1)).toEqual('A');
        });

        it('should use the given length', () => {
            let hash = new Hash(27);

            expect(hash.hash(0).length).toEqual(27);
        });

        it('should use the given character set', () => {
            let hash = new Hash(3, 'ABC', 0, 1, false);

            expect(hash.hash(0)).toEqual('AAA');
        });

        it('should use the given offset', () => {
            let hash = new Hash(3, 'ABC', 1, 1, false);

            expect(hash.hash(0)).toEqual('BAA');
        });

        it('should use the given factor', () => {
            let hash = new Hash(3, 'ABC', 0, 2, false);

            expect(hash.hash(1)).toEqual('CAA');
        });

        it('should use twist if specified', () => {
            let noTwist = new Hash(3, 'ABC', 0, 1, false);
            let hash = new Hash(3, 'ABC', 0, 1, true);

            expect(hash.hash(4)).toEqual('BAB');
            expect(noTwist.hash(4)).toEqual('BBA');
        });
    });
});