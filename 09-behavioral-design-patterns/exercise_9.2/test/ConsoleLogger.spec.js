import { describe, beforeEach, afterEach, it } from 'mocha'
import sinon from 'sinon'
import chai from 'chai'
import { ConsoleLogger } from '../src/ConsoleLogger.js'

const assert = chai.assert

describe('ConsoleLogger', () => {
  describe('#_write', () => {
    const logger = new ConsoleLogger()
    beforeEach(() => {
      sinon.replace(
        console,
        'log',
        sinon.fake(() => {})
      )
    })

    afterEach(() => {
      sinon.restore()
    })
    const msgs = [
      null,
      [null],
      [null, null],
      ['test message'],
      ['first', 'second']
    ]
    msgs.forEach(msg => {
      it(`should write on console ${msg ? msg.map(m => m || 'null').join(' ') : msg}`, () => {
        if (msg) { logger._write(...msg) } else { logger._write(msg) }
        assert.isTrue(console.log.calledOnce, 'console.log was not called')
        if (msg) { assert.deepEqual(...console.log.args, msg) } else { assert.deepEqual(...console.log.args, [msg]) }
      })
    })
  })
})
