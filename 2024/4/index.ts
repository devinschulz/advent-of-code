import { assertEquals } from "jsr:@std/assert";

const data = await Deno.readTextFile("./input.txt");

type Grid = string[][];

function parseGrid(data: string): Grid {
  return data.split("\n").map((line) => line.split(""));
}

function verticalGrid(grid: Grid): Grid {
  return Array.from({ length: grid[0].length }, (_, col) =>
    Array.from({ length: grid.length }, (_, row) => grid[row][col]),
  );
}

function diagonalGrid(grid: Grid, reverse = false): Grid {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  const diagonals: Grid = [];

  if (!reverse) {
    // Traverse from top-left to bottom-left
    for (let col = 0; col < cols; col++) {
      let r = 0,
        c = col;
      const diagonal: string[] = [];
      while (r < rows && c >= 0) {
        diagonal.push(grid[r][c]);
        r++;
        c--;
      }
      diagonals.push(diagonal);
    }

    // Traverse from bottom-left to bottom-right
    for (let row = 1; row < rows; row++) {
      let r = row,
        c = cols - 1;
      const diagonal: string[] = [];
      while (r < rows && c >= 0) {
        diagonal.push(grid[r][c]);
        r++;
        c--;
      }
      diagonals.push(diagonal);
    }
  } else {
    // Traverse from top-right to bottom-right
    for (let col = cols - 1; col >= 0; col--) {
      let r = 0,
        c = col;
      const diagonal: string[] = [];
      while (r < rows && c < cols) {
        diagonal.push(grid[r][c]);
        r++;
        c++;
      }
      diagonals.push(diagonal);
    }

    // Traverse from bottom-left to top-left
    for (let row = 1; row < rows; row++) {
      let r = row,
        c = 0;
      const diagonal: string[] = [];
      while (r < rows && c < cols) {
        diagonal.push(grid[r][c]);
        r++;
        c++;
      }
      diagonals.push(diagonal);
    }
  }

  return diagonals;
}

function countWords(line: string, word: string) {
  let count = 0;
  let pos = line.indexOf(word);

  while (pos !== -1) {
    count++;
    pos = line.indexOf(word, pos + 1);
  }

  return count;
}

function countWordsInLine(line: string, word: string) {
  return (
    countWords(line, word) +
    countWords(line.split("").toReversed().join(""), word)
  );
}

function partOne(data: string) {
  const grid = parseGrid(data);
  const word = "XMAS";
  let count = 0;

  // Horizontally
  for (const line of grid) {
    count += countWordsInLine(line.join(""), word);
  }

  // Vertically
  for (const line of verticalGrid(grid)) {
    count += countWordsInLine(line.join(""), word);
  }

  // Diagonally
  for (const line of diagonalGrid(grid)) {
    count += countWordsInLine(line.join(""), word);
  }

  // Diagonally reversed
  for (const line of diagonalGrid(grid, true)) {
    count += countWordsInLine(line.join(""), word);
  }

  return count;
}

function isMas(grid: Grid, x: number, y: number) {
  let surrounding = "";
  surrounding += grid[y - 1]?.[x - 1] || "";
  surrounding += grid[y - 1]?.[x + 1] || "";
  surrounding += grid[y + 1]?.[x - 1] || "";
  surrounding += grid[y + 1]?.[x + 1] || "";

  if (["SSMM", "MMSS", "MSMS", "SMSM"].includes(surrounding)) {
    return true;
  }
  return false;
}

function partTwo(data: string) {
  const grid = parseGrid(data);
  let count = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] == "A" && isMas(grid, x, y)) {
        count += 1;
      }
    }
  }
  return count;
}

const testInput = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

Deno.test("2024/2 part one", () => {
  assertEquals(partOne(testInput), 18);
  assertEquals(partOne(data), 2514);
});

Deno.test("2024/2 part two", () => {
  assertEquals(partTwo(testInput), 9);
  assertEquals(partTwo(data), 1888);
});
