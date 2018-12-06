const fs = require('fs')
const path = require('path')

const input = fs
  .readFileSync(path.join(__dirname, './input.txt'), 'utf-8')
  .trim()

const isLower = char => char === char.toLowerCase()
const isUpper = char => char === char.toUpperCase()

const isReactive = (char1, char2) => {
  if (
    char1 === char2 ||
    (isLower(char1) && isLower(char2)) ||
    (isUpper(char1) && isUpper(char2)) ||
    char1.toLowerCase() !== char2.toLowerCase()
  ) {
    return false
  }
  if (char1.toLowerCase() === char2.toLowerCase()) {
    return true
  }
  return false
}

// Part 1
const getScannedPolymer = input => {
  let arr = input.split('')
  let i = 0
  while (i < arr.length) {
    if (arr[i] && arr[i + 1] && isReactive(arr[i], arr[i + 1])) {
      arr.splice(i, 2)
      i--
      continue
    }
    i++
  }
  return arr.join('').length
}

console.log(getScannedPolymer(input))
// => 11242

// Part 2
const chars = 'abcdefghijklmnopqrstuvwxyz'
const result = {}

for (let i = 0; i < chars.length; i++) {
  result[chars.charAt(i)] = getScannedPolymer(
    input.replace(new RegExp(chars.charAt(i), 'gi'), '')
  )
}

console.log(
  Object.values(result)
    .sort()
    .reverse()[0]
)
// => 5492
