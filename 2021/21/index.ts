import * as A from 'fp-ts/Array'
import { identity, pipe } from 'fp-ts/function'
import { concatAll } from 'fp-ts/NonEmptyArray'
import * as N from 'fp-ts/number'
import * as O from 'fp-ts/Option'

interface State {
  score: number
  position: number
  rolls: number
}

const p1: State = {
  score: 0,
  position: 8,
  rolls: 0,
}
const p2: State = {
  score: 0,
  position: 3,
  rolls: 0,
}

const ROLLS_PER_TURN = 3

const roll = (() => {
  let counter = 0
  return () => {
    counter = (counter % 100) + 1
    return counter
  }
})()

const sum = concatAll(N.SemigroupSum)

const part1 = pipe(
  [p1, p2],
  A.chop(([p1, p2]) => {
    p1.position += pipe(A.makeBy(ROLLS_PER_TURN, roll), sum)
    p1.position = ((p1.position - 1) % 10) + 1
    p1.score += p1.position
    p1.rolls += ROLLS_PER_TURN
    return p1.score >= 1000 ? [[p1, p2], []] : [undefined, [p2, p1]]
  }),
  A.flatten,
  (players: State[]) => {
    const rolls = pipe(
      players,
      A.map((x) => x.rolls),
      sum
    )
    const loser = pipe(
      players,
      A.map((x) => x.score),
      A.sort(N.Ord),
      A.head,
      O.fold(() => 0, identity)
    )
    return rolls * loser
  }
)

console.log('part 1', part1)
