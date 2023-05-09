const { resolve } = require('path');
const { mkdir, readdir, copyFile, rm } = require('fs/promises');

const filePath = (src) => resolve(...src);

const makeDirectory = (path) => mkdir(path);

const deleteDirectory = (path) => rm(path, { recursive: true });

const readDirectory = async (path) => await readdir(path, { withFileTypes: true });

const copyDirectory = async (source, output) => {
    try {
        await deleteDirectory(filePath(output));
    } catch (e) {
        throw Error(e);
    } finally {
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
}

copyDirectory(['04-copy-directory', 'files'] ,['04-copy-directory', 'files-copy']).then().catch(e => console.log(e));
