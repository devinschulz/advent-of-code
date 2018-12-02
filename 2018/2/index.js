const fs = require('fs')
const path = require('path')

const input = fs
  .readFileSync(path.join(__dirname, './input.txt'), 'utf-8')
  .split('\n')

// Part 1
const getChecksum = input => {
  const countLetters = str =>
    str.split('').reduce((acc, char) => {
      if (acc.hasOwnProperty(char)) {
        acc[char]++
      } else {
        acc[char] = 1
      }
      return acc
    }, {})

  const counter = input.reduce(
    (acc, current) => {
      const count = Object.values(countLetters(current))
      if (count.includes(2)) {
        acc.twos++
      }
      if (count.includes(3)) {
        acc.threes++
      }
      return acc
    },
    { twos: 0, threes: 0 }
  )
  return counter.twos * counter.threes
}

console.log(getChecksum(input))
// => 4940

// Part 2
const findMatch = arr => {
  let bestMatch = []

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        continue
      }
      let diff = 0
      for (let k = 0; k < arr[i].length; k++) {
        if (arr[i].charAt(k) !== arr[j].charAt(k)) {
          diff++
        }
        if (diff > 1) {
          break
        }
      }
      if (diff === 1) {
        bestMatch = [arr[j], arr[i]]
        break
      }
    }
  }

  let result = ''
  if (bestMatch.length) {
    const [bestMatchOne, bestMatchTwo] = bestMatch
    for (let i = 0; i < bestMatchOne.length; i++) {
      if (bestMatchOne.charAt(i) === bestMatchTwo.charAt(i)) {
        result += bestMatchOne.charAt(i)
      }
    }
  }
  return result
}

console.log(findMatch(input))
// => wrziyfdmlumeqvaatbiosngkc
