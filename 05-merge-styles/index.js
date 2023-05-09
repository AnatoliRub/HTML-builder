const {extname, resolve} = require('path');
const {createWriteStream, createReadStream} = require('fs');
const {readdir} = require('fs/promises');

const filePath = (src) => resolve(...src);
const makeWriteStream = (src) => createWriteStream(filePath(src));

const readDirectory = async (path) => await readdir(path, { withFileTypes: true });

const makeReadStream = (src) => createReadStream(filePath(src), {encoding: 'utf-8'});

const mergeStyles = async(source, output) => {
    try {
        const writeStream = makeWriteStream(output);
        const files = await readDirectory(filePath(source));
        for (const file of files) {
            if (extname(file.name) !== '.css') continue;
            makeReadStream([...source, file.name]).pipe(writeStream);
        }
    } catch (e) {
        throw Error(e);
    }
}

mergeStyles(['05-merge-styles', 'styles'], ['05-merge-styles', 'project-dist', 'bundle.css']).then().catch(e => console.log(e));