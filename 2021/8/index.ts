import { flow, pipe } from 'fp-ts/function'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import * as S from 'fp-ts/string'
import * as RA from 'fp-ts/ReadonlyArray'
import * as A from 'fp-ts/Array'
import { not } from 'fp-ts/Predicate'

const input = pipe(
  readFileSync(resolve(__dirname, './input.txt'), 'utf-8'),
  S.split('\n'),
  RA.filter(not(S.isEmpty)),
  RA.map(flow(S.split(' | '), RA.map(S.split(' ')), RA.toArray)),
  RA.toArray
)

const part1 = pipe(
  input,
  A.map(([, output]) =>
    pipe(
      output,
      RA.map(S.size),
      RA.filter((x) => [2, 4, 3, 7].includes(x)),
      RA.size
    )
  ),
  A.reduce(0, (acc, x) => acc + x)
)

console.log('part 1', part1)
