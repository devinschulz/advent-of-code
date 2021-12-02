import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const input = pipe(
  readFileSync(resolve(__dirname, './input.txt'), 'utf-8'),
  S.split('\n'),
  RA.map(pipe(S.split(' '))),
  A.map<[string, string], [string, number]>(([a, b]) => [a, parseInt(b)])
)

const part1 = pipe(
  input,
  A.reduce({ horizontal: 0, depth: 0 }, (a, [k, v]) => {
    if (k === 'forward') {
      return {
        ...a,
        horizontal: a.horizontal + v,
      }
    }
    if (k === 'down') {
      return {
        ...a,
        depth: a.depth + v,
      }
    }
    if (k === 'up') {
      return {
        ...a,
        depth: a.depth - v,
      }
    }
    return a
  }),
  ({ horizontal, depth }) => horizontal * depth
)

const part2 = pipe(
  input,
  A.reduce(
    {
      horizontal: 0,
      depth: 0,
      aim: 0,
    },
    (a, [k, v]) => {
      if (k === 'forward') {
        return {
          ...a,
          depth: a.depth + a.aim * v,
          horizontal: a.horizontal + v,
        }
      }
      if (k === 'down') {
        return {
          ...a,
          aim: a.aim + v,
        }
      }
      if (k === 'up') {
        return {
          ...a,
          aim: a.aim - v,
        }
      }
      return a
    }
  ),
  ({ horizontal, depth }) => horizontal * depth
)

console.log('part 1', part1)
console.log('part 2', part2)
