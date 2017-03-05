'use strict';

let { fs } = require('../../src/utils/fs');
let { noop } = require('../../src/utils/misc');

describe('fs', () => {
    describe('open', () => {
        it('should return a promise', () => {
            expect(fs.open('', 'r+').catch(noop)).toEqual(jasmine.any(Promise));
        });

        it('should resolve with the file id', (done) => {
            fs.open('./.gitignore', 'r+').then((data) => {
                expect(data).toEqual(jasmine.any(Number));
                done();
            });
        });

        it('should reject when the file does not exist', (done) => {
            fs.open('./not/a/file/at/all/duh.png', 'r+').catch((err) => {
                expect(err).toEqual(jasmine.any(Error));
                done();
            });
        });
    });

    describe('exists', () => {
        it('should return a promise', () => {
            expect(fs.exists('').catch(noop)).toEqual(jasmine.any(Promise));
        });

        it('should resolve when the file exists', (done) => {
            fs.exists('./.gitignore').then(done);
        });

        it('should reject when the file does not exist', (done) => {
            fs.exists('./not/a/file/at/all/duh.png').catch(done);
        });
    });

    describe('read', () => {
        let fd;
        let buffer;

        beforeAll((done) => {
            fs.open('./.gitignore', 'r+').then((fileId) => fd = fileId).then(done);
            buffer = Buffer.alloc(2);
        });

        afterAll((done) => {
            fs.close(fd).then(done);
        });

        it('should return a promise', () => {
            expect(fs.read(fd, buffer, 0, 2, 0)).toEqual(jasmine.any(Promise));
        });

        it('should resolve with bytesRead and the Buffer', (done) => {
            fs.read(fd, buffer, 0, 2, 0).then(([br, buf]) => {
                expect(br).toEqual(2);
                expect(buf).toBe(buffer);
                done();
            });
        });

        it('should reject when there is an error', (done) => {
            fs.read(-1, buffer, 0, 2, 0).catch(done);
        });
    });

    describe('write', () => {
        let fd;
        let buffer;

        beforeAll((done) => {
            fs.open('./.gitignore', 'r+')
                .then((fileId) => fd = fileId)
                .then(() => fs.read(fd, buffer, 0, 2, 0))
                .then(done);
            buffer = Buffer.alloc(2);
        });

        afterAll((done) => {
            fs.close(fd).then(done);
        });

        it('should return a promise', () => {
            expect(fs.write(fd, buffer, 0, 2, 0)).toEqual(jasmine.any(Promise));
        });

        it('should resolve with bytesWritten and the Buffer', (done) => {
            fs.write(fd, buffer, 0, 2, 0).then(([bw, buf]) => {
                expect(bw).toEqual(2);
                expect(buf).toBe(buffer);
                done();
            });
        });

        it('should reject when there is an error', (done) => {
            fs.write(-1, buffer, 0, 2, 0).catch(done);
        });
    });

    describe('close', () => {
        let fd;

        beforeAll((done) => {
            fs.open('./.gitignore', 'r+').then((fileId) => fd = fileId).then(done);
        });

        it('should return a promise and resolve when successful', (done) => {
            fs.close(fd).then(done);
        });

        it('should reject when there is an error', (done) => {
            fs.close(-1).catch(done);
        });
    });

    describe('glob', () => {
        it('should return all files in the directory when -a is passed', (done) => {
            fs.glob('-a').then((files) => {
                expect(files.length).toBeGreaterThan(1);
                expect(files.indexOf('.gitignore')).toBeGreaterThan(-1);
            }).then(done);
        });

        it('should return .gitignore for the pattern .giti*', (done) => {
            fs.glob('.giti*').then((files) => {
                expect(files.length).toEqual(1);
                expect(files.indexOf('.gitignore')).toBeGreaterThan(-1);
            }).then(done);
        });

        it('should be able to use regex', (done) => {
            fs.glob(/.*\.js$/).then((files) => {
                expect(files.length).toBeGreaterThan(1);
                expect(files.every((file) => file.endsWith('.js')));
                expect(files.some((file) => file.indexOf('/') > -1));
            }).then(done);
        });
    });
});