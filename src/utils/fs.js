'use strict';

const FS = require('fs');
const exec = require('child_process').exec;
let { promise } = require('./promise');
let { flatten } = require('./collection');

let fs = {
    open: promise(FS.open, FS),
    read: promise(FS.read, FS),
    write: promise(FS.write, FS),
    close: promise(FS.close, FS),
    exists: promise(FS.access, FS),
    readdir: promise(FS.readdir, FS),
    stat: promise(FS.stat, FS),
    isDir: promise((path, cb) => fs.stat(path, (err, stat) => cb(err, stat.isDirectory()))),
    isFile: promise((path, cb) => fs.stat(path, (err, stat) => cb(err, stat.isFile()))),
    glob: promise((pat, cb) => {
        if (pat instanceof RegExp) {
            return expandDir('./', pat).then((files) => cb(null, files), cb);
        }

        exec(`ls ${pat}`, (err, out) => {
            cb(err, (out || '').split('\n').filter((e) => e));
        });
    })
};

function expandDir(dir, pat) {
    return fs.readdir(dir).then((files) => {
        return Promise.all(files.map((file) => {
            return fs.isDir(dir + file).then((isDir) => {
                if (isDir) {
                    return expandDir(dir + file + '/', pat);
                } else {
                    return dir + file;
                }
            });
        }));
    }).then(flatten).then((files) => {
        return files.filter((file) => file.match(pat));
    });
}

module.exports = { fs };