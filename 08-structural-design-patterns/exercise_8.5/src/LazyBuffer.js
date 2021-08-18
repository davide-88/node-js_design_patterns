import { lazy } from './Lazy.js'

export function createLazyBuffer (
  size,
  options = {
    onBufferAllocation: () => {}
  }
) {
  validateInputParams(size, options)
  const lazyBuffer = lazy(() => {
    options.onBufferAllocation()
    return Buffer.alloc(size)
  })
  return new Proxy(
    {},
    {
      get: (target, property) => {
        const buffer = lazyBuffer.get()
        return buffer[property].bind(buffer)
      }
    }
  )
}

function validateInputParams (size, options) {
  validateSize(size)
  validateOptions(options)
}

function validateOptions (options) {
  if (options &&
    options.onBufferAllocation &&
    typeof options.onBufferAllocation !== 'function') {
    throw new Error(
      'If provided, options.onBufferAllocation must be a function'
    )
  }
}

function validateSize (size) {
  if (!size || Number.isNaN(size)) {
    throw new Error(`size (${size}) must be an interger.`)
  }
}
