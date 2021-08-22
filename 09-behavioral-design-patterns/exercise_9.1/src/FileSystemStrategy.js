import fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import os from 'os'
import { lazy } from './Lazy.js'
import { StrategyType } from './StrategyType.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function fileSystemStrategy (options) {
  return new FileSystemStrategy(options)
}

const privates = new WeakMap()

class FileSystemStrategy extends StrategyType {
  constructor (options = {
    logDirectory: `${__dirname}`
  }) {
    super()
    const self = this
    privates.set(self, {
      ...options,
      writeStream: lazy(() => {
        const logDirectory = privates.get(self).logDirectory
        return fs.createWriteStream(`${logDirectory}/logger.log`, {
          flags: 'a'
        })
      })
    })
  }

  write () {
    privates.get(this).writeStream.get()
      .write(toMessage(arguments) + os.EOL)
  }
}

function toMessage (args) {
  return new Array(...args).map(arg => stringify(arg)).join(' ')
}

function stringify (arg) {
  if (arg instanceof Object) {
    return JSON.stringify(arg)
  }
  return arg || 'null'
}
