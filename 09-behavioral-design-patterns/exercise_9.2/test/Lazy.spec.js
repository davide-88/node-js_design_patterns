import { describe, it, beforeEach } from 'mocha'
import chai from 'chai'
import { lazy } from '../src/Lazy.js'
import sinon from 'sinon'

const assert = chai.assert
const should = chai.should()

describe('lazy', () => {
  describe('given supplier is a function', () => {
    it('should return a Lazy instance', () => {
      const lazyInstance = lazy(() => {})
      should.exist(lazyInstance)
      assert.isFunction(lazyInstance.get)
    })
  })

  const testCases = [null, 'a string']
  testCases.forEach(testCase => {
    describe(`given supplier is ${testCase}`, () => {
      it('should throw an error', () => {
        assert.throws(() => lazy(testCase), 'supplier must be a function')
      })
    })
  })
})

describe('Lazy', () => {
  let lazyInstance
  let obj
  let supplier
  beforeEach(() => {
    obj = { key: 'value' }
    supplier = sinon.fake.returns(obj)
    lazyInstance = lazy(supplier)
  })
  describe('#get', () => {
    it('should return the instance returned by the instantiator', () => {
      assert.equal(lazyInstance.get(), obj)
    })
    describe('called twice', () => {
      it('instantiator is called once', () => {
        lazyInstance.get()
        lazyInstance.get()
        assert.equal(supplier.callCount, 1)
      })
    })
  })
})
