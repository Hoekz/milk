const path = require('path');
let { copy, fs, is } = require('./utils');
let { milk } = require('../index');

class Stream {
    constructor (filePath) {
        this.filePath = filePath;
        fs.exists(filePath).then(() => this.open()).then(() => this.parseSpec());
    }

    close () { return fs.close(this.fd).then(() => this.fd = null); }
    open () { return fs.open(this.filePath, 'r+').then((fileId) => this.fd = fileId); }

    parseSpec () {
        fs.read(this.fd, Buffer.alloc(2), 0, 2, 0).then(([br, buf]) => {
            this.spec = {
                length: buf.readInt8(0),
                type: Stream.types[buf.readInt8(1)]
            };
        });
    }

    set spec (val) {
        this._spec = this._spec || copy(Stream.DEFAULT_SPEC);
        is.num(val.length) && (this._spec.length = val.length);
        is.in(val.type, Stream.types) && (this._spec.type = val.type);
        is.a(val.model, milk.Model) && (this._spec.model = val.model);
    }
}

Stream.types = [];
Stream.types.MILK_LIST = Stream.types[0] = 0;
Stream.types.MILK_HASH = Stream.types[1] = 1;
Stream.types.MILK_ENUM = Stream.types[2] = 2;
const ds = { length: 0, type: -1, fields: [] };
Stream.DEFAULT_SPEC = ds;

class File {
    constructor (watcher, path) {
        this.watcher = watcher;
        this.filePath = path;
        this.pointer = 0;
        this.stream = new Stream(path);
    }

    get path () { return this.filePath; }

    close () { this.stream.close(() => this.watcher()); }


}

class FileManager {
    constructor () {
        this.openFiles = [];
    }

    get files() { return copy(this.openFiles); }

    openFile (filePath) {
        let file = new File(() => {
            let index = this.openFiles.indexOf(file);
            this.openFiles.splice(index);
        }, path.resolve(process.cwd(), filePath));

        this.openFiles.push(file);

        return file;
    }

    closeFile (path) {
        let index = this.openFiles.findIndex((file) => {
            return file.path === path;
        });

        if (index == -1) return;

        this.openFiles[index].close();
    }
}

module.exports = { FileManager };