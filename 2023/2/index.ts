import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { flow, pipe } from "fp-ts/function";
import * as S from "fp-ts/string";
import * as A from "fp-ts/Array";
import * as N from "fp-ts/number";
import * as ROA from "fp-ts/ReadonlyArray";
import { concatAll } from "fp-ts/Monoid";

const input = pipe(
  readFileSync(resolve(__dirname, "./input.txt"), "utf-8"),
  S.trim,
  S.split("\n"),
);

// Game 71: 1 red, 10 blue; 1 green, 12 blue, 2 red; 4 red, 4 green, 8 blue

interface Game {
  red: number;
  blue: number;
  green: number;
}
interface Games {
  id: number;
  games: Game[];
}

const MAX_COLORS = { red: 12, green: 13, blue: 14 } satisfies Game;

const parseGame = (str: string): Game =>
  pipe(
    str,
    S.split(/,\s?/),
    ROA.reduce<string, Game>({ red: 0, blue: 0, green: 0 }, (acc, turn) => {
      const match = turn.trim().match(/(\d+) (\w+)/);
      const key = match?.[2];
      if (key) {
        acc[key] = acc[key] + (Number(match?.[1]) || 0);
      }
      return acc;
    }),
  );

const parsed = pipe(
  input,
  ROA.reduce<string, Games[]>([], (acc, row) => {
    const gameRe = row.match(/Game (\d+):/);
    const game = {
      id: Number(gameRe?.[1]),
      games: pipe(
        row,
        S.replace(gameRe?.[0] ?? "", ""),
        S.trim,
        S.split(";"),
        ROA.map(flow(S.trim, parseGame)),
        ROA.toArray,
      ),
    };
    acc.push(game);
    return acc;
  }),
);

const part1 = pipe(
  parsed,
  ROA.filter(
    flow(
      (game) => game.games,
      A.every(
        ({ red, blue, green }) =>
          red <= MAX_COLORS.red &&
          blue <= MAX_COLORS.blue &&
          green <= MAX_COLORS.green,
      ),
    ),
  ),
  ROA.map(({ id }) => id),
  concatAll(N.MonoidSum),
);

// which games would have been possible if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes?
interface Total {
  red: number[];
  green: number[];
  blue: number[];
}

const part2 = pipe(
  parsed,
  ROA.reduce<Games, Total[]>([], (acc, games) => {
    const total: Total = { red: [], green: [], blue: [] };
    games.games.forEach((game) => {
      total.blue.push(game.blue);
      total.red.push(game.red);
      total.green.push(game.green);
    });
    acc.push(total);
    return acc;
  }),
  ROA.map((game) => ({
    red: Math.max(...game.red),
    blue: Math.max(...game.blue),
    green: Math.max(...game.green),
  })),
  ROA.map(({ green, red, blue }) => green * red * blue),
  concatAll(N.MonoidSum),
);

console.log("part 1:", part1);
console.log("part 2:", part2);
