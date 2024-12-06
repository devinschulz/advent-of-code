import { assertEquals } from "jsr:@std/assert";

const data = await Deno.readTextFile("./input.txt");

enum DIRECTIONS {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

interface Position {
  x: number;
  y: number;
  direction: DIRECTIONS;
}

function turnRight(direction: DIRECTIONS) {
  return (direction + 1) % 4;
}

const parseInput = (input: string) => {
  const grid = input.split("\n").map((line) => line.split(""));
  const position = { x: 0, y: 0, direction: DIRECTIONS.NORTH };

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "^") {
        position.x = x;
        position.y = y;
        grid[y][x] = "X";
      }
    }
  }

  return { grid, position };
};

function moveForward(position: Position, grid: string[][]) {
  const { x, y, direction } = position;
  let nextX = x;
  let nextY = y;

  if (direction === DIRECTIONS.NORTH) nextY--;
  else if (direction === DIRECTIONS.EAST) nextX++;
  else if (direction === DIRECTIONS.SOUTH) nextY++;
  else if (direction === DIRECTIONS.WEST) nextX--;

  if (
    nextY < 0 ||
    nextY >= grid.length ||
    nextX < 0 ||
    nextX >= grid[0].length
  ) {
    return true;
  }

  if (grid[nextY][nextX] === "#") {
    position.direction = turnRight(direction);
  } else {
    position.x = nextX;
    position.y = nextY;
  }
}

function simulate(grid: string[][], startPosition: Position) {
  const visited = new Set<string>();
  let position = { ...startPosition };

  while (true) {
    const key = `${position.x},${position.y},${position.direction}`;
    if (visited.has(key)) {
      // Loop detected
      return true;
    }
    visited.add(key);

    if (moveForward(position, grid)) {
      break;
    }
  }

  return false;
}

function partOne(data: string) {
  const { position, grid } = parseInput(data);
  let isDone = false;

  while (!isDone) {
    const { x, y } = position;

    grid[y][x] = "X";

    if (moveForward(position, grid)) {
      break;
    }
  }

  return grid.reduce(
    (sum, cur) => sum + cur.filter((x) => x === "X").length,
    0,
  );
}

function partTwo(data: string) {
  const { position, grid } = parseInput(data);
  const possibleObstructions: [number, number][] = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "." && !(x === position.x && y === position.y)) {
        grid[y][x] = "#";

        if (simulate(grid, position)) {
          possibleObstructions.push([x, y]);
        }

        grid[y][x] = ".";
      }
    }
  }

  return possibleObstructions.length;
}

const testInput = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

Deno.test("2024/6 part one", () => {
  assertEquals(partOne(testInput), 41);
  assertEquals(partOne(data), 5212);
});

Deno.test("2024/6 part two", () => {
  assertEquals(partTwo(testInput), 6);
  assertEquals(partTwo(data), 1767);
});
