const child = require('child_process');
const { promisify } = require('util');
const fs  = require('fs');

const { OUTPUT_DIR } = process.env;
const appendFile = promisify(fs.appendFile);
const exec = promisify(child.exec);
const mkdir = promisify(fs.mkdir);

module.exports = async (student, files, required, SECTION) => {
    // Create directory
    try {
        await mkdir(`.repos/${ student }/.runner`);
    } catch {

    }

    // Copy unit test
    await exec(
        `cp -r test/src .repos/${ student }/.runner/src`
    );

    // Copy test files
    await Promise.all(
        Object.entries(required)
        .map(async ([file, path]) => {
            if (files[file]) {
                await exec(
                    `cp ${ files[file] } .repos/${ student }/.runner/${ path }`
                );
            }
        })
    );

    // Compile code
    try {
        await exec(
            `javac -cp .repos/${student}/.runner/:jars/junit-4.12.jar .repos/${student}/.runner/src/com/b07/f19/e2/*.java`
        );
    } catch (stderr) {
        await appendFile(
            `${OUTPUT_DIR}/${student}.txt`,
            SECTION('\nBuild Error', stderr),
        );
        throw Error(stderr);
    }
};