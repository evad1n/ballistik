"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const CELL_SIZE = 40;
// 15 is all 4 walls
const DIRECTIONS = {
    N: 1,
    E: 2,
    S: 4,
    W: 8 // 1000
};
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
const OPPOSITES = {
    'N': 'S',
    'S': 'N',
    'E': 'W',
    'W': 'E',
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
    /**
     *
     * @param {*} x Top left x coordinate
     * @param {*} y Top left y coordinate
     * @param {*} rows Number of rows
     * @param {*} cols Number of columns
     * @param {*} cellSize Size of cells
     *
     * @example
     * const DIRECTIONS = {
            N: 1, // 0001
            E: 2, // 0010
            S: 4, // 0100
            W: 8  // 1000
        };
     */
    constructor(x, y, rows, cols, cellSize) {
        this.x = x;
        this.y = y;
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        // Start empty
        this.cells = Array(rows).fill(0).map(() => Array(cols).fill(15));
        this.recursing = Array(rows).fill(0).map(() => Array(cols).fill(false));
    }
    draw() {
        for (let row = 0; row < this.cells.length; row++) {
            // Bottom row
            if (row == this.cells.length - 1) {
            }
            for (let col = 0; col < this.cells[0].length; col++) {
                this.drawCell(row, col);
            }
        }
    }
    /**
     * Draw cells with wall data. Will only draw top and left walls
     *
     * @param {number} row
     * @param {number} col
     */
    drawCell(row, col) {
        const cell = this.cells[row][col];
        if (this.recursing[row][col]) {
            noStroke();
            fill('red');
            rect(this.x + col * this.cellSize, this.y + row * this.cellSize, this.cellSize, this.cellSize);
            fill('white');
        }
        else if (cell == 15) {
            noStroke();
            fill('grey');
            rect(this.x + col * this.cellSize, this.y + row * this.cellSize, this.cellSize, this.cellSize);
            fill('white');
        }
        fill('black');
        if (cell & DIRECTIONS.N) {
            rect(this.x + col * this.cellSize, this.y + row * this.cellSize, this.cellSize, 1);
        }
        if (cell & DIRECTIONS.W) {
            rect(this.x + col * this.cellSize, this.y + row * this.cellSize, 1, this.cellSize);
        }
        // if (cell & DIRECTIONS.S) {
        //     rect(this.x + row * CELL_SIZE, this.y + col * CELL_SIZE + CELL_SIZE, CELL_SIZE, 1);
        // }
        // if (cell & DIRECTIONS.E) {
        //     rect(this.x + row * CELL_SIZE + CELL_SIZE, this.y + col * CELL_SIZE, 1, CELL_SIZE);
        // }
    }
    drawMaze(timeout) {
        this.recursing = Array(this.rows).fill(0).map(() => Array(this.cols).fill(false));
        this.asyncCarve(0, 0, timeout);
    }
    carve(cX, cY) {
        // Shuffle for direction
        let dirs = shuffleArray(Object.keys(DIRECTIONS));
        for (const d of dirs) {
            // Neighbor
            let nX = cX + DX[d];
            let nY = cY + DY[d];
            // Keep in bounds
            if (nX >= 0 && nX < this.cells[0].length && nY >= 0 && nY < this.cells.length) {
                // If cell is already visited
                if (this.cells[nY][nX] >= 0)
                    continue;
                this.cells[cY][cX] |= DIRECTIONS[d];
                this.cells[nY][nX] |= DIRECTIONS[OPPOSITES[d]];
                // We must go deeper!
                this.carve(nX, nY, this.cells);
            }
            // Otherwise find a different neighbor
        }
    }
    asyncCarve(cX, cY, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                yield new Promise(r => setTimeout(r, timeout));
                this.recursing[cY][cX] = true;
                // Shuffle for direction
                let dirs = shuffleArray(Object.keys(DIRECTIONS));
                for (const d of dirs) {
                    // Neighbor
                    let nX = cX + DX[d];
                    let nY = cY + DY[d];
                    // Keep in bounds
                    if (nX >= 0 && nX < this.cells[0].length &&
                        nY >= 0 && nY < this.cells.length) {
                        // If cell is already visited
                        if (this.cells[nY][nX] < 15)
                            continue;
                        this.cells[cY][cX] ^= DIRECTIONS[d];
                        this.cells[nY][nX] ^= DIRECTIONS[OPPOSITES[d]];
                        // We must go deeper!
                        yield this.asyncCarve(nX, nY, timeout);
                    }
                    // Otherwise find a different neighbor
                }
                // Exit recursion
                yield new Promise(r => setTimeout(r, timeout));
                this.recursing[cY][cX] = false;
                resolve();
            }));
        });
    }
}
// Dummy
function genMaze(width, height) {
    // Start with 0s to indicate not visited
    let cells = Array(width).fill(0).map(() => Array(height).fill(0));
    return carve(0, 0, cells);
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}