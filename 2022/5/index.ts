import { assert, path } from "../deps.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const text = await Deno.readTextFile(path.join(__dirname, "./input.txt"));

const result = text.trim().split("\n");

const data = result.splice(0, 8).reduce<string[][]>((acc, current) => {
  current.match(/[A-Z]|\./g)?.forEach((x, i) => {
    if (x !== ".") {
      acc[i] = [x, ...(acc[i] || [])];
    }
  });
  return acc;
}, []);

const data2 = [...data.map((x) => [...x])];

const parseRow = (d: string[][], reversed: boolean) => (row: string) => {
  const [move, from, to] = row.match(/\d+/g)?.map(Number) || [0, 0, 0];
  const moved = d[from - 1].splice(move * -1);
  d[to - 1] = d[to - 1].concat(reversed ? moved.reverse() : moved);
};

result.slice(2).forEach(parseRow(data, false));
result.slice(2).forEach(parseRow(data2, true));

const part1 = data.flatMap((x) => x.at(-1)).join("");
const part2 = data2.flatMap((x) => x.at(-1)).join("");

Deno.test("Day 5 part 1", () => {
  assert.equal(part1, "LJSVLTWQM");
});

Deno.test("Day 5 part 2", () => {
  assert.equal(part2, "BRQWDBBJM");
});
