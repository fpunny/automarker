// Imports
require('dotenv').config();
require('events').EventEmitter.defaultMaxListeners = 200;
const mapByFilename = require('./mapByFilename');
const getCommands = require('./getCommands');
const Listr = require('listr');
const run = require('./run');
const fs = require('fs');

// Load in students using "./getStudents.js"
const STUDENTS = [];
const { OUTPUT_DIR } = process.env;

const tasks = new Listr([
    {
        title: 'Load SVN checkout commands',
        task: async (ctx, task) => {
            ctx.commands = await getCommands(STUDENTS);
            task.title = `Load SVN checkout Commands: ${Object.keys(ctx.commands).length} found`;
        },
    },
    {
        title: 'Create Report Directory',
        enabled: () => !fs.existsSync(OUTPUT_DIR),
        task: async () => {
            await fs.mkdirSync(OUTPUT_DIR);
        },
    },
    {
        title: 'Get requirements for test cases',
        task: async (ctx, task) => {
            ctx.required = await mapByFilename();
            task.title = `Get requirements for test cases: ${Object.keys(ctx.required).length} found`;
        },
    },
    {
        title: 'Run test cases on all students',
        task: () => (
            new Listr(
                STUDENTS.map(student => ({
                    title: student,
                    task: ctx => {
                        ctx[student] = {};
                        return run(student, ctx.commands[student]);
                    },
                })),
                { concurrent: true },
            )
        ),
    },
], { collapse: false });

tasks.run().catch(err => {
    console.error(err);
});
