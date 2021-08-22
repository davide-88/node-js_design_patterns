const methodsToBeIntercepted = new Set()
methodsToBeIntercepted
  .add('log')
  .add('error')
  .add('debug')
  .add('info')

export function consoleTimeStamped (console) {
  return new Proxy(console, {
    get (target, property) {
      if (methodsToBeIntercepted.has(property)) {
        return function () {
          target[property](`[${new Date().toISOString()}]`, ...arguments)
        }
      }
      return target[property]
    }
  })
}
