export const memoize = (fn) => {
  let cache = {}
  return (...args) => {
    const key = JSON.stringify(args)
    if (key in cache) {
      return cache[key]
    }
    const result = fn(...args)
    cache[key] = result
    return result
  }
}
