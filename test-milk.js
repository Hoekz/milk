"use strict";

console.log('opening file');
let fs = require('fs');
let fm = new (require('./src/file-manager').FileManager)();
let fd; fs.open('./test.mlk', 'r+', (err, data) => fd = data);

setTimeout(() => {
    // console.log('writing to file');
    // fs.write(fd, Buffer.from([0x14, 0x00]), 0, 2, 0, () => {});
}, 1000);

setTimeout(() => {
   // console.log('closing file');
   // fs.close(fd, () => {});
}, 2000);

setTimeout(() => {
    // console.log('using Milk to open file');
    // let file = fm.openFile('./test.mlk');
}, 3000);