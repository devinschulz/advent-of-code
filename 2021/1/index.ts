import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { not } from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import { concatAll } from 'fp-ts/Semigroup'
import * as S from 'fp-ts/string'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const input = pipe(
  readFileSync(resolve(__dirname, './input.txt'), 'utf-8'),
  S.split('\n'),
  RA.map(parseInt)
)

const sum = concatAll(N.SemigroupSum)(0)

const reducer = (input: number[]) =>
  pipe(
    input,
    A.reduceWithIndex(0, (i, a, b) => (i > 0 && b > input[i - 1] ? a + 1 : a))
  )

const part1 = pipe(input, reducer)

const part2 = pipe(input, (input: number[]) =>
  pipe(
    input,
    A.reduceWithIndex<number, number[]>([], (i, a) =>
      pipe(
        a,
        A.concat(pipe(input.slice(i, i + 3), A.filter(not(isNaN)), sum, A.of))
      )
    ),
    reducer
  )
)

console.log('part 1', part1)
console.log('part 2', part2)
