const recursive = require("recursive-readdir");

module.exports = async () => {
    const paths = await recursive(`test`, [
        (file, stats) => (
            file.includes('/.') ||
            file.includes('Test') ||
            file.includes('src/module-info.java') ||
            (
                !file.includes('.java') &&
                !stats.isDirectory()
            )
        )
    ]);

    return paths.reduce((curr, path) => {
        const file = path.match(/[A-Za-z0-9]*.java/);
        curr[file] = path.replace('test/', '');
        return curr;
    }, {});
};