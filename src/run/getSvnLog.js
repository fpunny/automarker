const child = require('child_process');
const { promisify } = require('util');
const fs = require('fs');

const { UTORID, PASSWORD, OUTPUT_DIR } = process.env;
const writeFile = promisify(fs.writeFile);
const exec = promisify(child.exec);

module.exports = async (student, SECTION) => {
    const { stdout } = await exec(
        `cd .repos/${student}; svn log --username ${ UTORID } --password ${ PASSWORD }`
    );
    
    await writeFile(
        `${OUTPUT_DIR}/${student}.txt`,
        SECTION('SVN Log', stdout)
    );
};