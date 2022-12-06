import { assert, path } from "../deps.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const text = (
  await Deno.readTextFile(path.join(__dirname, "./input.txt"))
).trim();

const fn = (text: string, markerSize: number) => {
  for (let i = markerSize; i < text.length; i++) {
    if (new Set(text.slice(i - markerSize, i).split("")).size === markerSize) {
      return i;
    }
  }
};

Deno.test("Day 6 part 1", () => {
  assert.assertEquals(fn(text, 4), 1651);
});

Deno.test("Day 6 part 3", () => {
  const part2 = fn(text, 14);
  assert.assertEquals(part2, 3837);
});
