import { assert, path } from "../deps.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const text = await Deno.readTextFile(path.join(__dirname, "./input.txt"));

interface Range {
  start: number;
  end: number;
}

const parse = (row: string): { e1: Range; e2: Range } => {
  const [e1, e2] = row.split(",");
  const [e1r1, e1r2] = e1.split("-");
  const [e2r1, e2r2] = e2.split("-");
  return { e1: { start: +e1r1, end: +e1r2 }, e2: { start: +e2r1, end: +e2r2 } };
};

const part1 = text
  .trim()
  .split("\n")
  .filter((x) => {
    const { e1, e2 } = parse(x);
    return (
      (e1.start <= e2.start && e1.end >= e2.end) ||
      (e2.start <= e1.start && e2.end >= e1.end)
    );
  }).length;

const part2 = text
  .trim()
  .split("\n")
  .filter((x) => {
    const { e1, e2 } = parse(x);
    return e1.start <= e2.end && e1.end >= e2.start;
  }).length;

Deno.test("Day 4 part 1", () => {
  assert.equal(part1, 534);
});

Deno.test("Day 4 part 2", () => {
  assert.equal(part2, 841);
});
