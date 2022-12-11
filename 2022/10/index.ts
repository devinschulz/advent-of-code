import { assert, path } from "../deps.ts";
import { groupBy } from "../utils.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const text = await Deno.readTextFile(path.join(__dirname, "./input.txt"));

const signals = text
  .trim()
  .split("\n")
  .map((line: string) => {
    const [head, tail] = line.split(" ");
    if (head === "noop") return [0];
    return [0, Number(tail)];
  })
  .flat();

const cycles = new Set([20, 60, 100, 140, 180, 220]);

const part1 = signals.reduce(
  (acc, cur, i) => {
    const cycle = i + 1;
    if (cycles.has(cycle)) {
      acc.signalStrength += cycle * acc.x;
    }
    acc.x += cur;
    return acc;
  },
  {
    x: 1,
    signalStrength: 0,
  },
).signalStrength;

const width = 40;
const spritePosition = (x: number) => new Set([x - 1, x, x + 1]);
const crt = Array(240).fill(" ");

signals.reduce(
  (acc, cur, cycle) => {
    if (cycles.has(cycle)) {
      acc.signalStrength += cycle * acc.x;
    }
    if (spritePosition(acc.x).has(cycle % width)) {
      crt[cycle] = "#";
    }
    acc.x += cur;
    return acc;
  },
  {
    x: 1,
    signalStrength: 0,
  },
);

const part2 = groupBy(crt, width).map((row) => row.join(""));

Deno.test("Day 10 part 1", () => {
  assert.assertEquals(part1, 16480);
});

Deno.test("Dat 10 part 2", () => {
  assert.assertEquals(part2, [
    "###  #    #### #### #  # #    ###  ###  ",
    "#  # #    #    #    #  # #    #  # #  # ",
    "#  # #    ###  ###  #  # #    #  # ###  ",
    "###  #    #    #    #  # #    ###  #  # ",
    "#    #    #    #    #  # #    #    #  # ",
    "#    #### #### #     ##  #### #    ###  ",
  ]);
});
