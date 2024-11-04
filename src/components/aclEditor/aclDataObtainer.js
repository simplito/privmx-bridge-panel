/* eslint-disable */
// Use this function to parse docs e.g. http://localhost:9111/docs/#acl-groups-and-functions
// $section = div.section
function aclDataObtainer($section) {
    const headingsAndTables = [...$section.querySelectorAll(":scope > table, :scope > h3")];
    const headingWithTablePairs = headingsAndTables.reduce((acc, $element) => {
        if ($element.tagName === "H3") {
            acc.push([$element, null]);
        } else {
            acc[acc.length - 1][1] = $element;
        }
        return acc;
    }, []);
    for (const pair of headingWithTablePairs) {
        if (pair[1] === null) {
            console.log(headingWithTablePairs);
            throw new Error("No table found for section");
        }
    }

    const aclData = headingWithTablePairs.map(([$heading, $table]) => {
        const groupName = $heading.textContent.trim();
        const functions = [...$table.querySelectorAll(":scope > tbody > tr")].map(($row) => {
            const $cells = $row.querySelectorAll("td");
            const functionName = $cells[0].textContent.trim();
            const parameters = $cells[1].innerText
                .split("\n")
                .map((x) => x.trim())
                .filter((x) => x !== "");
            return { id: functionName, parameters };
        });
        return { id: groupName, functions };
    });

    return JSON.stringify(aclData, null, "    ");
}
console.log(aclDataObtainer($0));
