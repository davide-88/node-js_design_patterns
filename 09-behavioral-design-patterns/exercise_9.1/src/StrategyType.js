
export class StrategyType {
  get type () {
    return this.constructor.name
  }

  toJSON () {
    return {
      ...this,
      type: this.type
    }
  }
}
