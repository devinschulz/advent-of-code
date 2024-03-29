import { assert, path } from "../deps.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const text = await Deno.readTextFile(path.join(__dirname, "./input.txt"));

const result = text
  .split("\n\n")
  .map((x) =>
    x
      .split("\n")
      .map(Number)
      .reduce<number>((acc, current) => acc + current, 0)
  )
  .sort();

Deno.test("Day 1 part 1", () => {
  const part1 = result.at(-1);
  assert.assertEquals(part1, 72017);
});

Deno.test("Day 1 part 2", () => {
  const part2 = result.slice(-3).reduce((acc, current) => acc + current, 0);
  assert.assertEquals(part2, 212520);
});
