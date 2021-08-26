/* eslint-disable no-undef */
import { assert } from 'chai'
import { consoleTimeStamped } from './../src/ConsoleTimeStamped.js'
import sinon from 'sinon'

describe('consoleTimeStamped', () => {
  it('should return a proxy for console', () => {
    const timeStampedConsole = consoleTimeStamped(console)
    assert.isNotNull(timeStampedConsole)
    assert.isFunction(timeStampedConsole.log)
    assert.isFunction(timeStampedConsole.error)
    assert.isFunction(timeStampedConsole.debug)
    assert.isFunction(timeStampedConsole.info)
  })

  describe('#clear', () => {
    it('should execute the original property', () => {
      const timeStampedConsole = consoleTimeStamped(console)
      assert.equal(timeStampedConsole.clear, console.clear)
    })
  })

  const methods = ['log', 'error', 'debug', 'info']
  methods.forEach((method) => {
    describe(`#${method}`, () => {
      let consoleFake
      let timeStampedConsole

      beforeEach(() => {
        consoleFake = sinon.replace(
          console,
          method,
          sinon.fake(() => {})
        )
        timeStampedConsole = consoleTimeStamped(console)
      })

      afterEach(() => {
        sinon.restore()
      })
      const messages = [null, [null], ['text message'], ['array', 'messages']]
      messages.forEach(msg => {
        const fullMsg = msg && msg.join(' ')
        const timeStampedMsgRegExp =
          /\[[0-9]{0,4}-[0-9]{0,2}-[0-9]{0,2}T[0-9]{0,2}:[0-9]{0,2}:[0-9]{0,2}.[0-9]{0,3}Z\]/
        it(`should prepend a the timestamp to the message: '${fullMsg}'`, () => {
          if (msg) {
            timeStampedConsole[method](...msg)
          } else {
            timeStampedConsole[method](msg)
          }
          assert.equal(consoleFake.callCount, 1)
          const firstCallArgs = consoleFake.firstCall.args
          assert.equal(firstCallArgs && firstCallArgs.length, msg ? msg.length + 1 : 2)
          assert.match(firstCallArgs[0], timeStampedMsgRegExp)
          firstCallArgs
            .filter((_, i) => i > 0)
            .forEach((arg, i) => {
              assert.equal(arg, msg && msg[i])
            })
        })
      })
    })
  })
})
