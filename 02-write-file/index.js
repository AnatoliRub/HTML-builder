const { stdin, stdout } = require('node:process');
const { createWriteStream } = require('fs');
const { resolve } = require('path');

const filePath = (src) => resolve(...src);
const makeWriteStream = (src) => createWriteStream(filePath(src));

const writeStream = makeWriteStream(['02-write-file', 'ololo.txt']);

stdout.write('Enter your message!!!\n');

stdin.on('data', (data) => {

    if (String(data).trim() === 'exit'){
        stdout.write('Thank you for your message!Have a nice day!Bye!');
        process.exit();
    }

    writeStream.write(data);
});

process.on('SIGINT', () => {
    stdout.write('Thank you for your message!Have a nice day!Bye!');
    process.exit();
});
