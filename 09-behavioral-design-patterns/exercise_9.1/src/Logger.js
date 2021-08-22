import { LoggerLevels } from './LoggerLevels.js'
import { consoleStrategy } from './ConsoleStrategy.js'

export function newLogger (options) {
  return new Logger(options)
}

const defaultOptions = {
  level: LoggerLevels.INFO,
  writeStrategy: consoleStrategy()
}
const privates = new WeakMap()
class Logger {
  constructor (options = defaultOptions) {
    const mergedOptions = { ...defaultOptions, ...options }
    validate(mergedOptions)
    privates.set(this, mergedOptions)
  }

  get level () {
    return privates.get(this).level
  }

  get writeStrategy () {
    return privates.get(this).writeStrategy
  }

  debug () {
    log.call(this, LoggerLevels.DEBUG, arguments)
  }

  info () {
    log.call(this, LoggerLevels.INFO, arguments)
  }

  warn () {
    log.call(this, LoggerLevels.WARN, arguments)
  }

  error () {
    log.call(this, LoggerLevels.ERROR, arguments)
  }
}

function validate (options) {
  if (!options.level || typeof options.level.level !== 'number' || !options.level.description) {
    throw Error('Invalid input options: level must be an object having level and description property')
  }
  if (!options.writeStrategy || typeof options.writeStrategy.write !== 'function') {
    throw Error('Invalid input options: writeStrategy must be an object having write method')
  }
}

function log (loggerLevel) {
  const privateAttrs = privates.get(this)
  if (privateAttrs.level >= loggerLevel) {
    privateAttrs.writeStrategy.write(...arguments[1])
  }
}
