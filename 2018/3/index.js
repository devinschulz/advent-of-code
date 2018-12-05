const fs = require('fs')
const path = require('path')

const input = fs
  .readFileSync(path.join(__dirname, './input.txt'), 'utf-8')
  .split('\n')
  .filter(Boolean)

const toInt = x => +x

const claims = input.map(claim => {
  const [hash, coords, dimensions] = claim.match(
    /(#\d+)|(\d+[,]\d+)|(\d+x\d+)/g
  )
  const id = toInt(hash.substring(1))
  const [x, y] = coords.split(',').map(toInt)
  const [width, height] = dimensions.split('x').map(toInt)
  return { id, x, y, width, height }
})

const getUsed = claims => {
  const claimed = claims.reduce((acc, { x, y, width, height }) => {
    for (let i = x; i < x + width; i++) {
      for (let j = y; j < y + height; j++) {
        const key = `${i},${j}`
        acc[key] = (acc[key] || 0) + 1
      }
    }
    return acc
  }, {})
  return Object.values(claimed).filter(claim => claim > 1).length
}

console.log(getUsed(claims))
//=> 118223

const findNonOverlapping = claims => {
  const claimed = claims.reduce(
    (acc, { id, x, y, width, height }) => {
      acc.claims[id] = true
      for (let i = x; i < x + width; i++) {
        for (let j = y; j < y + height; j++) {
          const key = `${i},${j}`
          if (acc.grid[key]) {
            acc.claims[acc.grid[key]] = false
            acc.claims[id] = false
          }
          acc.grid[key] = id
        }
      }
      return acc
    },
    {
      claims: {},
      grid: {},
    }
  )
  return Object.entries(claimed.claims).filter(claim => claim[1])
}

console.log(findNonOverlapping(claims))
// => #412
