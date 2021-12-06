import * as A from 'fp-ts/Array'
import { flow, identity, pipe } from 'fp-ts/function'
import { not } from 'fp-ts/lib/Predicate'
import * as N from 'fp-ts/number'
import * as O from 'fp-ts/Option'
import * as Ord from 'fp-ts/Ord'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const numbers = [
  26, 55, 7, 40, 56, 34, 58, 90, 60, 83, 37, 36, 9, 27, 42, 19, 46, 18, 49, 52,
  75, 17, 70, 41, 12, 78, 15, 64, 50, 54, 2, 77, 76, 10, 43, 79, 22, 32, 47, 0,
  72, 30, 21, 82, 6, 95, 13, 59, 16, 89, 1, 85, 57, 62, 81, 38, 29, 80, 8, 67,
  20, 53, 69, 25, 23, 61, 86, 71, 68, 98, 35, 31, 4, 33, 91, 74, 14, 28, 65, 24,
  97, 88, 3, 39, 11, 93, 66, 44, 45, 96, 92, 51, 63, 84, 73, 99, 94, 87, 5, 48,
]

const transpose = (game: number[][]): number[][] =>
  pipe(
    game,
    A.concat(
      pipe(
        game,
        A.mapWithIndex((i) => A.map((cell) => cell[i])(game))
      )
    )
  )

const input = pipe(
  readFileSync(resolve(__dirname, './input.txt'), 'utf-8'),
  S.split('\n'),
  RA.filter(not(S.isEmpty)),
  RA.toArray,
  A.map(
    flow(S.split(/\s+/), RA.map(parseInt), RA.filter(not(isNaN)), RA.toArray)
  ),
  A.chunksOf(5),
  A.map(transpose)
)

const isRowWinner = (nums: number[]) => (row: number[]) =>
  pipe(row, A.intersection(N.Eq)(nums), A.size, Ord.equals(N.Ord)(5))

const calculateUnmarkedScore = (current: number[]) => (game: number[][]) =>
  pipe(
    game,
    A.flatten,
    // get rid of the transposed numbers
    A.uniq(N.Eq),
    A.difference(N.Eq)(current),
    A.reduce(0, (acc, x) => acc + x),
    (num) => num * current[current.length - 1]
  )

const part1 = pipe(input, (games) => {
  let index = 0
  let current = numbers.slice(0, index)
  return pipe(
    games,
    A.chop((games) => {
      const game = pipe(games, A.findFirst(A.some(isRowWinner(current))))
      if (O.isSome(game)) {
        return [pipe(game.value, calculateUnmarkedScore(current)), []]
      }
      index++
      current = numbers.slice(0, index)
      return [undefined, games]
    })
  )
})

const part2 = pipe(input, (games) => {
  let index = 0
  let current = numbers.slice(0, index)
  let score = 0
  return pipe(
    games,
    A.chop((games) => {
      const game = pipe(games, A.findIndex(A.some(isRowWinner(current))))
      if (O.isSome(game)) {
        score = pipe(games[game.value], calculateUnmarkedScore(current))
        return [
          score,
          pipe(
            games,
            A.deleteAt(game.value),
            O.fold(() => games, identity)
          ),
        ]
      }
      index++
      current = numbers.slice(0, index)
      return [score, games]
    }),
    A.last
  )
})

console.log('part 1', part1)
console.log('part 2', part2)
