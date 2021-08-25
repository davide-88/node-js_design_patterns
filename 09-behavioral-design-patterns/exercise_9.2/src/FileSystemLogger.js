import { LoggerTemplate } from './LoggerTemplate.js'
import fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import os from 'os'
import { lazy } from './Lazy.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const privates = new WeakMap()
export class FileSystemLogger extends LoggerTemplate {
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

  _write () {
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
