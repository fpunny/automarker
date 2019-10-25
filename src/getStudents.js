// Just paste this into your markus console from summary
(() => {
    const students = Array
        .from(document.querySelectorAll('.rt-td > a'))
        .map(({ innerText }) => innerText)
    ;
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = students.map(t => `'${t}'`);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    console.log(`${students.length} Students copied into clipboard`, students);
})();

// Generate Labs Gradesheet
(() => {
    const students = Array
        .from(document.querySelectorAll('.rt-tr > .rt-td:nth-child(2) > a'))
        .reduce((curr, { innerText }) => {
            if (innerText.startsWith('group_')) {
                const [ label, members ] = innerText.slice(0, -1).split(' (');
                curr[label] = {
                    members: members.split(', '),
                    grade: 0,
                };
            } else {
                curr[innerText] = {
                    members: [innerText],
                    grade: 0,
                };
            }
            return curr;
        }, {})
    ;

    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = JSON.stringify(students);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    console.log(students, JSON.stringify(students));
})();

// Remap grades
const groupsToStudents = groups => (
    Object.values(groups).reduce((curr, { members, grade }) => {
        members.forEach(m => curr.push([m , grade]));
        return curr;
    }, [])
    .sort((a, b) => a[0] > b[0] ? 1 : -1)
    .reduce((curr, [ name, grade ]) => {
        curr[name] = grade;
        return curr;
    }, {})
);