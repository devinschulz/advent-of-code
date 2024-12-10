import { assertEquals } from "jsr:@std/assert";

const data = await Deno.readTextFile("./input.txt");

function getId(str: string) {
  let counter = 0;
  let result: string[] = [];

  for (let i = 0; i < str.length; i++) {
    const count = parseInt(str[i]);
    if (i % 2 === 0) {
      result.push(...Array.from({ length: count }, () => counter.toString()));
      counter++;
    } else {
      result.push(...Array.from({ length: count }, () => "."));
    }
  }
  return result;
}

function partOne(data: string) {
  let id = getId(data);

  for (let i = id.length - 1; i > 0; i--) {
    if (id[i] === ".") {
      continue;
    }
    const swapId = id.indexOf(".");
    if (swapId < i) {
      const temp = id[swapId];
      id[swapId] = id[i];
      id[i] = temp;
    }
  }
  return id
    .map((x, i) => {
      if (x === ".") {
        return 0;
      }
      const num = parseInt(x);
      return num * i;
    })
    .reduce((a, b) => a + b);
}

const testInput = `2333133121414131402`;

Deno.test("2024/9 part one", () => {
  assertEquals(partOne("12345"), 60);
  assertEquals(partOne(testInput), 1928);
  assertEquals(partOne(data.trim()), 6340197768906);
});
