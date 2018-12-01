const fs = require('fs')
const path = require('path')

const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf-8')

const sign = s => x => x.startsWith(s)
const isPositive = sign('+')

const format = input
  .split('\n')
  .map(str => +(isPositive(str) ? str.substring(1) : str))

// Part 1
function getFrequencySum(frequencies) {
  return frequencies.reduce((sum, frequency) => sum + frequency, 0)
}

console.log(`Sum: ${getFrequencySum(format)}`)
// => 592

// Part 2
function findDuplicate(frequencies) {
  const set = new Set()
  let sum = 0
  let i = 0

  while (true) {
    sum += format[i]
    if (set.has(sum)) {
      return sum
    }
    set.add(sum)
    i++
    if (i === format.length - 1) {
      i = 0
    }
  }
}

console.log(`First duplicate: ${findDuplicate(format)}`)
// => 241
