

const processDirection = (direction, startRow, endRow, startCol, endCol, data) => {
    let counter = 0;

    switch (direction) {
        case "rightToLeft":

            // Top to bottom, left to right
            for (let i = startRow; i <= endRow; i++) {
                for (let j = endCol; j >= startCol; j--) { // Iterate from endCol to startCol
                    if (i < data.length && j >= 0 && j < Object.keys(data[i]).length) {
                        data[i][j] = counter++;
                    }
                }
                counter = 0;
            }
            break;

        case "bottomToTop":
            // Bottom to top, left to right

            counter = -1;
            for (let i = endRow; i >= startRow; i--) {
                counter = counter + 1;
                for (let j = startCol; j <= endCol; j++) {
                    if (i < data.length && j < Object.keys(data[i]).length) {
                        data[i][j] = counter;
                    }
                }

            }
            break;

        case "leftToRight":
            // Left to right, top to bottom
            for (let i = startRow; i <= endRow; i++) {
                let counter = 0; // Initialize counter at the start of each row
                for (let j = startCol; j <= endCol; j++) {
                    if (i < data.length && j < Object.keys(data[i]).length) {
                        data[i][j] = counter++;
                    }
                }
            }
            break;

        case "topToBottom":
            // Right to left, top to bottom
            for (let i = endCol; i >= startCol; i--) {
                for (let j = startRow; j <= endRow; j++) {
                    if (j < data.length && i < Object.keys(data[j]).length) {
                        data[j][i] = counter++;
                    }
                }
                counter = 0; // Reset counter for next row
            }
            break;

        default:
            console.warn(`Unknown direction: ${direction}`);
    }
};

export default processDirection;