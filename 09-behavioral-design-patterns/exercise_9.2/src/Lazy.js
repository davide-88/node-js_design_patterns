export function lazy (instantiator) {
  return new Lazy(instantiator)
}

const privates = new WeakMap()
class Lazy {
  constructor (supplier) {
    if (!supplier || typeof supplier !== 'function') {
      throw new Error('supplier must be a function')
    }
    privates.set(this, {
      supplier,
      initialized: false
    })
  }

  get () {
    const self = privates.get(this)
    if (!self.initialized) {
      self.value = self.supplier()
      self.initialized = true
    }
    return self.value
  }
}
