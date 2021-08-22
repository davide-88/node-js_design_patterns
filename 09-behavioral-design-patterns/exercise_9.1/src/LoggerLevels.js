const privates = new WeakMap()
class LoggerLevel {
  constructor (level, description) {
    privates.set(this, {
      level,
      description
    })
  }

  get level () {
    return getPrivateProp.call(this, 'level')
  }

  get description () {
    return getPrivateProp.call(this, 'description')
  }

  toJSON () {
    return {
      ...this,
      level: this.level,
      description: this.description
    }
  }
}

function getPrivateProp (propName) {
  const privateAttrs = privates.get(this)
  return privateAttrs && privateAttrs[propName]
}

export class LoggerLevels {
  static DEBUG = new LoggerLevel(0, 'DEBUG')
  static INFO = new LoggerLevel(LoggerLevels.DEBUG.level + 1000, 'INFO')
  static WARN = new LoggerLevel(LoggerLevels.INFO.level + 1000, 'WARN')
  static ERROR = new LoggerLevel(LoggerLevels.WARN.level + 1000, 'ERROR')
}
