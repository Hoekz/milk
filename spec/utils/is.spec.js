'use strict';

let { is, isThrow } = require('../../src/utils/is');

describe('is', () => {
    describe('a', () => {
        it('should return true when cls is a prototype of val', () => {
            expect(is.a({}, Object)).toBeTruthy();
            expect(is.a([], Object)).toBeTruthy();
            expect(is.a([], Array)).toBeTruthy();

            class A {}
            class B extends A {}

            expect(is.a(new B(), A)).toBeTruthy();
        });

        it('should return false when cls is not a prototype of val', () => {
            expect(is.a({}, Array)).toBeFalsy();
            expect(is.a({}, Number)).toBeFalsy();

            class A {}
            class B {}

            expect(is.a(new B(), A)).toBeFalsy();
        });
    });

    describe('def', () => {
        it('should return true for defined values', () => {
            expect(is.def(0)).toBeTruthy();
            expect(is.def(false)).toBeTruthy();
            expect(is.def(null)).toBeTruthy();
            expect(is.def('')).toBeTruthy();
        });

        it('should return false for undefined values', () => {
            expect(is.def(undefined)).toBeFalsy();
        });
    });

    describe('nil', () => {
        it('should return true for null', () => {
            expect(is.nil(null)).toBeTruthy();
        });

        it('should return false for everything else', () => {
            expect(is.nil(undefined)).toBeFalsy();
            expect(is.nil(false)).toBeFalsy();
            expect(is.nil('')).toBeFalsy();
            expect(is.nil(0)).toBeFalsy();
        });
    });

    describe('bool', () => {
        it('should return true for true and false', () => {
            expect(is.bool(true)).toBeTruthy();
            expect(is.bool(false)).toBeTruthy();
        });

        it('should return true for Boolean object', () => {
            expect(is.bool(new Boolean())).toBeTruthy();
        });

        it('should return false otherwise', () => {
            expect(is.bool(undefined)).toBeFalsy();
            expect(is.bool(0)).toBeFalsy();
            expect(is.bool(1)).toBeFalsy();
            expect(is.bool('true')).toBeFalsy();
        });
    });

    describe('num', () => {
        it('should return true for numbers', () => {
            expect(is.num(0)).toBeTruthy();
            for(let i = 0; i < 100; i++) {
                expect(is.num((Math.random() - 0.5) * Math.pow(2, 30))).toBeTruthy();
            }
        });

        it('should return true for a Number object', () => {
            expect(is.num(new Number(0))).toBeTruthy();
        });

        it('should return false for NaN', () => {
            expect(is.num(NaN)).toBeFalsy();
        });

        it('should return false for everything else', () => {
            expect(is.num([0])).toBeFalsy();
            expect(is.num('1')).toBeFalsy();
        });
    });

    describe('int', () => {
        it('should return true for integers', () => {
            expect(is.int(0)).toBeTruthy();
            expect(is.int(1)).toBeTruthy();
            expect(is.int(123456789)).toBeTruthy();
        });

        it('should return false for floats', () => {
            expect(is.int(1.1)).toBeFalsy();
        });

        it('should check if the value is a number', () => {
            spyOn(is, 'num');
            is.int(1);
            expect(is.num).toHaveBeenCalledWith(1);
        });
    });

    describe('str', () => {
        it('should return true for strings', () => {
            expect(is.str('')).toBeTruthy();
            expect(is.str('1')).toBeTruthy();
            expect(is.str(`${1 + 1}`)).toBeTruthy();
        });

        it('should return true for a String object', () => {
            expect(is.str(new String(''))).toBeTruthy();
        });

        it('should return false otherwise', () => {
            expect(is.str([''])).toBeFalsy();
            expect(is.str({})).toBeFalsy();
            expect(is.str(true)).toBeFalsy();
        });
    });

    describe('obj', () => {
        it('should be a shortcut for is.a(val, Object)', () => {
            spyOn(is, 'a');
            is.obj(is);
            expect(is.a).toHaveBeenCalledWith(is, Object);
        });
    });

    describe('arr', () => {
        it('should be a shortcut for is.a(val, Array)', () => {
            let arr = [];
            spyOn(is, 'a');
            is.arr(arr);
            expect(is.a).toHaveBeenCalledWith(arr, Array);
        });
    });

    describe('func', () => {
        it('should be a shortcut for is.a(val, Function)', () => {
            let func = () => {};
            spyOn(is, 'a');
            is.func(func);
            expect(is.a).toHaveBeenCalledWith(func, Function);
        });
    });

    describe('in', () => {
        it('should return true when val is in arr', () => {
            expect(is.in(0, [0])).toBeTruthy();
            expect(is.in(1, [0, 1, 2, 3, 4])).toBeTruthy();
            expect(is.in('hi', ['hello', 'hey', 'hi'])).toBeTruthy();
        });

        it('should return false when val is NOT in arr', () => {
            expect(is.in(0, [1, 2, 3])).toBeFalsy();
        });
    });

    describe('key', () => {
        it('should return true when key is present in object', () => {
            expect(is.key('a', is)).toBeTruthy();
            expect(is.key('toString', {})).toBeTruthy();
            expect(is.key('push', [])).toBeTruthy();
        });

        it('should return false when key is not present', () => {
            expect(is.key('a', {})).toBeFalsy();
            expect(is.key('a', [])).toBeFalsy();
        });

        it('should return false otherwise', () => {
            expect(is.key('a', 'b')).toBeFalsy();
            expect(is.key(1, 2));
        });
    });

    describe('pass', () => {
        it('should return true when test returns a truthy value for val', () => {
            expect(is.pass(1, () => true)).toBeTruthy();
            expect(is.pass(1, is.def)).toBeTruthy();
            expect(is.pass('', is.str)).toBeTruthy();
        });

        it('should return false otherwise', () => {
            expect(is.pass(0, () => false)).toBeFalsy();
            expect(is.pass(0, 0)).toBeFalsy();
            expect(is.pass()).toBeFalsy();
        });
    });

    describe('pow', () => {
        it('should return true when log(val, base) is an int', () => {
            expect(is.pow(2, 2)).toBeTruthy();
            expect(is.pow(4, 2)).toBeTruthy();
            expect(is.pow(2048, 2)).toBeTruthy();
        });

        it('should return false otherwise', () => {
            expect(is.pow()).toBeFalsy();
            expect(is.pow('', '')).toBeFalsy();
            expect(is.pow(20, 2)).toBeFalsy();
        });
    });
});

describe('isThrow', () => {
    it('should have the same methods as is', () => {
        for (let prop in is) {
            expect(is.key(prop, isThrow)).toBeTruthy();
            expect(is.func(isThrow[prop])).toBeTruthy();
            let old = is[prop];
            is[prop] = jasmine.createSpy(prop);
            try { isThrow[prop](); } catch(e) {}
            expect(is[prop]).toHaveBeenCalled();
            is[prop] = old;
        }
    });

    it('should error when the method returns false', () => {
        for (let prop in isThrow) {
            expect(isThrow[prop]).toThrowError();
        }
    });
});