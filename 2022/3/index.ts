import { assert, path } from "../deps.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const text = await Deno.readTextFile(path.join(__dirname, "./input.txt"));

const formatted = text.split("\n");

const score = (acc: number, current: string | undefined) => {
  if (!current) return acc;
  return (
    acc +
    current.toLowerCase().charCodeAt(0) -
    96 +
    (/[A-Z]/.test(current) ? 26 : 0)
  );
};

const find = (...arr: string[]) => {
  return arr
    .map((y) => y.split(""))
    .reduce((a, b) => a.filter((c) => b.includes(c)))[0];
};

const part1 = formatted
  .map((x) => {
    const half = x.length / 2;
    return find(x.slice(0, half), x.slice(half));
  })
  .reduce(score, 0);

const SIZE = 3;

const part2 = Array.from(
  { length: Math.ceil(formatted.length / SIZE) },
  (_v, i) => formatted.slice(i * SIZE, i * SIZE + SIZE),
)
  .map((x) => find(...x))
  .reduce(score, 0);

Deno.test("Day 3 part 1", () => {
  assert.equal(part1, 8039);
});

Deno.test("Day 3 part 2", () => {
  assert.equal(part2, 2510);
});
