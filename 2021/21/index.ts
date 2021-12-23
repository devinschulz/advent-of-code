import * as A from 'fp-ts/Array'
import { identity, pipe, tupled } from 'fp-ts/function'
import { concatAll } from 'fp-ts/NonEmptyArray'
import * as N from 'fp-ts/number'
import * as O from 'fp-ts/Option'
import { memoize } from '../utils'

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
    p1.position += pipe(A.makeBy(3, roll), sum)
    p1.position = ((p1.position - 1) % 10) + 1
    p1.score += p1.position
    p1.rolls += 3
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

const rolls = [
  [3, 1],
  [4, 3],
  [5, 6],
  [6, 7],
  [7, 6],
  [8, 3],
  [9, 1],
]

const play = memoize((pos1, pos2, score1 = 0, score2 = 0) => {
  if (score2 >= 21) return [0, 1]
  return pipe(
    rolls,
    A.reduce([0, 0], ([wins1, wins2], [move, num]) => {
      const position = ((pos1 + move - 1) % 10) + 1
      const [win2, win1] = play(pos2, position, score2, score1 + position)
      return [wins1 + num * win1, wins2 + num * win2]
    })
  )
})

const part2 = pipe(play(8, 3), tupled(Math.max))

console.log('part 1', part1)
console.log('part 2', part2)
