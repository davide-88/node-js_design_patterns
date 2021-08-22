import { resolve } from 'path'

function getErrorNotFound (filename) {
  const err = new Error(`ENOENT, open "${filename}"`)
  err.code = 'ENOENT'
  err.errno = 34
  err.path = filename
  return err
}

export function createFSAdapter () {
  const inMemoryStore = new Map()
  return {
    readFile (filename, options, callback) {
      if (typeof options === 'function') {
        callback = options
        options = {}
      }
      process.nextTick(() => {
        const content = inMemoryStore.get(resolve(filename))
        if (content) {
          callback(null, content)
        } else {
          callback(getErrorNotFound(filename))
        }
      })
    },
    writeFile (filename, contents, options, callback) {
      try {
        if (typeof options === 'function') {
          callback = options
          options = {}
        }
        inMemoryStore.set(resolve(filename), contents)
        process.nextTick(() => callback(null, { filename, contents }))
      } catch (e) {
        process.nextTick(() => callback(e))
      }
    }
  }
}
