import { assertEquals } from "jsr:@std/assert";

const data = await Deno.readTextFile("./input.txt");

function parseData(data: string): number[][] {
  return data.split("\n").map((x) => x.split("").map(Number));
}

const DIRECTIONS = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
];

function partOne(data: string) {
  const rows = parseData(data);
  let total = 0;

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[0].length; x++) {
      if (rows[y][x] === 0) {
        const found = new Set();
        const visited = new Set();
        visited.add(`${x},${y}`);

        const positions = [{ x, y }];

        while (positions.length > 0) {
          let { x: cx, y: cy } = positions.shift() || {};

          if (cx === undefined || cy === undefined) {
            break;
          }

          if (rows[cy][cx] === 9) {
            found.add(`${cx},${cy}`);
            continue;
          }

          for (const { x: dx, y: dy } of DIRECTIONS) {
            const pos = { x: cx + dx, y: cy + dy };
            if (
              pos.x >= 0 &&
              pos.y >= 0 &&
              pos.x < rows[0].length &&
              pos.y < rows.length &&
              rows[pos.y][pos.x] === rows[cy][cx] + 1 &&
              !visited.has(`${pos.x},${pos.y}`)
            ) {
              visited.add(`${pos.x},${pos.y}`);
              positions.push(pos);
            }
          }
        }

        total += found.size;
      }
    }
  }

  return total;
}

function partTwo(data: string) {
  const rows = parseData(data);
  let total = 0;

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[0].length; x++) {
      if (rows[y][x] === 0) {
        const positions = [{ x, y }];

        while (positions.length > 0) {
          let { x: cx, y: cy } = positions.shift() || {};

          if (cx === undefined || cy === undefined) {
            break;
          }

          if (rows[cy][cx] === 9) {
            total++;
            continue;
          }

          for (const { x: dx, y: dy } of DIRECTIONS) {
            const pos = { x: cx + dx, y: cy + dy };
            if (
              pos.x >= 0 &&
              pos.y >= 0 &&
              pos.x < rows[0].length &&
              pos.y < rows.length &&
              rows[pos.y][pos.x] === rows[cy][cx] + 1
            ) {
              positions.push(pos);
            }
          }
        }
      }
    }
  }

  return total;
}

const testInput = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

Deno.test("2024/10 part one", () => {
  assertEquals(partOne(testInput), 36);
  assertEquals(partOne(data), 548);
});

Deno.test("2024/10 part two", () => {
  assertEquals(partTwo(testInput), 81);
  assertEquals(partTwo(data), 1252);
});
