import { assertEquals } from "jsr:@std/assert";

const data = await Deno.readTextFile("./input.txt");

function parseReport(data: string) {
  return data.split("\n").map((line) => line.split(/\s+/).map(Number));
}

function checkIncrementingOrDecrementing(row: number[]) {
  let isIncrementing = true;
  let isDecrementing = true;

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] >= row[i + 1]) {
      isIncrementing = false;
    }
    if (row[i] <= row[i + 1]) {
      isDecrementing = false;
    }
  }
  return isIncrementing || isDecrementing;
}

function checkIncrements(row: number[]) {
  for (let i = 0; i < row.length; i++) {
    if (Math.abs(row[i] - row[i - 1]) > 3) {
      return false;
    }
  }
  return true;
}

function checkReport(row: number[]) {
  return checkIncrementingOrDecrementing(row) && checkIncrements(row);
}

function partOne(data: string) {
  return parseReport(data).filter(checkReport).length;
}

function partTwo(data: string) {
  return parseReport(data).filter((row) => {
    if (checkReport(row)) {
      return true;
    }
    for (let i = 0; i < row.length; i++) {
      let copy = [...row];
      copy.splice(i, 1);
      if (checkReport(copy)) {
        return true;
      }
    }
    return false;
  }).length;
}

const testInput = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

Deno.test("2024/2 part one", () => {
  assertEquals(partOne(testInput), 2);
  assertEquals(partOne(data), 663);
});

Deno.test("2024/2 part two", () => {
  assertEquals(partTwo(testInput), 4);
  assertEquals(partTwo(data), 692);
});
