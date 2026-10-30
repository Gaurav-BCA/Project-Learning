const rows = 5;

// for (let i = 0; i < rows; i++) {
//     let rowLine = "";
//     for (let j = 0; j < rows - i - 1; j++) {
//         rowLine += " ";
//     }
//     for (let k = 0; k < (2 * i) + 1; k++) {
//         rowLine += "*";
//     }
//     console.log(rowLine);
// }


// Top half of the diamond (including the center row)
for (let i = 0; i < rows; i++) {
    let rowLine = "";

    // Leading spaces
    for (let j = 0; j < rows - i - 1; j++) {
        rowLine += " ";
    }

    // Stars
    for (let k = 0; k < (2 * i) + 1; k++) {
        rowLine += "*";
    }

    console.log(rowLine);
}

// Bottom half of the diamond
for (let i = rows - 2; i >= 0; i--) {
    let rowLine = "";

    // Leading spaces
    for (let j = 0; j < rows - i - 1; j++) {
        rowLine += " ";
    }

    // Stars
    for (let k = 0; k < (2 * i) + 1; k++) {
        rowLine += "*";
    }

    console.log(rowLine);
}