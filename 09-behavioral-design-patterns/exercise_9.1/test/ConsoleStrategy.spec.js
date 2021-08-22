import { describe, beforeEach, afterEach, it } from 'mocha'
import sinon from 'sinon'
import chai from 'chai'
import { consoleStrategy } from '../src/ConsoleStrategy.js'

const assert = chai.assert

describe('ConsoleStrategy', () => {
  describe('#write', () => {
    let consoleFake
    let strategy
    beforeEach(() => {
      consoleFake = sinon.replace(
        console,
        'log',
        sinon.fake(() => {})
      )
      strategy = consoleStrategy()
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
        if (msg) { strategy.write(...msg) } else { strategy.write(msg) }
        assert.isTrue(consoleFake.calledOnce, 'console.log was not called')
        if (msg) { assert.deepEqual(...consoleFake.args, msg) } else { assert.deepEqual(...consoleFake.args, [msg]) }
      })
    })
  })
})
