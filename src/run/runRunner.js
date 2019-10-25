const child = require('child_process');
const { promisify } = require('util');
const fs = require('fs');

const { OUTPUT_DIR } = process.env;
const appendFile = promisify(fs.appendFile);
const exec = promisify(child.exec);

module.exports = async (student, SECTION) => {
    await appendFile(
        `${OUTPUT_DIR}/${student}.txt`,
        SECTION('\nTest Case Result', '').slice(0, -1)
    );

    try {
        await exec(
            `java -cp .repos/${student}/.runner/src/:jars/junit-4.12.jar:jars/hamcrest-core-1.3.jar org.junit.runner.JUnitCore com.b07.f19.e2.TestRunner >> ${OUTPUT_DIR}/${student}.txt`,
            {
                timeout: 30000,
            },
        );
    } catch (err) {
        if (err.message.startsWith('Command failed:')) {
            await appendFile(
                `${OUTPUT_DIR}/${student}.txt`,
                '\nTest Runner timed out TwT',
            );
        }
        throw err;
    }
};