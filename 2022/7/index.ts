import { assert, path } from "../deps.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const text = (
  await Deno.readTextFile(path.join(__dirname, "./input.txt"))
).trim();

let pwd: string[] = [];
const dirs: { [key: string]: number } = {};

text.split("\n").forEach((line) => {
  if (line === "$ cd /") {
    pwd = [];
  } else if (line === "$ cd ..") {
    pwd.pop();
  } else if (/\$ cd \w+/.test(line)) {
    pwd.push(line.split(" ").pop()!);
  } else if (/^\d+ \w+/.test(line)) {
    const size = Number(line.split(" ").shift());
    for (let i = pwd.length; i >= 0; i--) {
      const part = pwd.slice(0, i).join("/");
      dirs[part] = (dirs[part] || 0) + size;
    }
  }
});

const part1 = Object.values(dirs)
  .filter((sizes) => sizes <= 100_000)
  .reduce((acc, cur) => acc + cur);

Deno.test("Day 7 part 1", () => {
  assert.assertEquals(part1, 1084134);
});

const FILE_SYSTEM_MAX = 70_000_000;
const REQUIRED_SPACE = 30_000_000;

const required = REQUIRED_SPACE - (FILE_SYSTEM_MAX - dirs[""]);

const part2 = Object.values(dirs)
  .filter((x) => x >= required)
  .reduce((acc, cur) => Math.min(acc, cur));

Deno.test("Day 8 part 2", () => {
  assert.assertEquals(part2, 6183184);
});
