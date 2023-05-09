const { stdout} = require('node:process');
const { createReadStream } = require('fs');
const { resolve } = require('path');

const filePath = (src) => resolve(...src);
const makeReadStream = (src) => createReadStream(filePath(src), {encoding: 'utf-8'});

const readStream = makeReadStream(['01-read-file', 'text.txt']);
readStream.on('data', (data)=> {
    stdout.write(data);
});
