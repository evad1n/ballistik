import p5 from 'p5';

const CELL_SIZE = 40;



// 15 is all 4 walls
const DIRECTIONS = {
    N: 1, // 0001
    E: 2, // 0010
    S: 4, // 0100
    W: 8  // 1000
};

type Dir = keyof typeof DIRECTIONS;

const DX = {
    N: 0,
    E: 1,
    S: 0,
    W: -1
};

const DY = {
    N: -1,
    E: 0,
    S: 1,
    W: 0
};

const OPPOSITES: Record<Dir, Dir> = {
    'N': 'S',
    'E': 'W',
    'S': 'N',
    'W': 'E',
};

export default class Maze {
    /**
     * Top left x coordinate
     */
    x: number
    /**
     * Top left y coordinate
     */
    y: number
    /**
     * Number of rows
     */
    rows: number
    /**
     * Number of columns
     */
    cols: number
    /**
     * Size of cells
     */
    cellSize: number;
    /**
     * 
     */
    cells: Array<Array<number>>

    // CHORE: remove when server generates
    recursing: Array<Array<boolean>>



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
    /**
     * 
     * 
     * @example
     * const DIRECTIONS = {
            N: 1, // 0001
            E: 2, // 0010
            S: 4, // 0100
            W: 8  // 1000
        };
     */
    constructor(x: number, y: number, rows: number, cols: number, cellSize: number) {
        this.x = x;
        this.y = y;
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        // Start empty
        this.cells = Array(rows).fill(0).map(() => Array(cols).fill(15));
        this.recursing = Array(rows).fill(0).map(() => Array(cols).fill(false));
    }

    draw(p: p5) {
        for (let row = 0; row < this.cells.length; row++) {
            // Bottom row
            if (row == this.cells.length - 1) {

            }
            for (let col = 0; col < this.cells[0].length; col++) {
                this.drawCell(p, row, col);
            }
        }
    }

    /**
     * Draw cells with wall data. Will only draw top and left walls
     * 
     * @param {number} row 
     * @param {number} col 
     */
    drawCell(p: p5, row: number, col: number) {
        const cell = this.cells[row][col];
        if (this.recursing[row][col]) {
            p.noStroke();
            p.fill('red');
            p.rect(this.x + col * this.cellSize, this.y + row * this.cellSize, this.cellSize, this.cellSize);
            p.fill('white');
        } else if (cell == 15) {
            p.noStroke();
            p.fill('grey');
            p.rect(this.x + col * this.cellSize, this.y + row * this.cellSize, this.cellSize, this.cellSize);
            p.fill('white');
        }

        p.fill('black');
        if (cell & DIRECTIONS.N) {
            p.rect(this.x + col * this.cellSize, this.y + row * this.cellSize, this.cellSize, 1);
        }
        if (cell & DIRECTIONS.W) {
            p.rect(this.x + col * this.cellSize, this.y + row * this.cellSize, 1, this.cellSize);
        }
        // if (cell & DIRECTIONS.S) {
        //     rect(this.x + row * CELL_SIZE, this.y + col * CELL_SIZE + CELL_SIZE, CELL_SIZE, 1);
        // }
        // if (cell & DIRECTIONS.E) {
        //     rect(this.x + row * CELL_SIZE + CELL_SIZE, this.y + col * CELL_SIZE, 1, CELL_SIZE);
        // }
    }

    drawMaze(timeout: number) {
        this.recursing = Array(this.rows).fill(0).map(() => Array(this.cols).fill(false));

        this.asyncCarve(0, 0, timeout);
    }

    carve(cX: number, cY: number) {
        // Shuffle for direction
        let dirs = shuffleArray(Object.keys(DIRECTIONS)) as Array<keyof typeof DIRECTIONS>;

        for (const d of dirs) {
            // Neighbor
            let nX = cX + DX[d];
            let nY = cY + DY[d];

            // Keep in bounds
            if (nX >= 0 && nX < this.cells[0].length && nY >= 0 && nY < this.cells.length) {
                // If cell is already visited
                if (this.cells[nY][nX] >= 0) continue;

                this.cells[cY][cX] |= DIRECTIONS[d];
                this.cells[nY][nX] |= DIRECTIONS[OPPOSITES[d]];
                // We must go deeper!
                this.carve(nX, nY);
            }
            // Otherwise find a different neighbor
        }
    }

    async asyncCarve(cX: number, cY: number, timeout: number) : Promise<void>{
        return new Promise(async (resolve) => {
            await new Promise(r => setTimeout(r, timeout));
            this.recursing[cY][cX] = true;
            // Shuffle for direction
                    let dirs = shuffleArray(Object.keys(DIRECTIONS)) as Array<keyof typeof DIRECTIONS>;

            for (const d of dirs) {
                // Neighbor
                let nX = cX + DX[d];
                let nY = cY + DY[d];


                // Keep in bounds
                if (nX >= 0 && nX < this.cells[0].length &&
                    nY >= 0 && nY < this.cells.length) {
                    // If cell is already visited
                    if (this.cells[nY][nX] < 15) continue;

                    this.cells[cY][cX] ^= DIRECTIONS[d];
                    this.cells[nY][nX] ^= DIRECTIONS[OPPOSITES[d]];

                    // We must go deeper!
                    await this.asyncCarve(nX, nY, timeout);

                }
                // Otherwise find a different neighbor
            }

            // Exit recursion
            await new Promise(r => setTimeout(r, timeout));
            this.recursing[cY][cX] = false;
            resolve();
        });
    }
}





// Dummy
function genMaze(width: number, height: number) {

    // Start with 0s to indicate not visited
    let cells = Array(width).fill(0).map(() => Array(height).fill(0));

    // return carve(0, 0, cells);
}



function shuffleArray<T>(array: T[]) : T[]{
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}