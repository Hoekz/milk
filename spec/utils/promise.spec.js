'use strict';

let { promise } = require('../../src/utils/promise');

describe('promise', () => {
    it('should return a function', () => {
        let method = () => null;
        let prom = promise(method);

        expect(prom).toEqual(jasmine.any(Function));
    });

    describe('when wrapped function called', () => {
        it('should return a Promise', () => {

        });

        it('should append a callback argument', () => {
            let method = () => null;
            let prom = promise(method);

            prom();
        });

        it('should reject the promise when an error is passed to the callback', () => {

        });

        it('should resolve the promise with data when no error is passed', () => {

        });
    });
});