import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import { createLazyBuffer } from '../src/LazyBuffer.js'
import { Buffer } from 'buffer'
import sinon from 'sinon'

describe('createLazyBuffer', () => {
  describe('given a non-numeric size', () => {
    it('should throw an error', () => {
      assert.throws(() => createLazyBuffer())
    })
  })
  describe('given a numeric size', () => {
    const size = 10
    let lazyBuffer
    let onBufferAllocation
    describe('given no options', () => {
      beforeEach(() => {
        lazyBuffer = createLazyBuffer(size)
      })
      describe('#write', () => {
        it('should write to buffer', () => {
          const msg = 'test'
          lazyBuffer.write(msg)
          assert.equal(lazyBuffer.toString('utf8', 0, msg.length), msg)
        })
      })
    })
    describe('given options.onBufferAllocation is defined and it is not a function', () => {
      it('should throw an error', () => {
        assert.throws(() => createLazyBuffer(size, { onBufferAllocation: 'string' }))
      })
    })
    describe('given options.onBufferAllocation function', () => {
      beforeEach(() => {
        onBufferAllocation = sinon.fake()
        lazyBuffer = createLazyBuffer(size, { onBufferAllocation })
      })

      it('should create a Buffer', () => {
        const buffer = Buffer.of(1)
        getAllFunctions(buffer)
          .forEach(key => assert.isFunction(lazyBuffer[key]))
      })

      describe('#write', () => {
        it('should instantiate buffer', () => {
          assert.isTrue(onBufferAllocation.notCalled, 'Buffer must be instatiated only when write (or another method) is called')
          lazyBuffer.write('test')
          assert.isTrue(onBufferAllocation.calledOnce, 'Buffer must be instantiated only once')
        })
        it('should write to buffer', () => {
          const msg = 'test'
          lazyBuffer.write(msg)
          assert.equal(lazyBuffer.toString('utf8', 0, msg.length), msg)
        })
        describe('called twice', () => {
          it('should instantiate buffer only once', () => {
            assert.isTrue(onBufferAllocation.notCalled, 'Buffer must be instatiated only when write (or another method) is called')
            lazyBuffer.write('test')
            assert.isTrue(onBufferAllocation.calledOnce, 'Buffer must be instantiated')
            lazyBuffer.write('test')
            assert.equal(onBufferAllocation.callCount, 1, 'Buffer must be instantiated only once')
          })
        })
      })
    })
  })
})

function getAllFunctions (obj) {
  const keys = []
  let curr = obj
  while (curr) {
    Object.keys(curr)
      .filter(key => key && typeof curr[key] === 'function')
      .forEach(key => keys.push(key))
    curr = Object.getPrototypeOf(curr)
  }
  return keys
}
