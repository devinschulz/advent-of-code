import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as N from 'fp-ts/number'
import * as Ord from 'fp-ts/Ord'
import { not } from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const input = pipe(
  readFileSync(resolve(__dirname, './input.txt'), 'utf-8'),
  S.split('\n'),
  RA.filter(not(S.isEmpty)),
  RA.map((x) => x.match(/\d+/g).map(Number)),
  RA.toArray
)

const max = Ord.max(N.Ord)
const min = Ord.min(N.Ord)

const plotY = (acc: number[][], x: number, y1: number, y2: number) =>
  pipe(
    NEA.range(min(y1, y2), max(y1, y2)),
    A.reduce(acc, (acc, y) => {
      if (!acc[x]) acc[x] = []
      acc[x][y] = (acc[x][y] || 0) + 1
      return acc
    })
  )

const plotX = (acc: number[][], y: number, x1: number, x2: number) =>
  pipe(
    NEA.range(min(x1, x2), max(x1, x2)),
    A.reduce(acc, (acc, x) => {
      if (!acc[x]) acc[x] = []
      acc[x][y] = (acc[x][y] || 0) + 1
      return acc
    })
  )

const plotDiagonal = (
  acc: number[][],
  x1: number,
  y1: number,
  x2: number,
  y2: number
) =>
  pipe(
    NEA.range(0, Math.abs(x1 - x2)),
    A.reduceWithIndex(acc, (i, acc) => {
      const x = x1 + i * (x1 < x2 ? 1 : -1)
      const y = y1 + i * (y1 < y2 ? 1 : -1)
      if (!acc[x]) acc[x] = []
      acc[x][y] = (acc[x][y] || 0) + 1
      return acc
    })
  )

const countOverlaps = (result: number[][]) =>
  pipe(
    result,
    A.flatten,
    A.filter<number>((x) => Ord.gt(N.Ord)(x, 1)),
    A.size
  )

const part1 = pipe(
  input,
  A.reduce<number[], number[][]>([], (b, [x1, y1, x2, y2]) => {
    if (x1 === x2) return plotY(b, x1, y1, y2)
    if (y1 === y2) return plotX(b, y1, x1, x2)
    return b
  }),
  countOverlaps
)

const part2 = pipe(
  input,
  A.reduce<number[], number[][]>([], (b, [x1, y1, x2, y2]) => {
    if (x1 === x2) return plotY(b, x1, y1, y2)
    if (y1 === y2) return plotX(b, y1, x1, x2)
    return plotDiagonal(b, x1, y1, x2, y2)
  }),
  countOverlaps
)

console.log('part 1', part1)
console.log('part 2', part2)
