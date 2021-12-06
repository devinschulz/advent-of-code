import * as A from 'fp-ts/Array'
import { flow, pipe, tupled } from 'fp-ts/function'
import { and, not } from 'fp-ts/lib/Predicate'
import { SemigroupProduct } from 'fp-ts/number'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const input = pipe(
  readFileSync(resolve(__dirname, './input.txt'), 'utf-8'),
  S.split('\n'),
  RA.filter(not(S.isEmpty)),
  RA.toArray
)
const binaryToInteger = (binary: string): number => parseInt(binary, 2)
const multiply = tupled(SemigroupProduct.concat)

const part1 = pipe(
  input,
  A.chop((as) => [
    pipe(
      as,
      A.map((x) => x.slice(0, 1))
    ),
    pipe(
      as,
      A.map((x) => x.slice(1)),
      A.filter(not(S.isEmpty))
    ),
  ]),
  A.map((x) => x.join('')),
  A.reduce(['', ''], ([gamma, epsilon], x) => {
    const zeros = (x.match(/0/g) || []).length
    const ones = x.length - zeros
    return [
      gamma + (zeros > ones ? '1' : '0'),
      epsilon + (zeros > ones ? '0' : '1'),
    ]
  }),
  A.map(binaryToInteger),
  multiply
)

const lifeSupportRating = (callback: (bool: boolean) => string) => {
  let index = 0
  return A.chop<string, string[]>((as) => {
    const column = pipe(
      as,
      A.map((x) => x.charAt(index)),
      (x) => x.join('')
    )
    const zeros = (column.match(/0/g) || []).length
    const ones = column.length - zeros
    const tail = pipe(
      as,
      A.filter(
        and(flow((x) => x.slice(index), S.startsWith(callback(zeros > ones))))(
          not(S.isEmpty)
        )
      )
    )
    index++
    return tail.length === 1 ? [tail, []] : [undefined, tail]
  })
}

const part2 = pipe(
  input,
  (input) =>
    pipe(
      [
        pipe(
          input,
          lifeSupportRating((x) => (x ? '0' : '1')),
          A.flatten
        ),
        pipe(
          input,
          lifeSupportRating((x) => (x ? '1' : '0')),
          A.flatten
        ),
      ],
      A.flatten
    ),
  A.map(binaryToInteger),
  multiply
)

console.log('part 1', part1)
console.log('part 2', part2)
