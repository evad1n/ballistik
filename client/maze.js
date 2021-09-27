const CELL_SIZE = 40;

const DIRECTIONS = {
    N: 1, // 0001
    E: 2, // 0010
    S: 4, // 0100
    W: 8  // 1000
};

class Maze {
    /**
     * 
     * @param {number[][]} cells A 2D array of bit flags signifying walls
     * 
     * @example 
     * const DIRECTIONS = {
            N: 1, // 0001
            E: 2, // 0010
            S: 4, // 0100
            W: 8  // 1000
        };
     */
    constructor(x, y, cells) {
        this.x = x;
        this.y = y;
        this.cells = cells;
    }

    draw() {
        // Border
        rect(this.x, this.y, this.cells[0].length * CELL_SIZE, this.cells.length * CELL_SIZE);

        for (let row = 0; row < this.cells.length; row++) {
            for (let col = 0; col < this.cells[0].length; col++) {
                this.drawCell(row, col);
            }
        }
    }

    // Draw cells with wall data
    drawCell(row, col) {
        const cell = this.cells[row][col];
        if (cell & DIRECTIONS.N) {
            rect(this.x + row * CELL_SIZE, this.y + col * CELL_SIZE, CELL_SIZE, 1);
        }
        if (cell & DIRECTIONS.W) {
            rect(this.x + row * CELL_SIZE, this.y + col * CELL_SIZE, 1, CELL_SIZE);

        }
    }
}



const DX = {
    N: 0,
    E: -1,
    S: 0,
    W: 1
};

const DY = {
    N: -1,
    E: 0,
    S: 1,
    W: 0
};

const OPPOSITES = {
    'N': 'S',
    'S': 'N',
    'E': 'W',
    'W': 'E',
};

// Dummy
function genMaze(width, height) {

    // Start with 0s to indicate not visited
    let cells = Array(width).fill(0).map(() => Array(height).fill(0));

    return carve(0, 0, cells);
}

function carve(cX, cY, cells) {
    // Shuffle for direction
    let dirs = shuffleArray(Object.keys(DIRECTIONS));

    for (const d of dirs) {
        // Neighbor
        let nX = cX + DX[d];
        let nY = cY + DY[d];

        // Keep in bounds
        if (nX >= 0 && nX < cells[0].length && nY >= 0 && nY < cells.length) {
            // If cell is already visited
            if (cells[nY][nX] != 0) continue;

            cells[cY][cX] |= DIRECTIONS[d];
            cells[nY][nX] |= OPPOSITES[d];
            // We must go deeper!
            cells = carve(nX, nY, cells);
        }
        // Otherwise find a different neighbor
    }

    return cells;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}