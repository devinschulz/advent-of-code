const fs = require('fs')
const path = require('path')

const getMinutes = (start, end, hours = {}) => {
  let loop = start
  while (loop <= end) {
    const minute = loop.getMinutes()
    hours[minute] = (hours[minute] || 0) + 1
    loop = new Date(loop.setTime(loop.getTime() + 1000 * 60))
  }
  return hours
}

const sortByDate = (a, b) => a.date.getTime() - b.date.getTime()

const formatData = line => {
  let [date, event] = line.match(/(\[.+\])|.+/g)
  date = new Date(date.slice(1, -1))
  event = event.trim().toLowerCase()
  const sleep = event.includes('falls asleep')
  const wokeUp = event.includes('wakes up')
  const beginsShift = event.includes('begins shift')
  let id
  if (event.includes('guard')) {
    ;[id] = event.match(/#\d+/)
  }
  return { id, date, event, sleep, wokeUp, beginsShift }
}

const calculateSleepTime = (acc, current) => {
  if (current.id) {
    acc.guard = current.id
    acc.events[acc.guard] = acc.events[acc.guard] || {
      minutesAsleep: 0,
      hours: {},
    }
  } else if (current.sleep) {
    acc.fellAsleepAt = current.date
  } else if (current.wokeUp) {
    const minutesAsleep =
      current.date.getMinutes() - acc.fellAsleepAt.getMinutes()
    acc.events[acc.guard] = {
      minutesAsleep: acc.events[acc.guard].minutesAsleep + minutesAsleep,
      hours: getMinutes(
        acc.fellAsleepAt,
        current.date,
        acc.events[acc.guard].hours
      ),
    }
  }
  return acc
}

const input = fs
  .readFileSync(path.join(__dirname, './input.txt'), 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map(formatData)
  .sort(sortByDate)
  .reduce(calculateSleepTime, {
    guard: undefined,
    fellAsleepAt: undefined,
    events: {},
  })

const events = Object.entries(input.events).sort(
  (a, b) => b[1].minutesAsleep - a[1].minutesAsleep
)
const hour = Object.entries(events.slice(0, 1)[0][1].hours).sort(
  (a, b) => b[1] - a[1]
)[0]

console.log('Part 1: %s', events[0][0].substring(1) * hour[0])
// => 87681

// Part 2
const result = Object.entries(input.events).reduce(
  (acc, [id, { minutesAsleep, hours }]) => {
    acc[id] = Object.entries(hours).reduce(
      (result, [min, count]) => {
        if (count > result.bestMinuteValue) {
          result.bestMinute = min
          result.bestMinuteValue = count
        }
        return result
      },
      {
        bestMinute: 0,
        bestMinuteValue: 0,
      }
    )
    return acc
  },
  {}
)

const [id, { bestMinute }] = Object.entries(result).sort(
  (a, b) => b[1].bestMinuteValue - a[1].bestMinuteValue
)[0]
console.log('Part 2: %s', id.substring(1) * bestMinute)
// => 136461
