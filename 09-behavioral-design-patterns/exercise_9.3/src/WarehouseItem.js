import { WarehouseItemStates } from './WarehouseItemState.js'
import randomUUID from 'uuid-random'

export function createWarehouseItem (options) {
  return new WarehouseItem(options)
}

const defaultOpts = {
  state: WarehouseItemStates.ARRIVING
}

const privates = new WeakMap()
class WarehouseItem {
  constructor (options = defaultOpts) {
    const mergedOpts = { ...defaultOpts, ...filterNonEmptyProps(options) }
    if (!mergedOpts.id) {
      mergedOpts.id = randomUUID()
    }
    privates.set(this, {
      ...mergedOpts
    })
  }

  get id () {
    return privates.get(this).id
  }

  get state () {
    return privates.get(this).state
  }

  get locationId () {
    return privates.get(this).locationId
  }

  get address () {
    return privates.get(this).address
  }

  store (locationId) {
    if (this.state !== WarehouseItemStates.ARRIVING) {
      throw Error(`store can be invoked only if current state is ${WarehouseItemStates.ARRIVING.description}`)
    }
    const _self = privates.get(this)
    _self.locationId = locationId
    _self.state = WarehouseItemStates.STORED
  }

  deliver (address) {
    if (this.state !== WarehouseItemStates.STORED) {
      throw Error(`deliver can be invoked only if current state is ${WarehouseItemStates.STORED.description}`)
    }
    const _self = privates.get(this)
    _self.address = address
    _self.state = WarehouseItemStates.DELIVERED
  }

  describe () {
    return this.state.describe(this)
  }
}

function filterNonEmptyProps (obj) {
  return Object.entries(obj || {})
    .filter(([_, value]) => !!value)
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {})
}
