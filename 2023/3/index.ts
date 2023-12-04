import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { pipe } from "fp-ts/function";
import * as S from "fp-ts/string";
import * as A from "fp-ts/Array";
import * as N from "fp-ts/number";
import * as O from "fp-ts/option";
import * as ROA from "fp-ts/ReadonlyArray";
import * as NEA from "fp-ts/NonEmptyArray";

const input = pipe(
  readFileSync(resolve(__dirname, "./input.txt"), "utf-8"),
  S.trim,
  S.split("\n"),
);

const matrix: number[][] = A.makeBy(input.length, () =>
  A.makeBy(input[0].length, () => 0),
);
const indicies: [string, number, number][] = [];
const gearIndex: [number, number][] = [];

const fillMatrix = (
  matrix: number[][],
  row: number,
  startCol: number,
  numStr: string,
) => {
  for (let x = startCol; x < startCol + numStr.length; x++) {
    matrix[row][x] = parseInt(numStr);
  }
};

const isWithinBounds = (i: number, j: number): boolean =>
  i >= 0 && i < input.length && j >= 0 && j < input[0].length;

const isValidNumber = (x: number, y: number, size: number): boolean =>
  pipe(
    NEA.range(x - 1, x + 1),
    A.some((i) =>
      pipe(
        NEA.range(y - 1, y + size),
        A.some(
          (j) =>
            isWithinBounds(i, j) &&
            input[i][j] !== "." &&
            !/\d/.test(input[i][j]),
        ),
      ),
    ),
  );

const getAdjacents = (x: number, y: number): number[] =>
  pipe(
    NEA.range(x - 1, x + 1),
    A.flatMap((i) =>
      pipe(
        NEA.range(y - 1, y + 1),
        A.flatMap((j) =>
          isWithinBounds(i, j) && matrix[i][j] !== 0 ? [matrix[i][j]] : [],
        ),
      ),
    ),
    A.uniq(N.Eq),
  );

pipe(
  input,
  ROA.mapWithIndex((i, line) => {
    let numStr = "";
    let startCol = 0;

    pipe(
      line,
      S.split(""),
      ROA.mapWithIndex((j, char) => {
        if (/\d/.test(char)) {
          if (!numStr) {
            startCol = j;
          }
          numStr += char;
        } else {
          if (numStr) {
            indicies.push([numStr, i, startCol]);
            fillMatrix(matrix, i, startCol, numStr);
          }
          numStr = "";
          if (char === "*") {
            gearIndex.push([i, j]);
          }
        }
      }),
    );
    if (numStr) {
      indicies.push([numStr, i, startCol]);
      fillMatrix(matrix, i, startCol, numStr);
    }
  }),
);

const part1 = pipe(
  indicies,
  A.reduce(0, (acc, [num, r, c]) =>
    isValidNumber(r, c, num.length) ? acc + parseInt(num) : acc,
  ),
);

const part2 = pipe(
  gearIndex,
  A.reduce(0, (acc, [r, c]) =>
    pipe(
      getAdjacents(r, c),
      O.fromPredicate((nums) => nums.length === 2),
      O.fold(
        () => acc,
        (nums) => acc + nums[0] * nums[1],
      ),
    ),
  ),
);

console.log(part1); // 512794
console.log(part2); // 67779080
