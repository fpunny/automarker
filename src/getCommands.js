const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);
const { CHECKOUTS, UTORID, PASSWORD } = process.env;

module.exports = async () => {
    try {
        const file = await readFile(CHECKOUTS);
        const lines = file.toString().split('\n');
        return lines.reduce((obj, command) => {
            const [ utorid ] = command.match(/(?!["])([a-z0-9]+)(?="$)/);
            obj[utorid] = command
                .replace(/http/, () => 'https')
                .replace(/checkout/, () => (
                    `checkout --username ${ UTORID } --password ${ PASSWORD }`
                ))
                .replace(/(?!["])([a-z0-9]+)(?="$)/, str => (
                    `.repos/${str}`
                ))
            ;
            return obj;
        }, {});
    } catch (err) {
        throw Error;
    }
};