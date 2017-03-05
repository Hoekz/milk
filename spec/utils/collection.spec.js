'use strict';

let { hasCycle, flatten } = require('../../src/utils/collection');

describe('collection', () => {
    describe('hasCycle', () => {
        it('should return true when an array references itself', () => {
            let array = [];
            array.push(array);

            expect(hasCycle(array)).toBeTruthy();
        });

        it('should return true when there is a deep reference', () => {
            let array = [];
            array.push([[[[array]]]]);

            expect(hasCycle(array)).toBeTruthy();
        });

        it('should return false for flat arrays', () => {
            let array = [0, 1, 2, 3];

            expect(hasCycle(array)).toBeFalsy();
        });

        it('should return false for deep no reference arrays', () => {
            let array = [0, [1, [2]], 3];

            expect(hasCycle(array)).toBeFalsy();
        });
    });

    describe('flatten', () => {
        it('should flatten the structure of a deep array', () => {
            let array = [0, [1, [2, 3], 4], 5];

            expect(flatten(array)).toEqual([0, 1, 2, 3, 4, 5]);
        });

        it('should throw an error when it encounters self reference', () => {
            let selfRef = [];
            let array = [0, 1, selfRef];
            selfRef.push(selfRef);

            expect(() => flatten(array)).toThrowError();
        });
    });
});