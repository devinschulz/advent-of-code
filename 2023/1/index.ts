import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { constNull, constant, pipe } from "fp-ts/function";
import * as S from "fp-ts/string";
import * as O from "fp-ts/Option";
import * as A from "fp-ts/Array";
import * as N from "fp-ts/number";
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray";
import * as ROA from "fp-ts/ReadonlyArray";
import { not } from "fp-ts/Predicate";
import { concatAll } from "fp-ts/Monoid";

const input = pipe(
  readFileSync(resolve(__dirname, "./input.txt"), "utf-8"),
  S.split("\n"),
);

const rowToNumbers = (row: string) =>
  pipe(
    row,
    S.split(""),
    RNEA.map(Number),
    RNEA.filter(not(isNaN)),
    O.getOrElseW(constant([])),
  );

const part1 = pipe(
  input,
  RNEA.map((row) => {
    const chars = rowToNumbers(row);
    const first = pipe(chars, ROA.head, O.getOrElseW(constant("")));
    const last = pipe(chars, ROA.last, O.getOrElseW(constant("")));
    return Number(`${first}${last}`);
  }),
  concatAll(N.MonoidSum),
);

console.log("part 1:", part1);

const digits = pipe(
  ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"],
  A.mapWithIndex((index, word) => [word, index + 1] as const),
);

const part2 = pipe(
  input,
  ROA.map((row) =>
    pipe(
      row,
      S.split(""),
      ROA.mapWithIndex((index, char) =>
        pipe(
          digits,
          A.filterMap(([word, num]) =>
            pipe(row, S.slice(index, row.length), S.startsWith(word))
              ? O.some(num)
              : O.none,
          ),
          A.head,
          O.getOrElse(constant(Number(char))),
        ),
      ),
      ROA.filter(not(isNaN)),
      (x) => Number(`${x.at(0)}${x.at(-1)}`),
    ),
  ),
  ROA.filter(not(isNaN)),
  concatAll(N.MonoidSum),
);

console.log("part 2:", part2);
