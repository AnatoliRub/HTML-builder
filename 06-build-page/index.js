const { extname, resolve} = require('path');
const { createWriteStream, createReadStream } = require('fs');
const { readFile, mkdir, readdir, copyFile, access, rm} = require("fs/promises");
const path = require('path');

const filePath = (src) => resolve(...src);

const makeReadStream = (src) => createReadStream(filePath(src), {encoding: 'utf-8'});

const makeWriteStream = (src) => createWriteStream(filePath(src));

const makeDirectory = (path) => mkdir(path);
const readDirectory = async (path) => await readdir(path, { withFileTypes: true });

const deleteDirectory = (path) => rm(path, { recursive: true });

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

const buildHtml = async () => {
    const componentTable = {};

    const readStream = createReadStream(filePath(['06-build-page', 'template.html']));
    const writeStream = createWriteStream(filePath(['06-build-page', 'project-dist', 'index.html']));

    const files = await readDirectory(filePath(['06-build-page', 'components']));
    for (const file of files) {
        const {ext, name} = path.parse(file.name);
        if (ext !== '.html') continue;
        const html = await readFile(filePath(['06-build-page', 'components', file.name]));
        componentTable[name] = String(html);
    }

    readStream.on('data', (data) => {
        let template = String(data);
        for (let component in componentTable) {
            template = template.replace(`{{${component}}}`, componentTable[component]);
        }
        writeStream.write(template);
    });
}

const buildPage = async (source, output) => {
    try {
        await deleteDirectory(filePath(output));
    } catch (e) {
        console.log('start build page');
    } finally {
        await makeDirectory(filePath(output));
        await mergeStyles([...source, 'styles'], [...output, 'style.css']);
        await copyDirectory( ['06-build-page', 'assets'], ['06-build-page', 'project-dist', 'assets']);
        await buildHtml();
    }
}

buildPage( ['06-build-page'],['06-build-page', 'project-dist']).then();
