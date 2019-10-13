const recursive = require("recursive-readdir");
const { promisify } = require('util');
const fs = require('fs');

const { OUTPUT_DIR } = process.env;
const appendFile = promisify(fs.appendFile);

module.exports = async (student, SECTION) => {
    const paths = await recursive(`.repos/${student}`, [
        (file, stats) => (
            file.includes('/.') ||
            file.includes('src/module-info.java') ||
            (
                !file.includes('.java') &&
                !stats.isDirectory()
            )
        )
    ]);

    await appendFile(
        `${OUTPUT_DIR}/${student}.txt`,
        SECTION('Java Files Found', paths.reduce((acc, path) => (
            acc += path + '\n'
        ), '').slice(0, -1))
    );

    return paths.reduce((curr, path) => {
        const file = path.match(/[A-Za-z0-9]*.java/);
        curr[file] = path;
        return curr;
    }, {});
};