const { parse, resolve} = require('path');
const { stat, readdir} = require('fs/promises');
const { stdout} = require('node:process');

const filePath = (src) => resolve(...src);

const readDirectory = async (path) => await readdir(path, { withFileTypes: true });

const getInformation = (path) => parse(path);

const getSize = async (path) => {
    const  {size} = await stat(path);
    return size;
}

const getFilesInFolder = async  () => {
    try {
        for (const file of (await readDirectory(filePath(['03-files-in-folder', 'secret-folder'])))) {
            const path = filePath(['03-files-in-folder', 'secret-folder', file.name]);
            const { name, ext} = getInformation(path);
            const size = await getSize(path);
            stdout.write(`name: ${name} | extension: ${ext} | size: ${(size / 1024).toFixed(1)}Kb\n`);
        }
    } catch (e) {
        throw Error(e);
    }
};

getFilesInFolder().then().catch(e => console.log(e));
