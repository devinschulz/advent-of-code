import { pipe } from 'fp-ts/function'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import * as A from 'fp-ts/Array'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as N from 'fp-ts/number'
import { isNumber } from 'fp-ts/number'

const [xMin, xMax, yMin, yMax] = pipe(
  readFileSync(resolve(__dirname, './input.txt'), 'utf-8'),
  (x) => x.match(/-?\d+/g),
  A.map(Number)
)

const calculate = pipe(
  NEA.range(0, 300),
  NEA.map((vx) =>
    pipe(
      NEA.range(-300, 300),
      NEA.map((vy) => {
        let x = 0
        let y = 0
        let maxHeight = y
        let velocityX = vx
        let velocityY = vy

        while (x <= xMax && y >= yMin) {
          if (maxHeight < y) maxHeight = y
          if (x >= xMin && y <= yMax) return maxHeight

          x += velocityX
          y += velocityY

          velocityX += velocityX < 0 ? 1 : velocityX > 0 ? -1 : 0
          velocityY--
        }
      })
    )
  ),
  NEA.flatten,
  A.filter(isNumber)
)

const part1 = pipe(calculate, NEA.max(N.Ord))
const part2 = pipe(calculate, A.size)

console.log('part 1', part1)
console.log('part 2', part2)
