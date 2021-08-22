import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import { StrategyType } from '../src/StrategyType.js'

describe('StrategyType', () => {
  let strategyType
  beforeEach(() => {
    strategyType = new StrategyType()
  })
  describe('#type', () => {
    it(`should return ${StrategyType.name}`, () => {
      assert.equal(strategyType.type, StrategyType.name)
    })
  })

  describe('#toJSON', () => {
    const json = { type: 'StrategyType' }
    it(`should return ${json}`, () => {
      assert.deepEqual(strategyType.toJSON(), json)
    })
  })
})
