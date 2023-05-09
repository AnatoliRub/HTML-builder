const { resolve } = require( 'path');
const { rm, mkdir, readdir, copyFile } = require("fs/promises");
const {createWriteStream, createReadStream} = require("fs");

const filePath = (src) => resolve(...src);

const makeReadStream = (src) => createReadStream(filePath(src), {encoding: "utf-8"});

const makeWriteStream = (src) => createWriteStream(filePath(src));

const makeDirectory = (path) => mkdir(path);

const deleteDirectory = (path) => rm(path, { recursive: true });

const readDirectory = async (path) => await readdir(path, { withFileTypes: true });

const copyDirectory = async (source, output) => {
    await makeDirectory(filePath(output));
    const files = await readDirectory(filePath(source));

    for (const file of files) {
        const src = filePath([...source, file.name]);
        const out = filePath([...output, file.name]);

        if(file.isFile()) {
            await copyFile(src, out);
        } else {
            await copyDirectory([...source, file.name], [...output, file.name]);
        }
    }
}

module.exports = { filePath, makeDirectory, deleteDirectory, readDirectory, copyDirectory, makeWriteStream, makeReadStream };
