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