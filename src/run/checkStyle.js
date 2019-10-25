const child = require('child_process');
const { promisify } = require('util');
const fs = require('fs');

const { OUTPUT_DIR } = process.env;
const appendFile = promisify(fs.appendFile);
const exec = promisify(child.exec);

module.exports = async (student, path, file) => {

    await appendFile(
        `${OUTPUT_DIR}/${student}.txt`,
        `Checking ${ file }...\n`
    );

    try {
        const {stdout} = await exec(
            `java -jar jars/checkstyle-8.25-all.jar -c jars/google_checks.xml ${ path }`
        );
    
        if (stdout) {
            await appendFile(
                `${OUTPUT_DIR}/${student}.txt`,
                stdout + '\n',
            );
        }
    } catch (err) {
        await appendFile(
            `${OUTPUT_DIR}/${student}.txt`,
            err.message + '\n',
        );
    }
};