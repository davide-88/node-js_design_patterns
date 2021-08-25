
const privates = new WeakMap()
class WarehouseItemState {
  constructor ({ description, describe }) {
    privates.set(this, { description, describe })
  }

  get description () {
    return privates.get(this).description
  }

  describe (item) {
    return privates.get(this).describe(item)
  }

  toJSON () {
    return {
      ...this,
      description: this.description
    }
  }
}

export class WarehouseItemStates {
  static ARRIVING = new WarehouseItemState({ description: 'arriving', describe: (item) => `Item ${item.id} is on its way to the warehouse` })
  static STORED = new WarehouseItemState({ description: 'stored', describe: (item) => `Item ${item.id} is stored in location ${item.locationId}` })
  static DELIVERED = new WarehouseItemState({ description: 'delivered', describe: (item) => `Item ${item.id} was delivered to ${item.address}` })
}
