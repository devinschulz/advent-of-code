import { assertEquals } from "jsr:@std/assert";

const data = await Deno.readTextFile("./input.txt");

function parseIntoFirstLast(data: string) {
  return data.split("\n").map((line) => line.split(/\s+/).map(Number)).reduce(
    (acc, current) => {
      acc.first.push(current[0]);
      acc.last.push(current[1]);
      return acc;
    },
    { first: [], last: [] } as { first: number[]; last: number[] },
  );
}

function partOne(data: string) {
  const { first, last } = parseIntoFirstLast(data);

  first.sort();
  last.sort();

  let distance = 0;

  for (let i = 0; i < first.length; i++) {
    distance += Math.abs(first[i] - last[i]);
  }

  return distance;
}

function partTwo(data: string) {
  const { first, last } = parseIntoFirstLast(data);
  let sum = 0;

  for (const num of first) {
    const entries = last.filter((entry) => entry === num).length;
    sum += num * entries;
  }

  return sum;
}

const testInput = `3   4
4   3
2   5
1   3
3   9
3   3`;

Deno.test("2024/1 part one", () => {
  assertEquals(partOne(testInput), 11);
  assertEquals(partOne(data), 2375403);
});

Deno.test("2024/1 part two", () => {
  assertEquals(partTwo(testInput), 31);
  assertEquals(partTwo(data), 23082277);
});
