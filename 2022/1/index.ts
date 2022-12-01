import * as path from "https://deno.land/std@0.57.0/path/mod.ts";
import { assertEquals } from "https://deno.land/std@0.102.0/testing/asserts.ts";

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

Deno.test("Part 1", () => {
  const part1 = result.at(-1);
  assertEquals(part1, 72017);
});

Deno.test("Part 2", () => {
  const part2 = result.slice(-3).reduce((acc, current) => acc + current, 0);
  assertEquals(part2, 212520);
});
