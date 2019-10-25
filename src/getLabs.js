const { UTORID, PASSWORD } = process.env;

module.exports = async students => {
    try {
        return students.reduce((curr, student) => {
            curr[student] = (
                `svn checkout --username ${UTORID} --password ${PASSWORD} "https://markus.utsc.utoronto.ca/svn/cscb07f19/${student}" ".repos/${student}"`
            );
            return curr;
        }, {});
    } catch (err) {
        throw Error;
    }
};