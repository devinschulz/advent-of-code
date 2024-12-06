import { assertEquals } from "jsr:@std/assert";

const data = await Deno.readTextFile("./input.txt");

function multiply(line: RegExpMatchArray[]) {
  return line
    .map(([, a, b]) => Number(a) * Number(b))
    .reduce((acc, cur) => acc + cur, 0);
}

function partOne(data: string) {
  return data
    .split("\n")
    .map((line) => [...line.matchAll(/mul\((\d+),(\d+)\)/g)])
    .map(multiply)
    .reduce((acc, cur) => acc + cur, 0);
}

function partTwo(data: string) {
  let canDo = true;

  return data
    .split("\n")
    .map((line) => [...line.matchAll(/mul\((\d+,\d+)\)|do\(\)|don't\(\)/g)])
    .map((line) => {
      const calculations = [];

      for (let i = 0; i < line.length; i++) {
        if (line[i][0] === "do()") {
          canDo = true;
        } else if (line[i][0] === "don't()") {
          canDo = false;
        } else if (canDo) {
          calculations.push(line[i][1]);
        }
      }
      return calculations;
    })
    .flat()
    .flatMap((str) =>
      str
        .split(",")
        .map(Number)
        .reduce((acc, cur) => acc * cur, 1),
    )
    .reduce((acc, cur) => acc + cur, 0);
}

Deno.test("2024/3 part one", () => {
  const testInput = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
  assertEquals(partOne(testInput), 161);
  assertEquals(partOne(data), 183380722);
});

Deno.test("2024/3 part two", () => {
  const testInput = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;
  assertEquals(partTwo(testInput), 48);
  assertEquals(partTwo(data), 83546082);
});
