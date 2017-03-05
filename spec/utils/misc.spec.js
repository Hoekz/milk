'use strict';

let { copy } = require('../../src/utils/misc');

describe('misc', () => {
    describe('copy', () => {
        it('should create a copy of the data', () => {
            let data = {sub: [{props: 'are cool'}, 2], a: true};
            let cp = copy(data);

            expect(cp).toEqual(data);
            expect(cp).not.toBe(data);
        });

        it('should use the copy method when provided', () => {
            let returnedCopy = {};
            let data = {
                copy: () => returnedCopy,
                prop: null
            };
            let cp = copy(data);

            expect(cp).not.toEqual(data);
            expect(cp).toBe(returnedCopy);
        });
    });
});