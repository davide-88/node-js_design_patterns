import { LoggerLevels } from './LoggerLevels.js'

const defaultOptions = {
  level: LoggerLevels.INFO
}
const privates = new WeakMap()
export class LoggerTemplate {
  constructor (options = defaultOptions) {
    const mergedOptions = { ...defaultOptions, ...options }
    validate(mergedOptions)
    privates.set(this, mergedOptions)
  }

  get level () {
    return privates.get(this).level
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

  _write () {
    throw Error('_write must be implemented')
  }
}

function validate (options) {
  if (!options.level || typeof options.level.level !== 'number' || !options.level.description) {
    throw Error('Invalid input options: level must be an object having level and description property')
  }
}

function log (loggerLevel) {
  const privateAttrs = privates.get(this)
  if (privateAttrs.level >= loggerLevel) {
    this._write(...arguments[1])
  }
}
