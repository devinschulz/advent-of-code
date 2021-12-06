import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'
import { not } from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const input = pipe(
  readFileSync(resolve(__dirname, './input.txt'), 'utf-8'),
  S.split(','),
  RA.filter(not(S.isEmpty)),
  RA.map(Number),
  RA.toArray,
  A.reduce(
    pipe(
      Array.from({ length: 9 }),
      A.map(() => 0)
    ),
    (acc, x) => {
      acc[x] = (acc[x] || 0) + 1
      return acc
    }
  )
)

const countFish = (days: number) => (fish: number[]) => {
  let day = 0
  return A.chop<number, number[]>((as) => {
    const head = as[0]
    const tail = as.slice(1)
    tail[6] += head
    const fish = tail.concat(head)
    day++
    return day === days ? [fish, []] : [undefined, fish]
  })(fish)
}

const sum = A.reduce<number, number>(0, (acc, x) => acc + x)

const part1 = pipe(input, countFish(80), A.flatten, sum)
const part2 = pipe(input, countFish(256), A.flatten, sum)

console.log('part 1', part1)
console.log('part 2', part2)
