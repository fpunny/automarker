const checkStyle = require('./checkStyle');
const runRunner = require('./runRunner');
const getSvnLog = require('./getSvnLog');
const getFiles = require('./getFiles');
const initTest = require('./initTest');
const { promisify } = require('util');
const Listr = require('listr');
const fs = require('fs');

const { OUTPUT_DIR } = process.env;
const appendFile = promisify(fs.appendFile);

const SECTION = (header, content) => (
`${ header }
============================================
${ content }
`
)

const exec = promisify(require('child_process').exec);
module.exports = (student, command) => (
    new Listr([
        {
            title: 'Fetch SVN Repository',
            task: async () => {
                const { stderr } = await exec(command);
                if (stderr) throw Error(stderr);
            },
        },
        {
            title: 'Get SVN Log',
            task: async () => {
                await getSvnLog(student, SECTION);
            },
        },
        {
            title: 'Fetch Java Files',
            task: async (ctx, task) => {
                ctx[student].files = await getFiles(student, SECTION);
                if (!Object.keys(ctx[student].files).length) {
                    task.skip('No Files found. End of line');
                    ctx[student].error = true;
                }
            },
        },
        {
            title: 'Check Style',
            enabled: ctx => !ctx[student].error,
            task: async ctx => (
                new Listr([
                    {
                        title: 'Initialize Section',
                        task: async () => {
                            await appendFile(
                                `${OUTPUT_DIR}/${student}.txt`,
                                SECTION('\nCheck Style', '').slice(0, -1)
                            );
                        },
                    },
                    ...Object.entries(ctx[student].files)
                    .map(([ file, path ]) => ({
                        title: `Checking ${ file }`,
                        task: async () => {
                            await checkStyle(student, path, file);
                        }
                    })),
                ])
            ),
        },
        {
            title: 'Initialize test runner',
            enabled: ctx => !ctx[student].error,
            task: async (ctx, task) => {
                try {
                    await initTest(student, ctx[student].files, ctx.required, SECTION);
                } catch {
                    task.skip('Failed to build runner');
                    ctx[student].build_error = true;
                }
            },
        },
        {
            title: 'Run test runner',
            enabled: ctx => !ctx[student].error,
            task: async (ctx, task) => {
                try {
                    await runRunner(student, SECTION);
                } catch(err) {
                    task.skip('Errors Found');
                }
            },
        },
    ])
);
